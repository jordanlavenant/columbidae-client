import { useState, useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImagePlus, X } from 'lucide-react'

interface AssetUploaderProps {
  onFileSelect?: (file: File | null) => void
  disabled?: boolean
}

const AssetUploader = ({ onFileSelect, disabled }: AssetUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [_file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setFileType(selectedFile.type)

      if (onFileSelect) {
        onFileSelect(selectedFile)
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDiscard = () => {
    setPreview(null)
    setFileName(null)
    setFileType(null)
    setFile(null)
    if (onFileSelect) {
      onFileSelect(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isImage = fileType?.startsWith('image/')
  const isVideo = fileType?.startsWith('video/')

  return (
    <div className="w-full space-y-3">
      {!preview ? (
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => !disabled && fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full hover:cursor-pointer"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Ajouter une photo ou vidéo
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
        </div>
      ) : (
        <div className="w-full space-y-2">
          <div className="relative w-full rounded-md overflow-hidden border bg-muted">
            {isImage ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto max-h-80 object-contain"
              />
            ) : isVideo ? (
              <video
                src={preview}
                controls
                className="w-full h-auto max-h-80 object-contain bg-black"
              />
            ) : null}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDiscard}
              disabled={disabled}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {fileName && (
            <p className="text-xs text-muted-foreground truncate">{fileName}</p>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

export default AssetUploader
