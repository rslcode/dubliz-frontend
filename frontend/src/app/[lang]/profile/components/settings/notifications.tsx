import useGlobalContext from '@/hooks/use-context'
import { ProfileSettingsNotificationItem } from './notification-item'
import { useTranslation } from '@/app/i18n/client'
import { AppStore } from '@/core/store'
import { AccountController } from '@/core/controllers/account'
import { AccountNotifications } from '@/core/domain/account'

export const ProfileSettingsNotifications = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const handleUpdateSelected = (notificationType: keyof AccountNotifications, value: boolean) => {
    if (!AppStore.accountData) {
      return
    }

    const allowedNotif = AppStore.accountData!.allowedNotifications
    if (!allowedNotif) {
      return
    }

    Object.assign(allowedNotif, { [notificationType]: value })
    AccountController.updateAccountAllowedNotifications(allowedNotif)
  }

  const auctionsData = {
    [t('profile.notifications.auctions')]: [
      {
        title: t('profile.notifications.auction_updated_title'),
        description: t('profile.notifications.auction_updated_descr'),
        key: 'AUCTION_UPDATED',
      },
      {
        title: t('profile.notifications.new_auction_from_followed'),
        description: t('profile.notifications.new_auction_from_followed_descr'),
        key: 'NEW_AUCTION_FROM_FOLLOWING',
      },
      {
        title: t('profile.notifications.my_auction_started'),
        description: t('profile.notifications.my_auction_started_descr'),
        key: 'MY_AUCTION_STARTED',
      },
      {
        title: t('profile.notifications.fav_auction_started'),
        description: t('profile.notifications.fav_auction_started_descr'),
        key: 'AUCTION_FROM_FAVOURITES_STARTED',
      },
    ],
    [t('profile.notifications.bids')]: [
      {
        title: t('profile.notifications.bid_added_title'),
        description: t('profile.notifications.bid_added_descr'),
        key: 'NEW_BID_ON_AUCTION',
      },
      {
        title: t('profile.notifications.bid_removed_title'),
        description: t('profile.notifications.bid_removed_descr'),
        key: 'BID_REMOVED_ON_AUCTION',
      },
      {
        title: t('profile.notifications.bid_accepted_title'),
        description: t('profile.notifications.bid_accepted_descr'),
        key: 'BID_ACCEPTED_ON_AUCTION',
      },
      {
        title: t('profile.notifications.bid_rejected_title'),
        description: t('profile.notifications.bid_rejected_descr'),
        key: 'BID_REJECTED_ON_AUCTION',
      },
      {
        title: t('profile.notifications.bid_seen'),
        description: t('profile.notifications.bid_seen_descr'),
        key: 'BID_WAS_SEEN',
      },
      {
        title: t('profile.notifications.same_auction_bid'),
        description: t('profile.notifications.same_auction_bid_descr'),
        key: 'SOMEONE_ELSE_ADDED_BID_TO_SAME_AUCTION',
      },
    ],
    [t('profile.notifications.favourites')]: [
      {
        title: t('profile.notifications.auction_added_to_favourites'),
        description: t('profile.notifications.auction_added_to_favourites_descr'),
        key: 'AUCTION_ADDED_TO_FAVOURITES',
      },
      {
        title: t('profile.notifications.bid_on_favourites_auction'),
        description: t('profile.notifications.bid_on_favourites_auction_descr'),
        key: 'AUCTION_FROM_FAVOURITES_HAS_BID',
      },
      {
        title: t('profile.notifications.favourite_price_change'),
        description: t('profile.notifications.favourite_price_change_descr'),
        key: 'FAVOURITE_AUCTION_PRICE_CHANGE',
      },
    ],
    [t('profile.notifications.generic')]: [
      {
        title: t('profile.notifications.review_title'),
        description: t('profile.notifications.review_descr'),
        key: 'REVIEW_RECEIVED',
      },
      {
        title: t('profile.notifications.new_message_title'),
        description: t('profile.notifications.new_message_descr'),
        key: 'NEW_MESSAGE',
      },
      {
        title: t('profile.notifications.new_follower'),
        description: t('profile.notifications.new_follower_descr'),
        key: 'NEW_FOLLOWER',
      },
      {
        title: t('profile.notifications.new_comment_title'),
        description: t('profile.notifications.new_comment_descr'),
        key: 'NEW_COMMENT_ON_AUCTION',
      },
      {
        title: t('profile.notifications.reply_title'),
        description: t('profile.notifications.reply_descr'),
        key: 'REPLY_ON_AUCTION_COMMENT',
      },
      {
        title: t('profile.notifications.same_auction_comment'),
        description: t('profile.notifications.same_auction_comment_descr'),
        key: 'COMMENT_ON_SAME_AUCTION',
      },
    ],
  }

  return (
    <div>
      {Object.keys(auctionsData).map((key, index) => {
        return (
          <div key={index} className="mt-10">
            <h4>{key}</h4>
            {auctionsData[key].map((item, index) => {
              return (
                <ProfileSettingsNotificationItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  isSelected={
                    (AppStore.accountData?.allowedNotifications![
                      item.key as keyof AccountNotifications
                    ] as boolean) ?? true
                  }
                  onSelect={(value) => {
                    handleUpdateSelected(item.key as keyof AccountNotifications, value)
                  }}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
