import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const FlagIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-8 h-8 rounded-sm">
        <rect width="900" height="600" fill="#fff"/>
        <rect width="450" height="600" fill="#006233"/>
        <g transform="translate(450, 300)">
            <g transform="scale(1.2)">
                <path d="M0-100a100 100 0 010 200 80 80 0 000-200z" fill="#d21034"/>
                <path d="M0-40l13.8 38.4L-22.3-15l44.6 0L-9.2 23.4z" fill="#d21034"/>
            </g>
        </g>
    </svg>
);

const UserIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

const Header: React.FC = () => {
    const { language, setLanguage, t, dir } = useLanguage();
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const activeLinkClass = "text-danger font-bold";
    const inactiveLinkClass = "hover:text-danger transition-colors";

    const navLinkStyle = ({ isActive }: { isActive: boolean }) => isActive ? activeLinkClass : inactiveLinkClass;

    return (
        <header className="bg-surface shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <NavLink to="/" className="flex items-center gap-3">
                        <FlagIcon />
                        <span className="text-xl font-bold text-primary">{t('algerian_library')}</span>
                    </NavLink>

                    <nav className="hidden md:flex items-center gap-6 text-lg font-medium text-text-secondary">
                        <NavLink to="/" className={navLinkStyle}>{t('home')}</NavLink>
                        <NavLink to="/books" className={navLinkStyle}>{t('books')}</NavLink>
                        <NavLink to="/subscribe" className={navLinkStyle}>{t('subscribe')}</NavLink>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                             <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-text-secondary font-semibold">
                                {language === 'fr' ? 'AR' : 'FR'}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6 6-6"/></svg>
                             </button>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 font-semibold">
                                        <UserIcon className="w-6 h-6 text-primary" />
                                        <span className="text-text-primary">{user?.name.split(' ')[0]}</span>
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-48 bg-surface rounded-md shadow-lg py-1 z-20`}>
                                            <NavLink to="/dashboard" className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100">{t('dashboard')}</NavLink>
                                            {user?.role === 'admin' && <NavLink to="/admin" className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100">{t('admin_dashboard')}</NavLink>}
                                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-gray-100">{t('logout')}</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <NavLink to="/login" className="px-4 py-2 rounded-md font-semibold text-primary border border-primary hover:bg-primary hover:text-white transition-colors">{t('login')}</NavLink>
                                    <NavLink to="/register" className="px-4 py-2 rounded-md font-semibold text-white bg-danger hover:bg-opacity-90 transition-colors">{t('register')}</NavLink>
                                </>
                            )}
                        </div>
                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden py-4">
                        <nav className="flex flex-col gap-4 items-center">
                            <NavLink to="/" className={navLinkStyle}>{t('home')}</NavLink>
                            <NavLink to="/books" className={navLinkStyle}>{t('books')}</NavLink>
                            <NavLink to="/subscribe" className={navLinkStyle}>{t('subscribe')}</NavLink>
                            <hr className="w-full" />
                             {isAuthenticated ? (
                                <div className="flex flex-col items-center gap-4 w-full">
                                    <NavLink to="/dashboard" className="w-full text-center">{t('dashboard')}</NavLink>
                                    {user?.role === 'admin' && <NavLink to="/admin" className="w-full text-center">{t('admin_dashboard')}</NavLink>}
                                    <button onClick={logout} className="w-full text-center">{t('logout')}</button>
                                </div>
                             ) : (
                                <div className="flex flex-col items-center gap-4 w-full">
                                    <NavLink to="/login" className="px-4 py-2 w-full text-center rounded-md font-semibold text-primary border border-primary hover:bg-primary hover:text-white transition-colors">{t('login')}</NavLink>
                                    <NavLink to="/register" className="px-4 py-2 w-full text-center rounded-md font-semibold text-white bg-danger hover:bg-opacity-90 transition-colors">{t('register')}</NavLink>
                                </div>
                             )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;