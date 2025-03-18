import { AccountFollowersSection } from '@/components/account/lists/followers'
import { AccountFollowingSection } from '@/components/account/lists/following'
import { ProfileTabsEnum } from '../root'
import { ProfileAuctionsSection } from './auctions/list'
import { ProfileBidsSection } from './bids/list'
import { ProfileChat } from './chat'
import { ProfileFavouritesSection } from './favourites-list'
import { ProfileReviewsSection } from './reviews-list'
import { ProfileSettings } from './settings'
import { Auction } from '@/core/domain/auction'
import { Review } from '@/core/domain/review'
import { Account } from '@/core/domain/account'

export const ProfileTabsContent = (props: {
  activeNav: ProfileTabsEnum
  initialAuctions: Auction[]
  initialBids: Auction[]
  initialReviews: Review[]
  profile: Account
  isMobile: boolean
  handleFollowDone: (accountId: string) => void
  handleUnfollowDone: (accountId: string) => void
}) => {
  const {
    activeNav,
    profile,
    initialBids,
    initialReviews,
    initialAuctions,
    handleFollowDone,
    handleUnfollowDone,
  } = props

  return (
    <>
      <div className="tab-content">
        <div
          className={`tab-pane fade ${ProfileTabsEnum.AUCTIONS === activeNav ? 'active show' : ''}`}
          id={`tab-${ProfileTabsEnum.AUCTIONS}`}
          role="tabpanel"
          aria-labelledby={ProfileTabsEnum.AUCTIONS}
        >
          <ProfileAuctionsSection auctions={initialAuctions} isMobile={props.isMobile} />
        </div>
      </div>

      <div className="tab-content">
        <div
          className={`tab-pane fade ${ProfileTabsEnum.BIDS === activeNav ? 'active show' : ''}`}
          id={`tab-${ProfileTabsEnum.BIDS}`}
          role="tabpanel"
          aria-labelledby={ProfileTabsEnum.BIDS}
        >
          <ProfileBidsSection bids={initialBids} />
        </div>
      </div>

      <div className="tab-content">
        <div
          className={`tab-pane fade ${ProfileTabsEnum.FAVOURITES === activeNav ? 'active show' : ''
            }`}
          id={`tab-${ProfileTabsEnum.FAVOURITES}`}
          role="tabpanel"
          aria-labelledby={ProfileTabsEnum.FAVOURITES}
        >
          <ProfileFavouritesSection />
        </div>
      </div>

      <div className="tab-content">
        <div
          className={`tab-pane fade ${ProfileTabsEnum.REVIEWS === activeNav ? 'active show' : ''}`}
          id={`tab-${ProfileTabsEnum.REVIEWS}`}
          role="tabpanel"
          aria-labelledby={ProfileTabsEnum.REVIEWS}
        >
          <ProfileReviewsSection reviews={initialReviews} />
        </div>
      </div>

      <div className="tab-content">
        <div
          className={`tab-pane fade ${ProfileTabsEnum.CHAT === activeNav ? 'active show' : ''}`}
          id={`tab-${ProfileTabsEnum.CHAT}`}
          role="tabpanel"
          aria-labelledby={ProfileTabsEnum.CHAT}
        >
          <ProfileChat isMobile={props.isMobile} />
        </div>
      </div>

      <div className="tab-content">
        <div
          className={`tab-pane fade ${ProfileTabsEnum.FOLLOWERS === activeNav ? 'active show' : ''
            }`}
          id={`tab-${ProfileTabsEnum.FOLLOWERS}`}
          role="tabpanel"
          aria-labelledby={ProfileTabsEnum.FOLLOWERS}
        >
          <AccountFollowersSection
            account={profile}
            key="followers"
            handleFollowDone={handleFollowDone}
            handleUnfollowDone={handleUnfollowDone}
          />
        </div>
      </div>

      <div className="tab-content">
        <div
          className={`tab-pane fade ${ProfileTabsEnum.FOLLOWING === activeNav ? 'active show' : ''
            }`}
          id={`tab-${ProfileTabsEnum.FOLLOWING}`}
          role="tabpanel"
          aria-labelledby={ProfileTabsEnum.FOLLOWING}
        >
          <AccountFollowingSection
            account={profile}
            handleFollowDone={handleFollowDone}
            handleUnfollowDone={handleUnfollowDone}
          />
        </div>
      </div>

      <div className="tab-content">
        <div
          className={`tab-pane fade ${ProfileTabsEnum.SETTINGS === activeNav ? 'active show' : ''}`}
          id={`tab-${ProfileTabsEnum.SETTINGS}`}
          role="tabpanel"
          aria-labelledby={ProfileTabsEnum.SETTINGS}
        >
          <ProfileSettings withPadding />
        </div>
      </div>
    </>
  )
}
