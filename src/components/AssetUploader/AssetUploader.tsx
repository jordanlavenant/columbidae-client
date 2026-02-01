import { useState, useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Upload, Trash, Loader } from 'lucide-react'
import { useEndpoint } from '../../hooks/use-endpoint'

interface UploadedAsset {
  id: string
  url: string
  key: string
  fileName: string
  mimeType: string
  size: number
}

interface AssetUploaderProps {
  onUploadSuccess?: (asset: UploadedAsset) => void
}

const AssetUploader = ({ onUploadSuccess }: AssetUploaderProps) => {
  const endpoint = useEndpoint()
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setFileType(selectedFile.type)
      setError(null)

      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Aucun fichier sélectionné')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'posts')

      const response = await fetch(`${endpoint}/api/assets/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || "Erreur lors de l'upload du fichier"
        )
      }

      const uploadedAsset: UploadedAsset = await response.json()

      // Réinitialiser le formulaire
      handleDiscard()

      // Appeler le callback si fourni
      if (onUploadSuccess) {
        onUploadSuccess(uploadedAsset)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDiscard = () => {
    setPreview(null)
    setFileName(null)
    setFileType(null)
    setFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isImage = fileType?.startsWith('image/')
  const isVideo = fileType?.startsWith('video/')
  const isAudio = fileType?.startsWith('audio/')

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Upload Area */}
      {!preview ? (
        <div
          className="flex flex-col items-center justify-center w-full p-6 md:p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 md:w-10 md:h-10 mb-2 text-gray-400" />
          <p className="text-sm md:text-base font-medium text-gray-700">
            Click to upload
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-2">Image, Video or Audio</p>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        /* Preview Area */
        <div className="w-full flex flex-col gap-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Preview Container */}
          <div className="relative w-full bg- rounded-lg overflow-hidden">
            {isImage ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain"
              />
            ) : isVideo ? (
              <video
                src={preview}
                controls
                className="w-full h-auto max-h-96 object-contain"
              />
            ) : isAudio ? (
              <audio src={preview} controls className="w-full" />
            ) : (
              <div className="w-full p-8 flex items-center justify-center min-h-48">
                <p className="text-gray-500">File preview not available</p>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-gray-600">
              <span className="font-semibold">File:</span> {fileName}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:flex-row">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              disabled={isLoading}
              className="col-span-2 text-sm md:text-base font-mono hover:cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Modifier
            </Button>
            <Button
              onClick={handleDiscard}
              variant="destructive"
              disabled={isLoading}
              className="col-span-1 text-sm md:text-base font-mono"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className="w-full text-sm md:text-base font-mono"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

export default AssetUploader
