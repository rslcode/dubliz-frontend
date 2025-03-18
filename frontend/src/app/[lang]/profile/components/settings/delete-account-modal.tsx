import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const DeleteAccountModal = (props: {
  isOpened: boolean
  close: () => void
  onSubmit: () => Promise<boolean>
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const router = useRouter()
  const { isOpened, close, onSubmit } = props
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  const handleAccept = async () => {
    if (deleteInProgress) {
      return
    }

    setDeleteInProgress(true)
    const deleted = await onSubmit()
    if (!deleted) {
      toast.error(t('profile.update.delete_account_error'))
    }
    setDeleteInProgress(false)
    if (deleted) {
      close()
      router.push('/auth/login')
    }
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '550px',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
        modal: 'info-modal',
      }}
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <h4>{t('profile.update.delete_account')}</h4>
      <p className="mt-10">{t('profile.update.are_you_sure_to_delete')}</p>
      <p className="mt-0">{t('profile.update.delete_account_details')}</p>

      <div className="d-flex justify-content-between gap-3">
        <button className="btn btn-secondary flex-grow-1" onClick={() => close()}>
          {t('generic.cancel')}
        </button>
        <button
          className="btn fill-btn flex-grow-1"
          disabled={deleteInProgress}
          onClick={handleAccept}
        >
          {deleteInProgress ? (
            <div className="loader-wrapper">
              <Icon type="loading" size={40} />
            </div>
          ) : (
            t('profile.update.delete_account')
          )}
        </button>
      </div>
    </CustomModal>
  )
}
