"use client";
import React from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useTranslation} from '@/app/i18n/client';
import useGlobalContext from '@/hooks/use-context';
import clsx from 'clsx';
import {Icon} from '@/components/common/icon';

type NavItem = {
    id: string;
    icon: React.ReactNode;
    path: string;
    translationKey: string;
    exact?: boolean;
};

type BottomNavBarProps = {
    setMobileMenuOpened: (opened: boolean) => void;
};

const BottomNavBar = ({setMobileMenuOpened}: BottomNavBarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const globalContext = useGlobalContext();
    const currentLanguage = globalContext.currentLanguage;
    const {t} = useTranslation(currentLanguage);

    const navItems: NavItem[] = [
        {
            id: 'home',
            icon: <Icon type="header/home"/>,
            path: '/',
            translationKey: 'header.home',
            exact: true,
        },
        {
            id: 'favourite',
            icon: <Icon type="header/favourite"/>,
            path: '/profile?tab=favourites',
            translationKey: 'header.favourite',
        },
        {
            id: 'add',
            icon: <Icon type="header/add"/>,
            path: '/auction-create',
            translationKey: 'header.add',
        },
        {
            id: 'message',
            icon: <Icon type="header/message"/>,
            path: '/profile?tab=chat',
            translationKey: 'header.message',
        },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleOpen = () => {
        document.body.classList.add('no-scroll');
        setMobileMenuOpened(true);
    };

    const checkIsActive = (item: NavItem) => {
        if (item.exact) {
            return pathname === item.path;
        }
        return pathname.startsWith(item.path.split('?')[0]);
    };

    return (
        <div className="bottom-nav-bar">
            <ul className="nav">
                {navItems.map((item) => {
                    const isActive = checkIsActive(item);
                    return (
                        <li
                            key={item.id}
                            className={clsx('nav-item', {active: isActive})}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <div className={clsx('nav-icon', {active: isActive})}>
                                {item.icon}
                            </div>
                            <span>{t(item.translationKey)}</span>
                        </li>
                    );
                })}
                <li className="nav-item" onClick={handleOpen}>
                    <div className="nav-icon">
                        <Icon type="header/profile"/>
                    </div>
                    <span>{t('header.profile')}</span>
                </li>
            </ul>

            <style jsx>{`
                .bottom-nav-bar {
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    z-index: 999;
                    background: var(--background_1);
                    width: 100%;
                    height: 80px;
                    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
                    padding: 10px 30px;
                    display: flex;
                    justify-content: center;
                }

                .nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .nav-item {
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .nav-item:hover {
                    background: rgba(0, 0, 0, 0.05);
                }

                .nav-item.active {
                    color: var(--call_to_action);
                }

                .nav-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .nav-icon.active {
                    color: var(--call_to_action);
                }

                .nav-item span {
                    margin-top: 4px;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                }

                .nav-item.active span {
                    font-weight: 500;
                }

                @media (min-width: 600px) {
                    .bottom-nav-bar {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BottomNavBar;