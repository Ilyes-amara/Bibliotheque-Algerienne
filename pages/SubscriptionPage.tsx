import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import SubscriptionPlan from '../components/SubscriptionPlan';

const SubscriptionPage: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    
    const currentPlan = user?.subscription?.plan;

    const plans = [
        {
            plan: 'basic' as const,
            price: 500,
            features: { books: 3, duration: 14, renewals: 1, reservations: false, rareBooks: false },
        },
        {
            plan: 'standard' as const,
            price: 1000,
            features: { books: 6, duration: 21, renewals: 2, reservations: true, rareBooks: false },
        },
        {
            plan: 'premium' as const,
            price: 2000,
            features: { books: 12, duration: 30, renewals: 2, reservations: true, rareBooks: true },
        },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-text-primary">{t('choose_plan')}</h1>
                <p className="mt-2 text-lg text-text-secondary">{t('subscription_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((p, index) => (
                    <SubscriptionPlan 
                        key={index}
                        plan={p.plan}
                        price={p.price}
                        features={p.features}
                        isCurrent={currentPlan === p.plan}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;