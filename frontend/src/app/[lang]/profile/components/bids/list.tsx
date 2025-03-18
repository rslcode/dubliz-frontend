import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { AuctionCard } from '@/components/auction-card'
import { useRef, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { AuctionsController } from '@/core/controllers/auctions'
import { Auction } from '@/core/domain/auction'
import { AuctionCardSkeleton } from '@/components/skeletons/auction-card'
import { AuctionsSortByDropdown } from '@/components/common/auctions-sort-by-dropdown'
import { CustomInput } from '@/components/common/custom-input'
import { debounce } from 'lodash'
import { AuctionsSortBy } from '@/core/repositories/auction'
import { NoResultsAvailable } from '@/components/common/no-results'
import { AppStore } from '@/core/store'
import { ProfileBidsFilter } from './filter'
import { AuctionsSortByMobileDropdown } from '@/components/common/auctions-sort-by-mobile'

const ITEMS_PER_PAGE = 12

export enum ProfileBidsStatus {
  ALL = 'all',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export const ProfileBidsSection = observer((props: { bids: Auction[] }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [searchKeyword, setSearchKeyword] = useState('')

  const [bidsStatus, setBidsStatus] = useState<ProfileBidsStatus>(ProfileBidsStatus.ALL)
  const [bids, setBids] = useState<Record<number, Auction[]>>({
    0: props.bids ?? [],
  })

  const [sortBy, setSortBy] = useState(AuctionsSortBy.newest)
  const [currentPage, setCurrentPage] = useState(0)
  const [bidsLoading, setBidsLoading] = useState(false)
  const [bidsLen, setBidsLen] = useState(
    AppStore.accountStats.allBidsCount || props.bids?.length || 0
  )

  const bidsRootRef = useRef<HTMLDivElement>(null)

  const computeBidsLenBasedOnStatus = (status: ProfileBidsStatus) => {
    return status === ProfileBidsStatus.ALL
      ? AppStore.accountStats.allBidsCount
      : status === ProfileBidsStatus.ACCEPTED
        ? AppStore.accountStats.acceptedBids
        : AppStore.accountStats.rejectedBids
  }

  const handlePageChange = async (page: number) => {
    if (bids[page]) {
      setCurrentPage(page)
      return
    }

    setBidsLoading(true)
    const newAuctions = await AuctionsController.loadForAccountByBidStatus(
      bidsStatus,
      page,
      ITEMS_PER_PAGE,
      searchKeyword,
      sortBy
    )
    setBids((prev) => ({ ...prev, [page]: newAuctions }))
    setBidsLoading(false)
    setCurrentPage(page)

    setTimeout(() => {
      if (bidsRootRef.current) {
        bidsRootRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        })
      }
    }, 0)
  }

  const handleSearch = async (keyword: string) => {
    setBidsLoading(true)
    setSearchKeyword(keyword)
    setCurrentPage(0)

    const [newAuctions, count] = await Promise.all([
      AuctionsController.loadForAccountByBidStatus(bidsStatus, 0, ITEMS_PER_PAGE, keyword, sortBy),
      // If we have no keyword, we can just set the auctions length
      // to the account's active auctions count, like in the initial state
      !keyword?.length
        ? Promise.resolve(computeBidsLenBasedOnStatus(bidsStatus) ?? 0)
        : AuctionsController.countForAccountByBidStatus(bidsStatus, keyword),
    ])

    setBidsLen(count)
    setBids({ 0: newAuctions })
    setBidsLoading(false)
  }

  const handleSortChange = async (sortBy: AuctionsSortBy) => {
    setSortBy(sortBy)
    setBidsLoading(true)
    setCurrentPage(0)
    const newAuctions = await AuctionsController.loadForAccountByBidStatus(
      bidsStatus,
      0,
      ITEMS_PER_PAGE,
      searchKeyword,
      sortBy
    )
    setBids({ 0: newAuctions })
    setBidsLoading(false)
  }

  const handleSearchDebounced = debounce(handleSearch, 500)

  const handleFilterChange = async (status: ProfileBidsStatus) => {
    setBidsStatus(status)
    setBidsLoading(true)
    setCurrentPage(0)

    const newAuctionsLen = computeBidsLenBasedOnStatus(status)
    setBidsLen(newAuctionsLen)

    const newAuctions = await AuctionsController.loadForAccountByBidStatus(
      status,
      0,
      ITEMS_PER_PAGE,
      searchKeyword,
      sortBy
    )
    setBids({ 0: newAuctions })
    setBidsLoading(false)
  }

  const maxPages = Math.ceil(bidsLen / ITEMS_PER_PAGE)
  const minBetweenPerPageAndExisting = Math.min(ITEMS_PER_PAGE, bidsLen)
  const arrayOfItems = Array.from({ length: minBetweenPerPageAndExisting }, (_, index) => index)

  if (!bidsLoading && !props.bids?.length && !bidsLen) {
    return <NoResultsAvailable title={t('home.auctions.no_auctions_to_display')} />
  }

  const hasTabsLayout = globalContext.appSettings.profilePageLayout === 'tabs'
  const cardsSizeBasedOnLayout = `${hasTabsLayout ? 'col-xl-3' : 'col-xl-4'} ${hasTabsLayout ? 'col-md-4' : 'col-md-3'}`

  return (
    <div className="d-flex flex-column" ref={bidsRootRef}>
      <div className="w-100 d-flex gap-2 align-items-center">
        <CustomInput
          secondary
          isLoading={bidsLoading}
          placeholder={t('home.search.search')}
          style={{ width: '100%' }}
          value={searchKeyword}
          onChange={handleSearchDebounced}
        />
        <ProfileBidsFilter initialStatus={bidsStatus} handleFilterChange={handleFilterChange} />
        <AuctionsSortByDropdown
          selected={sortBy}
          withLabel={false}
          handleSelect={handleSortChange}
        />
        <AuctionsSortByMobileDropdown handleSelect={handleSortChange} selected={sortBy} />
      </div>
      <div className="mt-20 mb-10 d-flex justify-content-start mt-10">
        {!bidsLoading && !bidsLen ? null : (
          <span>{t('info.you_see_page', { page: currentPage + 1, total: maxPages })}</span>
        )}
      </div>
      <div className="d-flex justify-center row w-100 no-bs-gutter">
        {bidsLoading && (
          <>
            {arrayOfItems.map((i) => (
              <div key={i} className={`container ${cardsSizeBasedOnLayout} col-sm-4 col-6 p-1 m-0`}>
                <AuctionCardSkeleton />
              </div>
            ))}
          </>
        )}
        {!bidsLoading && !bidsLen && (
          <div className="mt-30">
            <NoResultsAvailable title={t('home.auctions.no_auctions_to_display')} />
          </div>
        )}
        {!bidsLoading &&
          bids[currentPage].map((auction, index) => {
            return (
              <div key={index} className={`container ${cardsSizeBasedOnLayout} col-sm-4 col-6 p-1 m-0`}>
                <AuctionCard fullWidth auction={auction} />
              </div>
            )
          })}
      </div>
      <div className="d-flex justify-content-center mt-20 mb-10">
        <ReactPaginate
          nextLabel=">"
          previousLabel="<"
          onPageChange={(page) => {
            handlePageChange(page.selected)
          }}
          forcePage={currentPage}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={maxPages}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  )
})
