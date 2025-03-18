import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { ProfileBidsStatus } from './list'
import { useEffect, useState } from 'react'
import CustomSelect, { CustomSelectOption } from '@/components/common/custom-select'
import { AppStore } from '@/core/store'
import { Icon } from '@/components/common/icon'
import { ProfileBidsListMobileFilter } from './mobile-filter'

export const ProfileBidsFilter = observer(
  (props: {
    initialStatus: ProfileBidsStatus
    handleFilterChange: (status: ProfileBidsStatus) => void
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { handleFilterChange } = props

    const [bidsStatus, setBidsStatus] = useState<ProfileBidsStatus>(props.initialStatus)
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
      setBidsStatus(props.initialStatus)
    }, [props.initialStatus])

    const options: CustomSelectOption[] = [
      {
        id: ProfileBidsStatus.ALL,
        option: t('profile.all_your_bids.all_bids', {
          no: AppStore.accountStats.allBidsCount,
        }),
      },
      {
        id: ProfileBidsStatus.ACCEPTED,
        option: t('profile.accepted_bids.accepted_bids', {
          no: AppStore.accountStats.acceptedBids,
        }),
      },
      {
        id: ProfileBidsStatus.REJECTED,
        option: t('profile.rejected_bids.rejected_bids', {
          no: AppStore.accountStats.rejectedBids,
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
              bidsStatus === ProfileBidsStatus.ALL
                ? 0
                : bidsStatus === ProfileBidsStatus.ACCEPTED
                  ? 1
                  : 2
            }
            onChange={(newValue) => {
              handleFilterChange(newValue.id as ProfileBidsStatus)
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

        <ProfileBidsListMobileFilter
          options={options}
          opened={mobileAuctionsFilterOpened}
          handleClose={toggleMobileAuctionsFilter}
          setActiveFilter={handleFilterChange}
          activeFilter={bidsStatus}
        />
      </>
    )
  }
)
