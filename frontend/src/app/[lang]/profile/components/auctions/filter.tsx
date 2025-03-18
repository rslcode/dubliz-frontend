import { useTranslation } from '@/app/i18n/client'
import CustomSelect, { CustomSelectOption } from '@/components/common/custom-select'
import useGlobalContext from '@/hooks/use-context'
import { ProfileAuctionsStatus } from './list'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Icon } from '@/components/common/icon'
import { ProfileAuctionsListMobileFilter } from './mobile-filter'

export const ProfileAuctionsFilter = observer(
  (props: {
    initialStatus: ProfileAuctionsStatus
    handleFilterChange: (status: ProfileAuctionsStatus) => void
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { handleFilterChange } = props

    const [auctionsStatus, setAuctionsStatus] = useState<ProfileAuctionsStatus>(props.initialStatus)
    const [mobileAuctionsFilterOpened, setMobileAuctionsFilterOpened] = useState(false)

    const toggleMobileAuctionsFilter = () => {
      if (!mobileAuctionsFilterOpened) {
        document.body.classList.add('no-scroll')
      } else {
        document.body.classList.remove('no-scroll')
      }

      setMobileAuctionsFilterOpened((old) => !old)
    }

    useEffect(() => {
      setAuctionsStatus(props.initialStatus)
    }, [props.initialStatus])

    const options: CustomSelectOption[] = [
      {
        id: ProfileAuctionsStatus.ALL,
        option: t('home.auctions.all_auctions', {
          no: AppStore.accountStats.allAuctionsCount,
        }),
      },
      {
        id: ProfileAuctionsStatus.ACTIVE,
        option: t('profile.active_auctions.active_auctions', {
          no: AppStore.accountStats.activeAuctions,
        }),
      },
      {
        id: ProfileAuctionsStatus.CLOSED,
        option: t('profile.closed_auctions.closed_auctions', {
          no: AppStore.accountStats.closedAuctions,
        }),
      },
    ]

    return (
      <>
        <div className="d-none d-lg-block" style={{ width: '25%' }}>
          <CustomSelect
            withSearch
            options={options}
            defaultCurrent={
              auctionsStatus === ProfileAuctionsStatus.ALL
                ? 0
                : auctionsStatus === ProfileAuctionsStatus.ACTIVE
                  ? 1
                  : 2
            }
            onChange={(newValue) => {
              handleFilterChange(newValue.id as ProfileAuctionsStatus)
            }}
            name="main-category-filter"
            className="w-100"
          />
        </div>

        <div className="d-block d-lg-none">
          <button
            className="secondary-border-btn"
            onClick={toggleMobileAuctionsFilter}
            style={{ width: 45 }}
          >
            <Icon type="generic/filter" />
          </button>
        </div>

        <ProfileAuctionsListMobileFilter
          options={options}
          opened={mobileAuctionsFilterOpened}
          handleClose={toggleMobileAuctionsFilter}
          setActiveFilter={handleFilterChange}
          activeFilter={auctionsStatus}
        />
      </>
    )
  }
)
