import { useTranslation } from '@/app/i18n/client'
import { Account } from '@/core/domain/account'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useRef, useState } from 'react'
import { ProfileTabsEnum } from '../root'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import { Icon } from '@/components/common/icon'

export const ProfileDetailsTabs = observer(
  (props: {
    profile: Account
    activeNav: ProfileTabsEnum
    sidebar?: boolean
    handleChangeTab: (tab: ProfileTabsEnum) => void
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { profile, sidebar = false } = props

    const [activeNav, setActiveNav] = useState<ProfileTabsEnum>(props.activeNav)
    const containerRef = useRef<HTMLDivElement>(null)
    const childrenRefs = useRef<Record<string, HTMLButtonElement>>({})
    const hasTabsLayout = globalContext.appSettings.profilePageLayout === 'tabs'

    const changeCurrentTab = (tab: ProfileTabsEnum) => {
      setActiveNav(tab)
      props.handleChangeTab(tab)
    }

    useEffect(() => {
      if (activeNav && childrenRefs.current[activeNav]) {
        const container = containerRef.current
        const selectedChild = childrenRefs.current[activeNav]

        if (container && selectedChild) {
          const containerRect = container.getBoundingClientRect()
          const childRect = selectedChild.getBoundingClientRect()

          if (childRect.right > containerRect.right || childRect.left < containerRect.left) {
            selectedChild.scrollIntoView({
              behavior: 'instant',
              block: 'nearest',
              inline: 'nearest',
            })
          }
        }
      }
    }, [activeNav])

    return (
      <>
        <div className={`${sidebar ? 'profile-tabs-root' : ''} w-100`}>
          <nav className="w-100">
            <div
              className={`nav ${sidebar ? 'flex-column' : ''}`}
              role="tablist"
              ref={containerRef}
            >
              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[ProfileTabsEnum.AUCTIONS] = el
                  }
                }}
                className={`nav-link  d-flex align-items-center justify-content-between ${sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                  } ${ProfileTabsEnum.AUCTIONS === activeNav ? 'active' : ''}`}
                id={ProfileTabsEnum.AUCTIONS}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${ProfileTabsEnum.AUCTIONS}`}
                role="tab"
                aria-selected={ProfileTabsEnum.AUCTIONS === activeNav}
                onClick={() => changeCurrentTab(ProfileTabsEnum.AUCTIONS)}
              >
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Icon type="header/auction" size={18} />
                  <span style={{ color: !sidebar ? undefined : ProfileTabsEnum.AUCTIONS === activeNav ? 'var(--font_1)' : 'var(--font_3)' }}>
                    {t('header.my_auctions')} ({AppStore.accountStats.allAuctionsCount ?? 0})
                  </span>
                </div>

                {!hasTabsLayout && (
                  <Icon
                    type="arrows/arrow-right-filled"
                    size={16}
                    color={
                      ProfileTabsEnum.AUCTIONS === activeNav ? 'var(--font_3)' : 'var(--separator)'
                    }
                  />
                )}
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[ProfileTabsEnum.BIDS] = el
                  }
                }}
                className={`nav-link  d-flex align-items-center justify-content-between ${sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                  } ${ProfileTabsEnum.BIDS === activeNav ? 'active' : ''}`}
                id={ProfileTabsEnum.BIDS}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${ProfileTabsEnum.BIDS}`}
                role="tab"
                aria-selected={ProfileTabsEnum.BIDS === activeNav}
                onClick={() => changeCurrentTab(ProfileTabsEnum.BIDS)}
              >
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Icon type="header/bid" size={18} />
                  <span style={{ color: !sidebar ? undefined : ProfileTabsEnum.BIDS === activeNav ? 'var(--font_1)' : 'var(--font_3)' }}>
                    {t('header.my_bids')} ({AppStore.accountStats.allBidsCount ?? 0})
                  </span>
                </div>
                {!hasTabsLayout && (
                  <Icon
                    type="arrows/arrow-right-filled"
                    size={16}
                    color={
                      ProfileTabsEnum.BIDS === activeNav ? 'var(--font_3)' : 'var(--separator)'
                    }
                  />
                )}
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[ProfileTabsEnum.FAVOURITES] = el
                  }
                }}
                className={`nav-link  d-flex align-items-center justify-content-between ${sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                  } ${ProfileTabsEnum.FAVOURITES === activeNav ? 'active' : ''}`}
                id={ProfileTabsEnum.FAVOURITES}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${ProfileTabsEnum.FAVOURITES}`}
                role="tab"
                aria-selected={ProfileTabsEnum.FAVOURITES === activeNav}
                onClick={() => changeCurrentTab(ProfileTabsEnum.FAVOURITES)}
              >
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Icon type="header/heart" size={18} />
                  <span style={{ color: !sidebar ? undefined : ProfileTabsEnum.FAVOURITES === activeNav ? 'var(--font_1)' : 'var(--font_3)' }}>
                    {t('bottom_nav.favourites')} ({AppStore.favouriteAuctions.length ?? 0})
                  </span>
                </div>
                {!hasTabsLayout && (
                  <Icon
                    type="arrows/arrow-right-filled"
                    size={16}
                    color={
                      ProfileTabsEnum.FAVOURITES === activeNav
                        ? 'var(--font_3)'
                        : 'var(--separator)'
                    }
                  />
                )}
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[ProfileTabsEnum.FAVOURITES] = el
                  }
                }}
                className={`nav-link  d-flex align-items-center justify-content-between ${sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                  } ${ProfileTabsEnum.REVIEWS === activeNav ? 'active' : ''}`}
                id={ProfileTabsEnum.REVIEWS}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${ProfileTabsEnum.REVIEWS}`}
                role="tab"
                aria-selected={ProfileTabsEnum.REVIEWS === activeNav}
                onClick={() => changeCurrentTab(ProfileTabsEnum.REVIEWS)}
              >
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Icon type="generic/star" size={18} />
                  <span style={{ color: !sidebar ? undefined : ProfileTabsEnum.REVIEWS === activeNav ? 'var(--font_1)' : 'var(--font_3)' }}>
                    {t('profile.reviews.reviews')} (
                    {profile.reviewsCount ? profile.reviewsCount : (profile.reviews?.length ?? 0)})
                  </span>
                </div>
                {!hasTabsLayout && (
                  <Icon
                    type="arrows/arrow-right-filled"
                    size={16}
                    color={
                      ProfileTabsEnum.REVIEWS === activeNav ? 'var(--font_3)' : 'var(--separator)'
                    }
                  />
                )}
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[ProfileTabsEnum.CHAT] = el
                  }
                }}
                className={`nav-link  d-flex align-items-center justify-content-between ${sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                  } ${ProfileTabsEnum.CHAT === activeNav ? 'active' : ''}`}
                id={ProfileTabsEnum.CHAT}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${ProfileTabsEnum.CHAT}`}
                role="tab"
                aria-selected={ProfileTabsEnum.CHAT === activeNav}
                onClick={() => changeCurrentTab(ProfileTabsEnum.CHAT)}
              >
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Icon type="header/chat" size={18} />
                  <span style={{ color: !sidebar ? undefined : ProfileTabsEnum.CHAT === activeNav ? 'var(--font_1)' : 'var(--font_3)' }}>
                    {t('chat.chat')} ({AppStore.chatGroups.length})
                  </span>
                </div>
                {!hasTabsLayout && (
                  <Icon
                    type="arrows/arrow-right-filled"
                    size={16}
                    color={
                      ProfileTabsEnum.CHAT === activeNav ? 'var(--font_3)' : 'var(--separator)'
                    }
                  />
                )}
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[ProfileTabsEnum.FOLLOWERS] = el
                  }
                }}
                className={`nav-link  d-flex align-items-center justify-content-between ${sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                  } ${ProfileTabsEnum.FOLLOWERS === activeNav ? 'active' : ''}`}
                id={ProfileTabsEnum.FOLLOWERS}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${ProfileTabsEnum.FOLLOWERS}`}
                role="tab"
                aria-selected={ProfileTabsEnum.FOLLOWERS === activeNav}
                onClick={() => changeCurrentTab(ProfileTabsEnum.FOLLOWERS)}
              >
                <span style={{ color: !sidebar ? undefined : ProfileTabsEnum.FOLLOWERS === activeNav ? 'var(--font_1)' : 'var(--font_3)' }}>
                  {t('profile.followers')} ({profile.followersCount ?? 0})
                </span>
                {!hasTabsLayout && (
                  <Icon
                    type="arrows/arrow-right-filled"
                    size={16}
                    color={
                      ProfileTabsEnum.FOLLOWERS === activeNav ? 'var(--font_3)' : 'var(--separator)'
                    }
                  />
                )}
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[ProfileTabsEnum.FOLLOWING] = el
                  }
                }}
                className={`nav-link  d-flex align-items-center justify-content-between ${sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                  } ${ProfileTabsEnum.FOLLOWING === activeNav ? 'active' : ''}`}
                id={ProfileTabsEnum.FOLLOWING}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${ProfileTabsEnum.FOLLOWING}`}
                role="tab"
                aria-selected={ProfileTabsEnum.FOLLOWING === activeNav}
                onClick={() => changeCurrentTab(ProfileTabsEnum.FOLLOWING)}
              >
                <span style={{ color: !sidebar ? undefined : ProfileTabsEnum.FOLLOWING === activeNav ? 'var(--font_1)' : 'var(--font_3)' }}>
                  {t('profile.following')} ({profile.followingCount ?? 0})
                </span>
                {!hasTabsLayout && (
                  <Icon
                    type="arrows/arrow-right-filled"
                    size={16}
                    color={
                      ProfileTabsEnum.FOLLOWING === activeNav ? 'var(--font_3)' : 'var(--separator)'
                    }
                  />
                )}
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[ProfileTabsEnum.SETTINGS] = el
                  }
                }}
                className={`nav-link  d-flex align-items-center justify-content-between ${sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                  } ${ProfileTabsEnum.SETTINGS === activeNav ? 'active' : ''}`}
                id={ProfileTabsEnum.SETTINGS}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${ProfileTabsEnum.SETTINGS}`}
                role="tab"
                aria-selected={ProfileTabsEnum.SETTINGS === activeNav}
                onClick={() => changeCurrentTab(ProfileTabsEnum.SETTINGS)}
              >
                <span style={{ color: !sidebar ? undefined : ProfileTabsEnum.SETTINGS === activeNav ? 'var(--font_1)' : 'var(--font_3)' }}>
                  {t('info.settings')}
                </span>
                {!hasTabsLayout && (
                  <Icon
                    type="arrows/arrow-right-filled"
                    size={16}
                    color={
                      ProfileTabsEnum.SETTINGS === activeNav ? 'var(--font_3)' : 'var(--separator)'
                    }
                  />
                )}
              </button>
            </div>
          </nav>
        </div>
      </>
    )
  }
)

ProfileDetailsTabs.displayName = 'ProfileTabs'
