import { AccountInfo } from '@/components/account/info'
import { ShareButton } from '@/components/share/button'
import { t } from 'i18next'
import { ProfileDetailsTabs } from '../components/tabs'
import { ProfileTabsContent } from '../components/tabs-content'
import { Account } from '@/core/domain/account'
import { Auction } from '@/core/domain/auction'
import { Review } from '@/core/domain/review'
import { ProfileTabsEnum } from '../root'
import { AccountVerificationCard } from '../components/verification-card'
import { ProfileDetailsBuyCoinsCard } from '../components/buy-coins-card'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'
import { SendUsAMessageCard } from '../components/send-us-message-card'

export const ProfileTabsLayout = observer((props: {
  profile: Account
  activeNav: ProfileTabsEnum
  initialAuctions: Auction[]
  initialBids: Auction[]
  initialReviews: Review[]
  isMobile: boolean
  handleChangeTab: (tab: ProfileTabsEnum) => void
  handleFollowDone: (accountId: string) => void
  handleUnfollowDone: (accountId: string) => void
}) => {
  const {
    profile,
    activeNav,
    initialAuctions,
    initialBids,
    initialReviews,
    handleChangeTab,
    handleFollowDone,
    handleUnfollowDone,
  } = props

  return (
    <div className="row mr-0 ml-0 mt-30 mt-sm-5 mb-100 w-100">
      <div className="account-details-header">
        <div className="account-details-header-top">
          <AccountInfo account={profile} />
          <div className="d-flex align-items-center gap-4 see-how-others-see-you">
            <ShareButton
              fullWidth
              url={`/account/${profile.id}`}
              title={t('share.check_account')}
            />
          </div>
        </div>

        <div className="mt-30">
          <ProfileDetailsTabs
            profile={profile}
            activeNav={activeNav}
            handleChangeTab={handleChangeTab}
          />
        </div>
      </div>

      {!profile ? null : (
        <div className="mt-30 row no-bs-gutter d-none d-sm-flex">
          {AppStore.accountData?.verified ? null : <div className="d-none d-sm-block col-12 p-1 m-0 col-sm-4 d-flex flex-column">
            <AccountVerificationCard small />
          </div>}
          <div className={`d-none d-sm-block col-12 p-1 m-0 ${AppStore.accountData?.verified ? 'col-sm-6' : 'col-sm-4'} d-flex flex-column`}>
            <ProfileDetailsBuyCoinsCard small withButton={!AppStore.accountData?.verified} />
          </div>
          <div className={`d-none d-sm-block col-12 p-1 m-0 ${AppStore.accountData?.verified ? 'col-sm-6' : 'col-sm-4'} d-flex flex-column`}>
            <SendUsAMessageCard small withButton={!AppStore.accountData?.verified} />
          </div>
        </div>
      )}

      <div className="mb-30 mt-40 p-0">
        <ProfileTabsContent
          profile={profile}
          activeNav={activeNav}
          initialAuctions={initialAuctions}
          initialBids={initialBids}
          initialReviews={initialReviews}
          isMobile={props.isMobile}
          handleFollowDone={handleFollowDone}
          handleUnfollowDone={handleUnfollowDone}
        />
      </div>
    </div>
  )
})
