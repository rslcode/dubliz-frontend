import { Account } from '@/core/domain/account'
import { Auction } from '@/core/domain/auction'
import { Review } from '@/core/domain/review'
import { ProfileTabsEnum } from '../root'
import { AccountInfo } from '@/components/account/info'
import { ShareButton } from '@/components/share/button'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { ProfileDetailsTabs } from '../components/tabs'
import { ProfileTabsContent } from '../components/tabs-content'
import { useState } from 'react'
import { AppStore } from '@/core/store'
import { ProfileMobileSidebarMenu } from '../components/mobile-sidebar-menu'
import { AccountVerificationCard } from '../components/verification-card'
import { ProfileDetailsBuyCoinsCard } from '../components/buy-coins-card'
import { SendUsAMessageCard } from '../components/send-us-message-card'

export const ProfileSidebarLayout = (props: {
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
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { profile, activeNav, handleChangeTab } = props

  const [sidebarMenuOpened, setSidebarMenuOpened] = useState(false)

  const renderActiveTabTitle = () => {
    switch (activeNav) {
      case ProfileTabsEnum.AUCTIONS:
        return (
          <h1 className="m-0">
            {t('header.my_auctions')} ({AppStore.accountStats.allAuctionsCount ?? 0})
          </h1>
        )
      case ProfileTabsEnum.BIDS:
        return (
          <h1 className="m-0">
            {t('header.my_bids')} ({AppStore.accountStats.allBidsCount ?? 0})
          </h1>
        )
      case ProfileTabsEnum.FAVOURITES:
        return (
          <h1 className="m-0">
            {t('bottom_nav.favourites')} ({AppStore.favouriteAuctions.length ?? 0})
          </h1>
        )
      case ProfileTabsEnum.REVIEWS:
        return (
          <h1 className="m-0">
            {t('profile.reviews.reviews')} (
            {profile.reviewsCount ? profile.reviewsCount : (profile.reviews?.length ?? 0)})
          </h1>
        )
      case ProfileTabsEnum.CHAT:
        return (
          <h1 className="m-0">
            {t('chat.chat')} ({AppStore.chatGroups.length})
          </h1>
        )
      case ProfileTabsEnum.FOLLOWERS:
        return (
          <h1 className="m-0">
            {t('profile.followers')} ({profile.followersCount ?? 0})
          </h1>
        )
      case ProfileTabsEnum.FOLLOWING:
        return (
          <h1 className="m-0">
            {t('profile.following')} ({profile.followingCount ?? 0})
          </h1>
        )
      case ProfileTabsEnum.SETTINGS:
        return <h1 className="m-0">{t('info.settings')}</h1>
    }
  }

  return (
    <div className="row mr-0 ml-0 mt-30 mt-sm-5 mb-100 w-100">
      <div className="col-lg-3 flex-column sidebar-account-tabs no-bs-gutter p-1">
        <div className="w-100 sidebar-account-tabs-root">
          <div className="d-flex flex-column">
            <div className="p-16">
              <AccountInfo account={profile} pictureSize={50} />
              <div className="d-flex align-items-start gap-2 see-how-others-see-you w-100 flex-column mt-20">
                <ShareButton
                  fullWidth
                  url={`/account/${profile.id}`}
                  title={t('share.check_account')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 p-0">
          <AccountVerificationCard small />
        </div>

        <div className="w-100 sidebar-account-tabs-root mt-20">
          <div className="sidebar-account-tabs-list">
            <ProfileDetailsTabs
              sidebar
              profile={profile}
              activeNav={activeNav}
              handleChangeTab={handleChangeTab}
            />
          </div>
        </div>
      </div>
      <div className="d-block d-xl-none sidebar-mobile-account-profile">
        <div className="d-flex flex-column gap-4 p-16">
          <AccountInfo account={profile} />
          <div className="d-flex align-items-start mt-10 gap-2 see-how-others-see-you justify-content-between">
            <ShareButton url={`/account/${profile.id}`} title={t('share.check_account')} />
          </div>
        </div>
      </div>
      <div className="sidebar-account-content no-bs-gutter flex-column">
        <div className="row no-bs-gutter d-none d-sm-flex mb-30">
          <div className={`d-none d-sm-block col-12 p-1 m-0 col-sm-6 d-flex flex-column`}>
            <ProfileDetailsBuyCoinsCard small withButton={false} />
          </div>
          <div className={`d-none d-sm-block col-12 p-1 m-0 col-sm-6 d-flex flex-column`}>
            <SendUsAMessageCard small withButton={false} />
          </div>
        </div>
        <div className="sidebar-account-content-title mb-20 d-flex align-items-center justify-content-between">
          {renderActiveTabTitle()}
          <button
            className="border-btn d-block d-xl-none"
            onClick={() => {
              setSidebarMenuOpened(true)
            }}
          >
            {t('generic.change_tab')}
          </button>
        </div>
        <div className="w-100 sidebar-account-content-root">
          <ProfileTabsContent {...props} />
        </div>
      </div>
      <ProfileMobileSidebarMenu
        opened={sidebarMenuOpened}
        profile={profile}
        activeNav={activeNav}
        handleChangeTab={handleChangeTab}
        handleClose={() => setSidebarMenuOpened(false)}
      />
    </div>
  )
}
