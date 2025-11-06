import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const NotFoundPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="text-center py-20">
            <h1 className="text-6xl font-extrabold text-danger">404</h1>
            <h2 className="text-3xl font-bold text-text-primary mt-4">{t('not_found')}</h2>
            <p className="text-text-secondary mt-2">{t('page_not_found_desc')}</p>
            <NavLink
                to="/"
                className="mt-8 inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus transition-colors"
            >
                {t('go_home')}
            </NavLink>
        </div>
    );
};

export default NotFoundPage;