import { useTranslation } from "@/app/i18n/client"
import { CustomModal } from "@/components/common/custom-modal"
import { Icon } from "@/components/common/icon"
import { GenericController } from "@/core/controllers/generic"
import useGlobalContext from "@/hooks/use-context"
import { useState } from "react"
import { toast } from "react-toastify"

interface SendUsAMessageModalProps {
  isOpened: boolean
  close: () => void
}

export const SendUsAMessageModal = (props: SendUsAMessageModalProps) => {
  const { isOpened, close } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async () => {
    if (isSending) {
      return
    }

    if (message.length === 0) {
      return
    }

    setIsSending(true)
    const sent = await GenericController.sendMessage(message)
    if (sent) {
      toast.success(t('profile.more.send_message.message_sent'))
      setMessage('')
      close()
    } else {
      toast.error(t('profile.more.send_message.could_not_send'))
    }
    setIsSending(false)
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '700px',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
        modal: 'info-modal create-bid-modal',
      }}
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <h4>{t('profile.more.send_message.title')} </h4>
      <div className="d-flex flex-column gap-10 mt-20">
        <textarea
          className="w-100 custom-textarea"
          placeholder={t('profile.more.send_message.input_placeholder')}
          value={message}
          maxLength={1000}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="d-flex justify-content-end mt-1">
          <span className="fw-light">{message.length}/1000</span>
        </div>
        <button
          disabled={message.length === 0 || isSending}
          className={`w-100 mt-20 ${message.length === 0 || isSending ? 'disabled-btn' : 'fill-btn'}`}
          onClick={handleSendMessage}
        >
          {isSending ? <Icon type="generic/loading" /> : t('profile.more.send_message.send_message')}
        </button>
      </div>
    </CustomModal>
  )
}
