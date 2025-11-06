import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-white">
            <div className="container mx-auto px-4 py-6 text-center">
                <p>&copy; {currentYear} {t('algerian_library')}. All Rights Reserved.</p>
                <p className="mt-2 text-sm opacity-80">Made with ❤️ for Algeria</p>
            </div>
        </footer>
    );
};

export default Footer;