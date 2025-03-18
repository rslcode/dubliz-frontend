import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import Background from '@/../public/assets/img/verification.webp'
import { useEffect, useState } from 'react'
import { AccountController } from '@/core/controllers/account'
import { toast } from 'react-toastify'
import { AppStore } from '@/core/store'
import { FormattedDate } from '@/components/common/formatted-date'

interface AccountVerificationCardProps {
  small?: boolean
}

export const AccountVerificationCard = observer((props: AccountVerificationCardProps) => {
  const { small } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const currentAccount = AppStore.accountData

  const [verificationInProgress, setVerificationInProgress] = useState(false)
  const [verificationRequestedAt, setVerificationRequestedAt] = useState(
    currentAccount?.verificationRequestedAt
  )
  const [accountVerifiedAt, setAccountVerifiedAt] = useState(currentAccount?.verifiedAt)

  useEffect(() => {
    if (!currentAccount) {
      return
    }

    setVerificationRequestedAt(currentAccount.verificationRequestedAt)
    setAccountVerifiedAt(currentAccount.verifiedAt)
  }, [currentAccount, AppStore.accountData])

  const askForVerification = async () => {
    if (verificationInProgress) {
      return
    }

    setVerificationInProgress(true)

    try {
      const asked = await AccountController.askForVerification()

      if (!asked) {
        toast.error(t('verification.could_not_ask_for_verification'))
      } else {
        toast.success(t('verification.verification_asked'))
        setVerificationRequestedAt(new Date())
      }
    } catch (error) {
      console.error(error)
    } finally {
      setVerificationInProgress(false)
    }
  }

  const renderDescription = () => {
    return (
      <p className={`m-0 secondary-color ${small ? 'text-start' : 'text-center'}`}>
        {!!accountVerifiedAt
          ? t('verification.account_was_verified')
          : !!verificationRequestedAt
            ? t('verification.already_asked_for_verification')
            : t('verification.ask_verification')}

        {!!accountVerifiedAt && (
          <span className="fw-light">
            <FormattedDate date={accountVerifiedAt} format="D MMM, H:mm" />
          </span>
        )}
      </p>
    )
  }

  return (
    <div className="max-width p-0 h-100">
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
          className={`h-100 verification-card-background-overlay pl-20 pr-20 pt-10 pb-10 w-100 ${small ? 'flex-column' : ''} `}
        >
          {!small && <Icon type="generic/verified" size={48} />}
          <div
            className={`w-100 d-flex align-items-start ${small ? 'flex-row p-0' : 'flex-column p-16'} `}
          >
            {small && (
              <div className="mr-10 mt-1">
                <Icon type="generic/verified" size={32} />{' '}
              </div>
            )}
            <span className={`${small ? 'text-start' : 'text-center fw-bold'} m-0`}>
              {t(
                !!accountVerifiedAt
                  ? 'verification.verified_info'
                  : 'verification.verified_have_icon'
              )}
            </span>
            {!small && renderDescription()}
          </div>

          {small && <div className="mt-10">{renderDescription()} </div>}

          {!verificationRequestedAt && (
            <button
              className={`border-btn ${small ? 'mt-10 w-100' : ''}`}
              disabled={verificationInProgress}
              onClick={askForVerification}
              title={t('verification.ask_verification_button')}
            >
              <span>{t('verification.ask_verification_button')}</span>
              {verificationInProgress && (
                <div className="loader-wrapper d-flex justify-content-center">
                  <Icon type="loading" size={40} />
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
})
