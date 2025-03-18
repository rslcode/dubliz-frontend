import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { AuctionCard } from '@/components/auction-card'
import { useEffect, useRef, useState } from 'react'
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
import { AuctionsSortByMobileDropdown } from '@/components/common/auctions-sort-by-mobile'
import { ProfileAuctionsFilter } from './filter'

const ITEMS_PER_PAGE = 12

export enum ProfileAuctionsStatus {
  ALL = 'all',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export const ProfileAuctionsSection = observer(
  (props: { auctions: Auction[]; isMobile: boolean }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const [searchKeyword, setSearchKeyword] = useState('')

    const [auctionsStatus, setAuctionsStatus] = useState<ProfileAuctionsStatus>(
      ProfileAuctionsStatus.ALL
    )
    const [auctions, setAuctions] = useState<Record<number, Auction[]>>({
      0: props.auctions ?? [],
    })

    const allAuctionsCount = AppStore.accountStats.allAuctionsCount

    const [sortBy, setSortBy] = useState(AuctionsSortBy.newest)
    const [currentPage, setCurrentPage] = useState(0)
    const [auctionsLoading, setAuctionsLoading] = useState(false)
    const [auctionsLen, setAuctionsLen] = useState(
      allAuctionsCount || props.auctions.length
    )

    const auctionsRootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (allAuctionsCount && auctionsLen !== allAuctionsCount) {
        setAuctionsLen(allAuctionsCount)
      }
    }, [allAuctionsCount])

    const computeAuctionsLenBasedOnStatus = (status: ProfileAuctionsStatus) => {
      return status === ProfileAuctionsStatus.ALL
        ? allAuctionsCount
        : status === ProfileAuctionsStatus.ACTIVE
          ? AppStore.accountStats.activeAuctions
          : AppStore.accountStats.closedAuctions
    }

    const handlePageChange = async (page: number) => {
      if (auctions[page]) {
        setCurrentPage(page)
        return
      }

      setAuctionsLoading(true)
      const newAuctions = await AuctionsController.loadForCurrentAccountByStatus(
        auctionsStatus,
        page,
        ITEMS_PER_PAGE,
        searchKeyword,
        sortBy
      )
      setAuctions((prev) => ({ ...prev, [page]: newAuctions }))
      setAuctionsLoading(false)
      setCurrentPage(page)

      setTimeout(() => {
        if (auctionsRootRef.current) {
          auctionsRootRef.current.scrollIntoView({
            behavior: 'instant',
            block: 'start',
          })
        }
      }, 0)
    }

    const handleSearch = async (keyword: string) => {
      setAuctionsLoading(true)
      setSearchKeyword(keyword)
      setCurrentPage(0)

      const [newAuctions, count] = await Promise.all([
        AuctionsController.loadForCurrentAccountByStatus(
          auctionsStatus,
          0,
          ITEMS_PER_PAGE,
          keyword,
          sortBy
        ),
        // If we have no keyword, we can just set the auctions length
        // to the account's active auctions count, like in the initial state
        !keyword?.length
          ? Promise.resolve(computeAuctionsLenBasedOnStatus(auctionsStatus) ?? 0)
          : AuctionsController.countForCurrentAccountByStatus(auctionsStatus, keyword),
      ])

      setAuctionsLen(count)
      setAuctions({ 0: newAuctions })
      setAuctionsLoading(false)
    }

    const handleSortChange = async (sortBy: AuctionsSortBy) => {
      setSortBy(sortBy)
      setAuctionsLoading(true)
      setCurrentPage(0)
      const newAuctions = await AuctionsController.loadForCurrentAccountByStatus(
        auctionsStatus,
        0,
        ITEMS_PER_PAGE,
        searchKeyword,
        sortBy
      )
      setAuctions({ 0: newAuctions })
      setAuctionsLoading(false)
    }

    const handleSearchDebounced = debounce(handleSearch, 500)

    const handleFilterChange = async (status: ProfileAuctionsStatus) => {
      setAuctionsStatus(status)
      setAuctionsLoading(true)
      setCurrentPage(0)

      const newAuctionsLen = computeAuctionsLenBasedOnStatus(status)
      setAuctionsLen(newAuctionsLen)

      const newAuctions = await AuctionsController.loadForCurrentAccountByStatus(
        status,
        0,
        ITEMS_PER_PAGE,
        searchKeyword,
        sortBy
      )
      setAuctions({ 0: newAuctions })
      setAuctionsLoading(false)
    }

    const maxPages = Math.ceil(auctionsLen / ITEMS_PER_PAGE)
    const minBetweenPerPageAndExisting = Math.min(ITEMS_PER_PAGE, auctionsLen)
    const arrayOfItems = Array.from({ length: minBetweenPerPageAndExisting }, (_, index) => index)

    if (!auctionsLoading && !props.auctions.length && !auctionsLen) {
      return <NoResultsAvailable title={t('home.auctions.no_auctions_to_display')} />
    }

    const hasTabsLayout = globalContext.appSettings.profilePageLayout === 'tabs'
    const cardsSizeBasedOnLayout = `${hasTabsLayout ? 'col-xl-3' : 'col-xl-4'} ${hasTabsLayout ? 'col-md-4' : 'col-md-3'}`

    return (
      <div className="d-flex flex-column" ref={auctionsRootRef}>
        <div className="w-100 d-flex gap-2 align-items-center">
          <div className="flex-1">
            <CustomInput
              secondary
              isLoading={auctionsLoading}
              placeholder={t('home.search.search')}
              style={{ width: '100%' }}
              value={searchKeyword}
              onChange={handleSearchDebounced}
            />
          </div>
          <ProfileAuctionsFilter
            initialStatus={auctionsStatus}
            handleFilterChange={handleFilterChange}
          />
          <AuctionsSortByDropdown
            selected={sortBy}
            withLabel={false}
            handleSelect={handleSortChange}
          />
          <AuctionsSortByMobileDropdown handleSelect={handleSortChange} selected={sortBy} />
        </div>
        <div className="mt-20 mb-10 d-flex justify-content-start mt-10">
          {!auctionsLoading && !auctionsLen ? null : (
            <span>
              {t('info.you_see_page', {
                page: currentPage + 1,
                total: maxPages,
              })}
            </span>
          )}
        </div>
        <div className="d-flex justify-center row w-100 no-bs-gutter">
          {auctionsLoading && (
            <>
              {arrayOfItems.map((i) => (
                <div
                  key={i}
                  className={`container ${cardsSizeBasedOnLayout} col-sm-4 col-6 p-1 m-0`}
                >
                  <AuctionCardSkeleton />
                </div>
              ))}
            </>
          )}

          {!auctionsLoading && !auctionsLen && (
            <div className="mt-30">
              <NoResultsAvailable title={t('home.auctions.no_auctions_to_display')} />
            </div>
          )}
          {!auctionsLoading &&
            auctions[currentPage].map((auction, index) => {
              return (
                <div
                  key={index}
                  className={`container ${cardsSizeBasedOnLayout} col-sm-4 col-6 p-1 m-0`}
                >
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
  }
)
