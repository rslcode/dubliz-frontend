import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useRef, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { ReviewItem } from '@/components/reviews/review-item'
import { ReviewsController } from '@/core/controllers/review'
import { Review } from '@/core/domain/review'
import { NoResultsAvailable } from '@/components/common/no-results'
import { ReviewCardSkeleton } from '@/components/skeletons/review'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'

const ITEMS_PER_PAGE = 10

export const ProfileReviewsSection = observer((props: { reviews: Review[] }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const accountReviewsCount = AppStore.accountData?.reviewsCount ?? 0

  const [currentPage, setCurrentPage] = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviews, setReviews] = useState<Record<string, Review[]>>({
    0: props.reviews,
  })

  const reviewsRootRef = useRef<HTMLDivElement>(null)

  const handlePageChange = async (page: number) => {
    if (reviews[page]) {
      setCurrentPage(page)
      return
    }

    setReviewsLoading(true)
    setCurrentPage(page)

    const newAuctions = await ReviewsController.getForLoggedAccount(page, ITEMS_PER_PAGE)

    setReviews((prev) => ({ ...prev, [page]: newAuctions }))
    setReviewsLoading(false)

    setTimeout(() => {
      if (reviewsRootRef.current) {
        reviewsRootRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        })
      }
    }, 0)
  }

  if (!accountReviewsCount) {
    return <NoResultsAvailable title={t('profile.reviews.no_reviews')} />
  }

  const maxPages = Math.ceil(accountReviewsCount / ITEMS_PER_PAGE)
  const minBetweenPerPageAndExisting = Math.min(ITEMS_PER_PAGE, accountReviewsCount)
  const arrayOfFollowing = Array.from({ length: minBetweenPerPageAndExisting }, (_, index) => index)

  return (
    <div>
      <div className="mb-10" ref={reviewsRootRef}>
        <span>{t('info.you_see_page', { page: currentPage + 1, total: maxPages })}</span>
      </div>

      <div className="d-flex gap-2 flex-column">
        {(reviewsLoading || !reviews[currentPage]) &&
          arrayOfFollowing.map((index) => {
            return <ReviewCardSkeleton key={index} />
          })}
        {!reviewsLoading &&
          reviews[currentPage]?.map((review, index) => {
            return <ReviewItem withBorder key={index} review={review} />
          })}
      </div>

      <div className="d-flex justify-content-center mt-20 mb-10">
        <ReactPaginate
          nextLabel=">"
          previousLabel="<"
          onPageChange={(page) => {
            handlePageChange(page.selected)
          }}
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
