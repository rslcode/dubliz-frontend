import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useCallback, useRef } from 'react'

export const UploadProfileImageButton = (props: { onFilesPick: (files: File) => void }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { onFilesPick } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.click()
    }
  }, [inputRef])

  const handleInputChange = useCallback(async () => {
    if (!inputRef.current || !inputRef.current.files) {
      return
    }

    onFilesPick(inputRef.current.files[0] as unknown as File)
  }, [inputRef, onFilesPick])

  return (
    <>
      <input
        onChange={handleInputChange}
        onClick={(event) => {
          const element = event.currentTarget as HTMLInputElement
          element.value = ''
        }}
        ref={inputRef}
        type="file"
        accept={'image/jpeg, image/png, image/webp, image/tiff, image/heic, image/heif'}
        multiple={false}
        className="file-input"
      />

      <div className="d-flex justify-content-center align-items-center" onClick={handleButtonClick}>
        <button className="border-btn" aria-label={t('profile.update.change_profile_picture')}>
          {t('profile.update.change_profile_picture')}
        </button>
      </div>

      <style jsx>{`
        .file-input {
          display: none;
        }
      `}</style>
    </>
  )
}
