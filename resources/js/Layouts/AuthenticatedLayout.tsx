import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import ThemeToggle from '@/Components/ThemeToggle';
import Chatbot from '@/Components/Chatbot';
import { User } from '@/types';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { user, notifications } = usePage().props.auth as any; 
    const unreadCount = notifications.filter((n: any) => n.read_at === null).length;

    const markAsRead = () => {
        if (unreadCount > 0) {
            router.post(route('notifications.read'), {}, {
                preserveScroll: true,
            });
        }
    };

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <nav className="border-b border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="dark:text-gray-300 dark:hover:text-white"
                                >
                                    Dashboard
                                </NavLink>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('assets.index')}
                                    active={route().current('assets.index')}
                                    className="dark:text-gray-300 dark:hover:text-white"
                                >
                                    Asset Management
                                </NavLink>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('analytics.index')}
                                    active={route().current('analytics.index')}
                                    className="dark:text-gray-300 dark:hover:text-white"
                                >
                                    Analytics
                                </NavLink>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('logs.index')}
                                    active={route().current('logs.index')}
                                    className="dark:text-gray-300 dark:hover:text-white"
                                >
                                    Activity Logs
                                </NavLink>
                            </div> 
                            
                        </div>

                        {/* DESKTOP NAV RIGHT SIDE */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            
                            {/* --- BELL ICON --- */}
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            onClick={markAsRead}
                                            className="relative p-1 text-gray-400 hover:text-gray-500 focus:outline-none dark:text-gray-300 transition-colors"
                                        >
                                            <span className="text-2xl">🔔</span>
                                            {unreadCount > 0 && (
                                                <span className="absolute top-0 right-0 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-800">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="48">
                                        <div className="w-80 sm:w-96 overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Notifications</span>
                                                {unreadCount > 0 && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto">
                                                {notifications && notifications.length > 0 ? (
                                                    notifications.map((n: any) => (
                                                        <div key={n.id} className={`border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${!n.read_at ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}>
                                                            <div className="px-4 py-3">
                                                                <div className="flex justify-between">
                                                                    <p className={`text-sm ${!n.read_at ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                        {n.data.title}
                                                                    </p>
                                                                    {!n.read_at && <div className="h-2 w-2 bg-blue-500 rounded-full mt-1"></div>}
                                                                </div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 leading-relaxed">{n.data.message}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-10 text-center">
                                                        <p className="text-sm text-gray-400">All caught up! ✨</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            {/* --- THEME TOGGLE --- */}
                            <div className="ms-3">
                                <ThemeToggle />
                            </div>

                            {/* --- USER DROPDOWN --- */}
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:hover:bg-gray-700"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE NAVIGATION DROPDOWN */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow transition-colors duration-300">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            <main>{children}</main>
            <Chatbot />
        </div>
    );
}