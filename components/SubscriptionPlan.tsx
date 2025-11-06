import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';


interface SubscriptionPlanProps {
    plan: 'basic' | 'standard' | 'premium';
    price: number;
    features: {
        books: number;
        duration: number;
        renewals: number;
        reservations: boolean;
        rareBooks: boolean;
    };
    isCurrent?: boolean;
}

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);


const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({ plan, price, features, isCurrent }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    
    const planKey = `${plan}_plan`;
    
    const handleSubscribe = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        // Navigate to payment page with plan info
        navigate('/payment', { state: { plan } });
    };


    return (
        <div className={`border-2 rounded-lg p-6 flex flex-col bg-surface ${isCurrent ? 'border-danger' : 'border-gray-200'}`}>
            <h3 className="text-2xl font-bold text-center capitalize text-primary">{t(planKey)}</h3>
            <p className="text-4xl font-extrabold text-center my-4 text-text-primary">{price} <span className="text-lg font-medium">{t('dzd_month')}</span></p>

            <ul className="space-y-3 text-text-secondary mb-6 flex-grow">
                <li className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-primary"/>
                    <span>{features.books} {t('books_per_rental')}</span>
                </li>
                <li className="flex items-center gap-3">
                     <CheckIcon className="w-5 h-5 text-primary"/>
                    <span>{t('rental_duration')}: {features.duration} {t('days')}</span>
                </li>
                <li className="flex items-center gap-3">
                     <CheckIcon className="w-5 h-5 text-primary"/>
                    <span>{features.renewals} {t('renewals')}</span>
                </li>
                <li className="flex items-center gap-3">
                    {features.reservations ? <CheckIcon className="w-5 h-5 text-primary"/> : <XIcon className="w-5 h-5 text-gray-400"/>}
                    <span>{t('reservations')}</span>
                </li>
                <li className="flex items-center gap-3">
                    {features.rareBooks ? <CheckIcon className="w-5 h-5 text-primary"/> : <XIcon className="w-5 h-5 text-gray-400"/>}
                    <span>{t('rare_books_access')}</span>
                </li>
            </ul>

            <button
                onClick={handleSubscribe}
                disabled={isCurrent}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${isCurrent ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-danger text-white hover:bg-opacity-90'}`}
            >
                {isCurrent ? t('current_plan') : t('subscribe_now')}
            </button>
        </div>
    );
};

export default SubscriptionPlan;