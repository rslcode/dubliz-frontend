import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'
import { useState } from 'react'
import { ProfileSettingsNotifications } from './notifications'
import { ProfileSettingsProfile } from './profile'
import { DeleteAccountModal } from './delete-account-modal'
import { AccountController } from '@/core/controllers/account'

enum ProfileSettingsTabsEnum {
  PROFILE = 'profile',
  NOTIFICATIONS = 'notifications',
  DELETE_ACCOUNT = 'delete-account',
}

export const ProfileSettings = observer((props: { withPadding?: boolean }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { withPadding = false } = props

  const [activeNav, setActiveNav] = useState<ProfileSettingsTabsEnum>(
    ProfileSettingsTabsEnum.PROFILE
  )
  const [deleteAccountModalOpened, setDeleteAccountModalOpened] = useState(false)

  const toggleDeleteAccountModal = () => {
    setDeleteAccountModalOpened(!deleteAccountModalOpened)
  }

  const changeCurrentTab = (tab: ProfileSettingsTabsEnum) => {
    setActiveNav(tab)
  }

  const handleDeleteAccount = async () => {
    return await AccountController.deleteAccount()
  }

  if (!AppStore.accountData?.id) {
    return null
  }

  return (
    <div className={`d-flex align-items-center gap-4`}>
      <div className={`settings-profile-tabs w-100 ${withPadding ? 'p-16' : ''}`}>
        <nav>
          <div className="nav" role="tablist">
            <button
              className={`nav-link account-details-nav-link ${ProfileSettingsTabsEnum.PROFILE === activeNav ? 'active' : ''
                }`}
              id={ProfileSettingsTabsEnum.PROFILE}
              data-bs-toggle="tab"
              data-bs-target={`#tab-${ProfileSettingsTabsEnum.PROFILE}`}
              role="tab"
              aria-selected={ProfileSettingsTabsEnum.PROFILE === activeNav}
              onClick={() => changeCurrentTab(ProfileSettingsTabsEnum.PROFILE)}
            >
              {t('header.profile')}
            </button>
            <button
              className={`nav-link account-details-nav-link ${ProfileSettingsTabsEnum.NOTIFICATIONS === activeNav ? 'active' : ''
                }`}
              id={ProfileSettingsTabsEnum.NOTIFICATIONS}
              data-bs-toggle="tab"
              data-bs-target={`#tab-${ProfileSettingsTabsEnum.NOTIFICATIONS}`}
              role="tab"
              aria-selected={ProfileSettingsTabsEnum.NOTIFICATIONS === activeNav}
              onClick={() => changeCurrentTab(ProfileSettingsTabsEnum.NOTIFICATIONS)}
            >
              {t('home.notifications.notifications')}
            </button>
            <button
              className={`nav-link account-details-nav-link ${ProfileSettingsTabsEnum.DELETE_ACCOUNT === activeNav ? 'active' : ''
                }`}
              id={ProfileSettingsTabsEnum.DELETE_ACCOUNT}
              data-bs-toggle="tab"
              data-bs-target={`#tab-${ProfileSettingsTabsEnum.DELETE_ACCOUNT}`}
              role="tab"
              aria-selected={ProfileSettingsTabsEnum.DELETE_ACCOUNT === activeNav}
              onClick={() => changeCurrentTab(ProfileSettingsTabsEnum.DELETE_ACCOUNT)}
            >
              {t('profile.update.delete_account')}
            </button>
          </div>
        </nav>
        <div className="mb-30 mt-40 p-0">
          <div className="tab-content">
            <div
              className={`tab-pane fade ${ProfileSettingsTabsEnum.PROFILE === activeNav ? 'active show' : ''
                }`}
              id={`tab-${ProfileSettingsTabsEnum.PROFILE}`}
              role="tabpanel"
              aria-labelledby={ProfileSettingsTabsEnum.PROFILE}
            >
              <ProfileSettingsProfile />
            </div>
          </div>

          <div className="tab-content">
            <div
              className={`tab-pane fade ${ProfileSettingsTabsEnum.NOTIFICATIONS === activeNav ? 'active show' : ''
                }`}
              id={`tab-${ProfileSettingsTabsEnum.NOTIFICATIONS}`}
              role="tabpanel"
              aria-labelledby={ProfileSettingsTabsEnum.NOTIFICATIONS}
            >
              <ProfileSettingsNotifications />
            </div>
          </div>
          <div className="tab-content">
            <div
              className={`tab-pane fade ${ProfileSettingsTabsEnum.DELETE_ACCOUNT === activeNav ? 'active show' : ''
                }`}
              id={`tab-${ProfileSettingsTabsEnum.DELETE_ACCOUNT}`}
              role="tabpanel"
              aria-labelledby={ProfileSettingsTabsEnum.DELETE_ACCOUNT}
            >
              <div className="mt-40">
                <p>{t('profile.update.delete_account_details')}</p>
                <button className="border-btn" onClick={toggleDeleteAccountModal}>
                  {t('profile.update.delete_account')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpened={deleteAccountModalOpened}
        close={toggleDeleteAccountModal}
        onSubmit={handleDeleteAccount}
      />
    </div>
  )
})
