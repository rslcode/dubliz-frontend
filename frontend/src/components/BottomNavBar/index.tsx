"use client";
import React from "react";
import {usePathname, useRouter} from "next/navigation";
import {useTranslation} from "@/app/i18n/client";
import useGlobalContext from "@/hooks/use-context";
import clsx from "clsx";

import HomeIcon from "@/../public/assets/svg/header/home.svg";
import AddIcon from "@/../public/assets/svg/header/add.svg";
import FavouriteIcon from "@/../public/assets/svg/header/favourite.svg";
import MessageIcon from "@/../public/assets/svg/header/message.svg";
import ProfileIcon from "@/../public/assets/svg/header/profile.svg";

type NavItem = {
    id: string;
    icon: React.ReactNode;
    path: string;
    translationKey: string;
};

const BottomNavBar = ({...props}) => {
    const {setMobileMenuOpened} = props
    const router = useRouter();
    const pathname = usePathname();
    const globalContext = useGlobalContext();
    const currentLanguage = globalContext.currentLanguage;
    const {t} = useTranslation(currentLanguage);

    const navItems: NavItem[] = [
        {
            id: "home",
            icon: <HomeIcon/>,
            path: "/",
            translationKey: "header.home"
        },
        {
            id: "favourite",
            icon: <FavouriteIcon/>,
            path: "/profile?tab=favourites",
            translationKey: "header.favourite"
        },
        {
            id: "add",
            icon: <AddIcon/>,
            path: "/auction-create",
            translationKey: "header.add"
        },
        {
            id: "message",
            icon: <MessageIcon/>,
            path: "/profile?tab=chat",
            translationKey: "header.message"
        },
        // {
        //     id: "profile",
        //     icon: <ProfileIcon />,
        //     path: "/profile", // /profile?tab=settings
        //     translationKey: "header.profile"
        // }
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleOpen = () => {
        document.body.classList.add('no-scroll')
        setMobileMenuOpened(true)
    }

    return (
        <div className="bottom-nav-bar d-flex justify-content-around align-items-center">
            <ul className="nav w-100 d-flex justify-content-between align-items-center mb-0">
                {navItems.map((item) => {
                    const isActive = pathname === item.path ||
                        (item.path !== "/" && pathname.startsWith(item.path));
                    return (
                        <li
                            key={item.id}
                            className={clsx(
                                "d-flex flex-column align-items-center",
                                "nav-item",
                                {"active": isActive}
                            )}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <div className={clsx("nav-icon", {"active": isActive})}>
                                {item.icon}
                            </div>
                            <span>{t(item.translationKey)}</span>
                        </li>
                    );
                })}
                <li
                    className={clsx(
                        "d-flex flex-column align-items-center",
                        "nav-item",
                    )}
                    onClick={() => handleOpen()}
                >
                    <div className={clsx("nav-icon")}>
                        <ProfileIcon/>
                    </div>
                    <span>{t("header.profile")}</span>
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
                }

                .nav li {
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .nav li span {
                    margin-top: 4px;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                }

                .nav li.active span {
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