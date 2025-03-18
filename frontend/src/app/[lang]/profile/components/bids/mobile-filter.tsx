import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { AppLogo } from '@/components/common/app-logo'
import { Icon } from '@/components/common/icon'
import CustomSelect, { CustomSelectOption } from '@/components/common/custom-select'
import { ProfileBidsStatus } from './list'
import { useClickOutside } from '@/hooks/click-outside'
import { useRef } from 'react'

export const ProfileBidsListMobileFilter = (props: {
  opened: boolean
  options: CustomSelectOption[]
  activeFilter: ProfileBidsStatus
  handleClose: () => void
  setActiveFilter: (filter: ProfileBidsStatus) => void
}) => {
  const { opened, handleClose, options, activeFilter, setActiveFilter } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  useClickOutside(mobileMenuRef, () => {
    if (opened) {
      handleClose()
    }
  })

  return (
    <>
      <div className={opened ? 'side-info info-open h-100' : 'side-info'} ref={mobileMenuRef}>
        <div className="side-info-content h-100">
          <div className="mb-40 h-100">
            <div className="row align-items-center">
              <div className="col-9">
                <AppLogo />
              </div>
              <div className="col-3 text-end">
                <button className="side-info-close" aria-label="close" onClick={handleClose}>
                  <Icon type="generic/close-filled" />
                </button>
              </div>
            </div>

            <div className="mt-30 mb-30">
              <div className="mb-20">
                <h1 className="m-0">{t('home.filter.filter')}</h1>
              </div>

              <CustomSelect
                withSearch
                options={options}
                defaultCurrent={
                  activeFilter === ProfileBidsStatus.ALL
                    ? 0
                    : activeFilter === ProfileBidsStatus.ACCEPTED
                      ? 1
                      : 2
                }
                onChange={(newValue) => {
                  setActiveFilter(newValue.id as ProfileBidsStatus)
                }}
                name="main-category-filter"
                className="w-100"
              />
            </div>
            <div className="w-100">
              <button
                className="fill-btn w-100 mt-30"
                onClick={handleClose}
                aria-label={t('home.filter.apply_filter')}
              >
                {t('home.filter.apply_filter')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
