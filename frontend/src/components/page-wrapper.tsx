"use client"
import {initializeControllers} from '@/middlewares/init-controllers'
import {AccessGateway} from './access-gateway'
import {BackToTop} from './common/back-to-top'
import {Footer} from './footer'
import {Header} from './header'
import {ReactNode, useState} from 'react'
import {withSocketConnection} from '@/middlewares/socket-connection'
import {HeaderOffsetFixer} from './common/header-offset-fixer'
import BottomNavBar from "../components/bottomNavBar";

interface PageWrapperProps {
    children: ReactNode
}

export const PageWrapper = ({children}: PageWrapperProps) => {
    const [mobileMenuOpened, setMobileMenuOpened] = useState(false)

    return (
        <>
            {
                <>
                    <AccessGateway
                        middlewares={[initializeControllers, withSocketConnection]}
                        allowAnonymous={true}
                        workInBackground
                        serverWSUrl={process.env.NEXT_PUBLIC_SERVER_WS_URL}
                    >
                        <BackToTop/>
                        <Header mobileMenuOpened={mobileMenuOpened} setMobileMenuOpened={setMobileMenuOpened}/>
                        <HeaderOffsetFixer/>
                        <div className="main-content">{children}</div>
                        <Footer/>
                        <BottomNavBar setMobileMenuOpened={setMobileMenuOpened}/>
                        <br/>
                    </AccessGateway>
                </>
            }
        </>
    )
}
