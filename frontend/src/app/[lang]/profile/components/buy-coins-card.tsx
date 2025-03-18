import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import Background from '@/../public/assets/img/coins.webp'
import { useState } from 'react'
import { BuyCoinsModal } from '@/components/modals/buy-coins'

interface ProfileDetailsBuyCoinsCardProps {
  small?: boolean
  withButton?: boolean
}

export const ProfileDetailsBuyCoinsCard = observer((props: ProfileDetailsBuyCoinsCardProps) => {
  const { small, withButton = true } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [buyCoinsModalOpened, setBuyCoinsModalOpened] = useState(false)

  const toggleBuyCoinsModal = (sessionUrl?: string) => {
    setBuyCoinsModalOpened(!buyCoinsModalOpened)
    if (sessionUrl && typeof sessionUrl === 'string') {
      window.open(sessionUrl, '_blank')
    }
  }

  const renderDescription = () => {
    return (
      <p className={`m-0 secondary-color ${small ? 'text-start' : 'text-center'}`}>
        {t('buy_coins.buy_coins_to_create_more_auctions')}
      </p>
    )
  }

  return (
    <>
      <div className="max-width p-0 h-100 cursor-pointer" onClick={() => toggleBuyCoinsModal()}>
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
            {!small && <Icon type="generic/coin" size={48} />}
            <div
              className={`w-100 d-flex align-items-center ${small ? 'flex-row p-0' : 'flex-column p-16'} `}
            >
              {small && (
                <div className="mr-10">
                  <Icon type="generic/coin" size={32} />{' '}
                </div>
              )}
              <span className={`${small ? 'text-start' : 'text-center fw-bold'} m-0`}>
                {t('buy_coins.buy_coins')}
              </span>

              {!small && renderDescription()}
            </div>

            {small && renderDescription()}

            {withButton &&
              <button onClick={() => toggleBuyCoinsModal()} className="btn border-btn w-100 mt-10">
                {t('buy_coins.buy_coins')}
              </button>
            }
          </div>
        </div>
      </div>
      <BuyCoinsModal isOpened={buyCoinsModalOpened} close={toggleBuyCoinsModal} />
    </>
  )
})
