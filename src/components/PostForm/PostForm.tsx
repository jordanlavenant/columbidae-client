import { Plus, Loader } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import AssetUploader from '../AssetUploader/AssetUploader'
import { useEndpoint } from '@/hooks/use-endpoint'
import { useAuth } from '@/hooks/use-auth'
import type { CreatePostPayload } from '@/services/functions/post/create-post'
import createPost from '@/services/functions/post/create-post'
import createAsset from '@/services/functions/asset/create-asset'

const PostForm = () => {
  const { currentUser } = useAuth()
  const endpoint = useEndpoint()

  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Le contenu est requis')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let assetId: string | undefined

      // Upload asset si présent
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('folder', 'posts')

        const assetResponse = await createAsset(endpoint, formData)

        if (!assetResponse.ok) {
          throw new Error("Erreur lors de l'upload du fichier")
        }

        const asset = await assetResponse.json()
        assetId = asset.id
      }

      // Create post
      const payload: CreatePostPayload = {
        content,
        authorId: currentUser!.id,
        assetIds: assetId ? [assetId] : [],
      }
      const postResponse = await createPost(endpoint, payload)

      if (!postResponse.ok) {
        throw new Error('Erreur lors de la création du post')
      }

      // Réinitialiser le formulaire
      setContent('')
      setSelectedFile(null)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="hover:cursor-pointer">
          <Plus className="size-4" />
          <p className="sm:inline hidden">Créer</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogTitle className="mb-4 text-center">
          Créer un nouveau post
        </AlertDialogTitle>
        <AlertDialogDescription />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Qu'avez-vous en tête ?"
            className="w-full min-h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />

          <AssetUploader
            onFileSelect={setSelectedFile}
            disabled={isSubmitting}
            label={'Ajouter une image ou une vidéo'}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="font-mono"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Publication...
              </>
            ) : (
              'Publier'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PostForm
