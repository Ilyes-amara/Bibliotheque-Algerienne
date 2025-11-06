import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const ECardCrescent: React.FC = () => (
    <div className="w-16 h-16 text-danger absolute top-4 right-4 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-130 -130 260 260" className="w-full h-full">
            <path fill="currentColor" d="M0-100a100 100 0 010 200 80 80 0 000-200z"/>
            <path fill="currentColor" d="M0-40l13.8 38.4L-22.3-15l44.6 0L-9.2 23.4z"/>
        </svg>
    </div>
);


const ECard: React.FC = () => {
    const { user } = useAuth();
    const { t, dir } = useLanguage();

    if (!user || !user.subscription || user.cardStatus === 'none') {
        return null; // This case is handled by UserDashboardPage
    }

    const isSuspended = user.cardStatus === 'suspended';
    const cardNumber = `ALGLIB-${user.id.substring(0, 4).toUpperCase()}-${user.nationalId.slice(-4)}`;
    const memberSince = new Date(user.createdAt).toLocaleDateString(dir === 'rtl' ? 'ar-DZ' : 'fr-FR');

    return (
        <div className={`max-w-md mx-auto bg-surface rounded-xl shadow-lg overflow-hidden relative ${dir}`}>
            {isSuspended && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                    <span className="text-white text-3xl font-bold tracking-widest border-4 border-white px-4 py-2 rotate-[-15deg]">{t('suspended').toUpperCase()}</span>
                </div>
            )}
            <div className="flex">
                <div className="w-1/3 bg-primary"></div>
                <div className="w-2/3 bg-white"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full p-6">
                <ECardCrescent />
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-text-primary">{t('algerian_library')}</h2>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
                        <p className="text-sm text-text-secondary">{t('member_since')}: {memberSince}</p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-text-secondary font-semibold">{t('subscription_plan')}</p>
                        <p className="text-text-primary font-bold capitalize">{user.subscription.plan}</p>
                    </div>
                    <div>
                        <p className="text-text-secondary font-semibold">{t('status')}</p>
                        <p className={`${isSuspended ? 'text-danger' : 'text-green-600'} font-bold capitalize`}>
                            {t(user.cardStatus)}
                        </p>
                    </div>
                </div>

                 <div className="mt-4">
                    <p className="text-text-secondary font-semibold text-sm">{t('card_number')}</p>
                    <p className="text-text-primary font-mono tracking-widest">{cardNumber}</p>
                 </div>

                <div className="mt-4 flex justify-between items-end">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${cardNumber}`} alt="QR Code" className="w-20 h-20 bg-white p-1 rounded-md"/>
                    <div className="text-right">
                        <p className="font-serif italic text-xs text-gray-500">
                             الجمهورية الجزائرية الديمقراطية الشعبية
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ECard;