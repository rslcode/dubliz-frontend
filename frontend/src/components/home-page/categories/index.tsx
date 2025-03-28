'use client'
import {Category} from '@/core/domain/category'
import {CategoryCard} from './category-card'
import useGlobalContext from '@/hooks/use-context'
import {useTranslation} from '@/app/i18n/client'
import {AppStore} from '@/core/store'
import {observer} from 'mobx-react-lite'
import {IntroCategoriesPreferencesModal} from '@/components/intro/preferences'
import {useEffect, useRef, useState} from 'react'
import {AccountController} from '@/core/controllers/account'
import {toast} from 'react-toastify'
import Link from 'next/link'
import {CategoriesController} from '@/core/controllers/categories'
import {useScreenIsBig} from '@/hooks/use-screen-is-big'

const mockCategories: any = [
    {
        id: '1',
        name: {en: 'Electronics', ru: 'Электроника'},
        icon: 'electronics',
        auctionsCount: 12,
    },
    {
        id: '2',
        name: {en: 'Furniture', ru: 'Мебель'},
        icon: 'electronics',
        auctionsCount: 7,
    },
    {
        id: '3',
        name: {en: 'Clothing', ru: 'Одежда'},
        icon: 'electronics',
        auctionsCount: 15,
    },
    {
        id: '4',
        name: {en: 'Toys', ru: 'Игрушки'},
        icon: 'electronics',
        auctionsCount: 5,
    },
    {
        id: '5',
        name: {en: 'Vehicles', ru: 'Транспорт'},
        icon: 'electronics',
        auctionsCount: 9,
    },
    {
        id: '6',
        name: {en: 'Vehicles', ru: 'Транспорт'},
        icon: 'electronics',
        auctionsCount: 9,
    },
    {
        id: '7',
        name: {en: 'Vehicles', ru: 'Транспорт'},
        icon: 'electronics',
        auctionsCount: 9,
    },
]

export const CategoriesSection = observer(
    (props: { activeAuctionsCount: number; isMobile: boolean }) => {
        const globalContext = useGlobalContext()
        const currentLanguage = globalContext.currentLanguage
        const {t} = useTranslation(currentLanguage)
        const {isMobile} = props

        const currentAccount = AppStore.accountData
        const preferredCategories = AppStore.accountData?.preferredCategoriesIds || []

        const [maxHeightOfCategories, setMaxHeightOfCategories] = useState(0)
        const screenIsBig = useScreenIsBig(!isMobile)

        const categoriesToDisplayRef = useRef<Category[]>([])
        const categoriesRef = useRef<HTMLDivElement>(null)

        const computeCategoriesToDisplay = () => {
            if (window?.innerWidth > 768) {
                return
            }

            const categoriesToDisplay = CategoriesController.getPersonalizedCategoriesForHome(categories)

            if (categoriesToDisplay.length) {
                categoriesToDisplayRef.current = categoriesToDisplay
            }
        }

        useEffect(() => {
            computeCategoriesToDisplay()
            window?.addEventListener('resize', computeCategoriesToDisplay)

            return () => {
                window?.removeEventListener('resize', computeCategoriesToDisplay)
            }
        }, [])

        useEffect(() => {
            const calculateHeights = () => {
                if (!categoriesRef.current) {
                    return
                }

                const items = categoriesRef.current.querySelectorAll('.home-page-category-card')
                items.forEach((item) => {
                    (item as HTMLElement).style.height = '180px'
                })

                const tallest = Math.max(
                    ...Array.from(items).map((item) => (item as HTMLElement).offsetHeight)
                )
                items.forEach((item) => {
                    (item as HTMLElement).style.height = `${tallest}px`
                })

                setMaxHeightOfCategories(tallest)
            }

            calculateHeights()
            window.addEventListener('resize', calculateHeights)

            return () => {
                window.removeEventListener('resize', calculateHeights)
            }
        }, [])

        const [categoriesPreferencesOpen, setCategoriesPreferencesOpen] = useState(false)

        const toggleCategoriesPreferences = () => {
            setCategoriesPreferencesOpen(!categoriesPreferencesOpen)
        }

        const handleFinishCategoriesSetup = (categories: Category[]) => {
            setCategoriesPreferencesOpen(false)
            AccountController.finishCategoriesSetup(categories)
            computeCategoriesToDisplay()
            toast.success(t('info.preferences_updated'))
        }

        const allActiveAuctionsCount = AppStore.activeAuctionsCount || props.activeAuctionsCount

        const categories = globalContext.appCategories

        return (
            <div
                className="home-page-categories max-width d-flex flex-col align-items-center w-100 mt-30 mt-sm-5 gap-4"
                style={{flexDirection: 'column'}}
            >
                <div className="d-flex align-items-center justify-content-between section-header">
                    <h1 className="text-4xl font-bold text-center m-0">{t('home.categories.categories')}</h1>
                    {currentAccount?.id ? (
                        <button className={'border-btn hidden-border-btn mr-5'}
                                onClick={toggleCategoriesPreferences}
                        >
                            <span>{t('info.manage_preferences')}</span>
                        </button>
                    ) : (
                        <Link href="/auth/login">
                            <button
                                className={`${!screenIsBig ? 'border-btn' : 'hidden-border-btn'} mr-5`}
                                aria-label={t('info.manage_preferences')}
                            >
                                <span>{t('info.manage_preferences')}</span>
                            </button>
                        </Link>
                    )}
                </div>

                <div
                    className="d-grid w-100 mr-20"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                        gap: '16px',
                        justifyContent: 'center',
                        maxWidth: '1300px',
                    }}
                    ref={categoriesRef}
                >
                    <CategoryCard
                        maxCategoryHeight={maxHeightOfCategories}
                        category={{
                            id: 'all',
                            name: {[currentLanguage]: t('home.categories.all')},
                            icon: 'all',
                            auctionsCount: allActiveAuctionsCount,
                        }}
                    />

                    {(!screenIsBig
                      ? categoriesToDisplayRef.current?.length
                        ? categoriesToDisplayRef.current
                        : isMobile
                          ? categories.slice(0, 5)
                          : categories
                      : categories
                    ).map((category: Category, index: number) => {
                      return (
                        <CategoryCard
                          category={category}
                          key={index}
                          maxCategoryHeight={maxHeightOfCategories}
                        />
                      )
                    })}

                    {/*{[...mockCategories, ...mockCategories, ...mockCategories, ...mockCategories, ...mockCategories].map((category: Category, index: number) => {*/}
                    {/*    return (*/}
                    {/*        <CategoryCard*/}
                    {/*            category={category}*/}
                    {/*            key={index}*/}
                    {/*            maxCategoryHeight={maxHeightOfCategories}*/}
                    {/*        />*/}
                    {/*    )*/}
                    {/*})}*/}
                </div>

                <IntroCategoriesPreferencesModal
                    withSkip={false}
                    initialPreferredCategories={preferredCategories}
                    isOpened={categoriesPreferencesOpen}
                    close={toggleCategoriesPreferences}
                    handleFinish={handleFinishCategoriesSetup}
                />
            </div>
        )
    }
)
