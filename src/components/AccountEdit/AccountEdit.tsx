import { useState } from 'react'
import type { User } from '@/services/models/user/user'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getInitials } from '@/lib/utils'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import AssetUploader from '../AssetUploader/AssetUploader'
import { Alert, AlertDescription } from '../ui/alert'
import { useEndpoint } from '@/hooks/use-endpoint'
import updateUser from '@/services/functions/user/update-user'
import createAsset from '@/services/functions/asset/create-asset'

const AccountEdit = ({ user }: { user: User }) => {
  const endpoint = useEndpoint()

  // Form state
  const [username, setUsername] = useState(user.username)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Password validation
  const passwordsMatch = newPassword === confirmPassword
  const showPasswordError = confirmPassword.length > 0 && !passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (newPassword && !currentPassword) {
      setError('Veuillez entrer votre mot de passe actuel pour le changer')
      return
    }

    if (newPassword && newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (newPassword && !passwordsMatch) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      let avatarId: string | undefined

      // Upload avatar si présent
      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)
        formData.append('folder', 'avatars')

        const assetResponse = await createAsset(endpoint, formData)

        if (!assetResponse.ok) {
          throw new Error("Erreur lors de l'upload de l'avatar")
        }

        const asset = await assetResponse.json()
        avatarId = asset.id
      }

      // Mise à jour du profil
      const response = await updateUser(endpoint, user.id, {
        username,
        name,
        email,
        avatarId,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la mise à jour')
      }

      setSuccess('Profil mis à jour avec succès')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Recharger la page pour mettre à jour les données
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label htmlFor="avatar">Photo de profil</Label>
            <AssetUploader
              onFileSelect={setAvatarFile}
              disabled={loading}
              label={'Ajouter / changer la photo de profil'}
            />
          </div>

          <section className="flex items-center gap-x-6">
            <Avatar className="size-24 sm:size-36">
              <AvatarImage
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : user.Avatar?.url
                }
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl sm:text-4xl font-mono">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </section>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Separator />

          {/* Password Section */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold">Changer le mot de passe</h2>

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
                placeholder="Laissez vide pour ne pas changer"
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                placeholder="Minimum 6 caractères"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className={showPasswordError ? 'border-destructive' : ''}
              />
              {showPasswordError && (
                <p className="text-sm text-destructive">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading || showPasswordError}>
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default AccountEdit
