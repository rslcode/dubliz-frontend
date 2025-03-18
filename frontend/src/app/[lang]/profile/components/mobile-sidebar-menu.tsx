import { Account } from '@/core/domain/account'
import { ProfileTabsEnum } from '../root'
import { useRef } from 'react'
import { useClickOutside } from '@/hooks/click-outside'
import { AppLogo } from '@/components/common/app-logo'
import { Icon } from '@/components/common/icon'
import { ProfileDetailsTabs } from './tabs'

export const ProfileMobileSidebarMenu = (props: {
  opened: boolean
  profile: Account
  activeNav: ProfileTabsEnum
  handleClose: () => void
  handleChangeTab: (tab: ProfileTabsEnum) => void
}) => {
  const { profile, activeNav, opened, handleClose } = props

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  useClickOutside(mobileMenuRef, () => {
    if (opened) {
      props.handleClose()
    }
  })

  const handleChangeTab = (tab: ProfileTabsEnum) => {
    handleClose()
    props.handleChangeTab(tab)
  }

  return (
    <div className={opened ? 'side-info info-open' : 'side-info'} ref={mobileMenuRef}>
      <div className="side-info-content">
        <div className="mb-40">
          <div className="row align-items-center mb-20">
            <div className="col-9">
              <AppLogo />
            </div>
            <div className="col-3 text-end">
              <button className="side-info-close" aria-label="close" onClick={handleClose}>
                <Icon type="generic/close-filled" />
              </button>
            </div>
          </div>
          <div className="w-100 sidebar-account-tabs-root">
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
      </div>
    </div>
  )
}
