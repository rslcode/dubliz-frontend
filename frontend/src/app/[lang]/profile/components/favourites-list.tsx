import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { AuctionCard } from '@/components/auction-card'
import { useEffect, useState } from 'react'
import { Auction } from '@/core/domain/auction'
import { AuctionsSortByDropdown } from '@/components/common/auctions-sort-by-dropdown'
import { CustomInput } from '@/components/common/custom-input'
import { debounce } from 'lodash'
import { AuctionsSortBy } from '@/core/repositories/auction'
import { NoResultsAvailable } from '@/components/common/no-results'
import { AppStore } from '@/core/store'
import CustomSelect, { CustomSelectOption } from '@/components/common/custom-select'
import { ProfileAuctionsStatus } from './auctions/list'
import { FavouritesController } from '@/core/controllers/favourites'

export const ProfileFavouritesSection = observer(() => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const activeTimeInHours = globalContext.appSettings.auctionActiveTimeInHours
  const activeAuctions = FavouritesController.getAuctions(true, activeTimeInHours)
  const closedAuctions = FavouritesController.getAuctions(false, activeTimeInHours)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [auctionsStatus, setAuctionsStatus] = useState<ProfileAuctionsStatus>(
    ProfileAuctionsStatus.ALL
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialAuctions = AppStore.favouriteAuctions ?? []
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions)

  const [sortBy, setSortBy] = useState(AuctionsSortBy.newest)
  const [auctionsLen, setAuctionsLen] = useState(initialAuctions.length ?? 0)

  const computeAuctionsLenBasedOnStatus = (status: ProfileAuctionsStatus) => {
    return status === ProfileAuctionsStatus.ALL
      ? AppStore.favouriteAuctions.length
      : status === ProfileAuctionsStatus.ACTIVE
        ? activeAuctions.length
        : closedAuctions.length
  }

  const computeAuctionsBasedOnStatus = (status: ProfileAuctionsStatus) => {
    return status === ProfileAuctionsStatus.ALL
      ? AppStore.favouriteAuctions
      : status === ProfileAuctionsStatus.ACTIVE
        ? activeAuctions
        : closedAuctions
  }

  useEffect(() => {
    setAuctions(initialAuctions)
    setAuctionsLen(initialAuctions.length)
  }, [initialAuctions])

  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword)
    const lowercaseKeyword = keyword.toLowerCase()

    let newAuctions = computeAuctionsBasedOnStatus(auctionsStatus)
    newAuctions = newAuctions.filter((auction) => {
      return (
        auction.title.toLowerCase().includes(lowercaseKeyword) ||
        auction.description.toLowerCase().includes(lowercaseKeyword)
      )
    })

    setAuctionsLen(newAuctions.length)
    setAuctions(newAuctions)
  }

  const handleSortChange = async (sortBy: AuctionsSortBy) => {
    setSortBy(sortBy)
    const sortedAuctions = auctions.sort((a, b) => {
      if (sortBy === AuctionsSortBy.newest) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === AuctionsSortBy.oldest) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === AuctionsSortBy.priceAsc) {
        return (
          new Date(a.lastPrice ?? a.startingPrice ?? 0).getTime() -
          new Date(b.lastPrice ?? b.startingPrice ?? 0).getTime()
        )
      } else {
        return (
          new Date(b.lastPrice ?? b.startingPrice ?? 0).getTime() -
          new Date(a.lastPrice ?? a.startingPrice ?? 0).getTime()
        )
      }
    })

    setAuctions(sortedAuctions)
  }

  const handleSearchDebounced = debounce(handleSearch, 500)

  const handleFilterChange = async (status: ProfileAuctionsStatus) => {
    const newAuctionsLen = computeAuctionsLenBasedOnStatus(status)
    const newAuctions = computeAuctionsBasedOnStatus(status)
    setAuctionsStatus(status)
    setAuctionsLen(newAuctionsLen)
    setAuctions(newAuctions)
  }

  const options: CustomSelectOption[] = [
    {
      id: ProfileAuctionsStatus.ALL,
      option: t('home.auctions.all_auctions', {
        no: AppStore.favouriteAuctions.length,
      }),
    },
    {
      id: ProfileAuctionsStatus.ACTIVE,
      option: t('profile.active_auctions.active_auctions', {
        no: activeAuctions.length,
      }),
    },
    {
      id: ProfileAuctionsStatus.CLOSED,
      option: t('profile.closed_auctions.closed_auctions', {
        no: closedAuctions.length,
      }),
    },
  ]

  if (!AppStore.favouriteAuctions.length) {
    return <NoResultsAvailable title={t('home.auctions.no_auctions_to_display')} />
  }

  const hasTabsLayout = globalContext.appSettings.profilePageLayout === 'tabs'
  const cardsSizeBasedOnLayout = `${hasTabsLayout ? 'col-xl-3' : 'col-xl-4'} ${hasTabsLayout ? 'col-md-4' : 'col-md-3'}`

  return (
    <div className="d-flex flex-column">
      <div className="w-100 d-flex gap-2 align-items-center">
        <CustomInput
          secondary
          placeholder={t('home.search.search')}
          style={{ width: '100%' }}
          value={searchKeyword}
          onChange={handleSearchDebounced}
        />
        <div style={{ width: '25%' }}>
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
        <AuctionsSortByDropdown
          selected={sortBy}
          withLabel={false}
          handleSelect={handleSortChange}
        />
      </div>
      <div className="mt-20 mb-10 d-flex justify-content-start mt-10"></div>

      <div className="d-flex justify-center row w-100 no-bs-gutter">
        {!auctionsLen && (
          <div className="mt-30">
            <NoResultsAvailable title={t('home.auctions.no_auctions_to_display')} />
          </div>
        )}
        {auctions.map((auction, index) => {
          return (
            <div key={index} className={`container ${cardsSizeBasedOnLayout} col-sm-4 col-6 p-1 m-0`}>
              <AuctionCard fullWidth auction={auction} />
            </div>
          )
        })}
      </div>
    </div>
  )
})
