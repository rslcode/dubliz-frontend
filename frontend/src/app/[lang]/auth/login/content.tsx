'use client'
import React from 'react'
import LoginForm from './form'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { ThemeProvider } from 'next-themes'
import { Footer } from '@/components/footer'
import BlankHeader from '@/components/common/blank-header'

export const LoginPageContent = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <ThemeProvider defaultTheme="dark">
      <BlankHeader />
      <main className="max-width" style={{ paddingTop: 83 }}>
        <section className="pt-50 pt-sm-5 pb-50 pb-sm-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-6 col-xl-7 col-lg-8 auth-card">
                <div className="pos-rel mb-40  ">
                  <h1> {t('auth.sign_in.sign_in')}</h1>
                  <p className="mb-35">{t('auth.sign_in.enter_credentials')}</p>
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ThemeProvider>
  )
}
