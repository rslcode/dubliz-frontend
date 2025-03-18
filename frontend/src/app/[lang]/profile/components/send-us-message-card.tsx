import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import Background from '@/../public/assets/img/message.webp'
import { SendUsAMessageModal } from './send-us-message-modal'
import { useState } from 'react'

interface SendUsAMessageCardProps {
  small?: boolean
  withButton?: boolean
}

export const SendUsAMessageCard = observer((props: SendUsAMessageCardProps) => {
  const { small, withButton = true } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [sendMessageModalIsOpen, setSendMessageModalIsOpen] = useState(false)

  const handleOpenSendMessageModal = () => {
    setSendMessageModalIsOpen(true)
  }

  const handleCloseSendMessageModal = () => {
    setSendMessageModalIsOpen(false)
  }

  const renderDescription = () => {
    return (
      <p className={`m-0 secondary-color ${small ? 'text-start' : 'text-center'}`}>
        <span>{t('profile.more.send_message.send_message_and_well_be_back')}</span>
      </p>
    )
  }

  return (
    <>
      <div className="max-width p-0 h-100 cursor-pointer" onClick={handleOpenSendMessageModal}>
        <div className="verification-card-root h-100">
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%',
              backgroundImage: `url(${Background.src})`,
              zIndex: -1,
              borderRadius: '6px',
            }}
          ></div>
          <div
            className={`verification-card-background-overlay align-items-start pl-20 pr-20 pt-10 pb-10 h-100 w-100 justify-content-between ${small ? 'flex-column' : ''} `}
          >
            {!small && <Icon type="generic/chat-color" size={48} />}
            <div
              className={`w-100 d-flex align-items-center ${small ? 'flex-row p-0' : 'flex-column p-16'} `}
            >
              {small && (
                <div className="mr-10">
                  <Icon type="generic/chat-color" size={32} />
                </div>
              )}
              <span className={`${small ? 'text-start' : 'text-center fw-bold'} m-0`}>
                {t('profile.more.send_message.title')}
              </span>

              {!small && renderDescription()}
            </div>

            {small && renderDescription()}
            {withButton &&
              <button className="btn border-btn w-100 mt-10" onClick={handleOpenSendMessageModal}>
                {t('profile.more.send_message.send_message')}
              </button>
            }
          </div>
        </div>
      </div>
      <SendUsAMessageModal
        isOpened={sendMessageModalIsOpen}
        close={handleCloseSendMessageModal}
      />
    </>
  )
})
