import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { FaCreditCard, FaMobileAlt, FaArrowRight, FaCheckCircle, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ECard from '../components/ECard';
import toast from 'react-hot-toast';

type PaymentMethod = 'poste' | 'baridi' | null;

const PaymentPage: React.FC = () => {
    const { t } = useLanguage();
    const { user, updateUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showECard, setShowECard] = useState(false);
    const eCardRef = useRef<HTMLDivElement>(null);
    
    // Get plan from location state or redirect
    const plan = location.state?.plan;
    if (!plan) {
        navigate('/subscribe');
        return null;
    }

    const planDetails = {
        basic: { name: 'Basic', price: 500 },
        standard: { name: 'Standard', price: 1000 },
        premium: { name: 'Premium', price: 2000 }
    }[plan];

    const handlePayment = async () => {
        if (!selectedMethod || !user) return;
        
        setIsProcessing(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real app, you would integrate with the payment gateway here
            console.log(`Processing ${selectedMethod} payment for ${plan} plan`);
            
            // Update user's subscription and card status
            const newSubscription = {
                id: Math.random().toString(),
                userId: user.id,
                plan,
                status: 'active' as const,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                autoRenew: true
            };
            
            const updatedUser = {
                ...user,
                subscription: newSubscription,
                cardStatus: 'active' as const
            };
            
            // In a real app, you would update the user in your backend here
            // For now, we'll just update the local state
            updateUser(updatedUser);
            
            // Show success and e-card
            setIsProcessing(false);
            setIsSuccess(true);
            setShowECard(true);
            
        } catch (error) {
            console.error('Payment failed:', error);
            setIsProcessing(false);
            // Show error message to user
            toast.error(t('payment_failed'));
        }
    };
    
    const downloadECard = async () => {
        if (!eCardRef.current) return;
        
        try {
            const canvas = await html2canvas(eCardRef.current);
            const link = document.createElement('a');
            link.download = `e-card-${user?.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating e-card:', error);
            toast.error(t('e_card_download_error'));
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-lg mb-8 text-center">
                        <div className="flex justify-center mb-6">
                            <FaCheckCircle className="text-green-500 text-6xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('payment_successful')}!</h2>
                        <p className="text-gray-600 mb-6">{t('subscription_activated')}</p>
                        
                        {showECard && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4">{t('your_e_card')}</h3>
                                <div className="flex justify-center mb-6">
                                    <div className="w-full max-w-md" ref={eCardRef}>
                                        <ECard />
                                    </div>
                                </div>
                                <button
                                    onClick={downloadECard}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaDownload className="mr-2" />
                                    {t('download_e_card')}
                                </button>
                            </div>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                {t('go_to_dashboard')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        {t('complete_your_subscription')}
                    </div>
                    <h1 className="block mt-1 text-2xl font-medium text-gray-900">
                        {planDetails.name} - {planDetails.price} DZD
                    </h1>
                    
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            {t('select_payment_method')}
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <button
                                    onClick={() => setSelectedMethod('poste')}
                                    className={`w-full flex items-center justify-between p-5 border-2 rounded-xl transition-all transform hover:scale-[1.01] ${selectedMethod === 'poste' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}
                                >
                                    <div className="flex items-center">
                                        <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                            <FaCreditCard className="text-blue-600 text-2xl" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900 text-lg">Post</div>
                                            <p className="text-sm text-gray-600">Carte Postale Algérienne</p>
                                            <span className="inline-block mt-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Recommandé</span>
                                        </div>
                                    </div>
                                    {selectedMethod === 'poste' ? 
                                        <FaCheckCircle className="text-blue-500 text-xl" /> :
                                        <FaArrowRight className="text-gray-400" />
                                    }
                                </button>
                                
                                <button
                                    onClick={() => setSelectedMethod('baridi')}
                                    className={`w-full flex items-center justify-between p-5 border-2 rounded-xl transition-all transform hover:scale-[1.01] ${selectedMethod === 'baridi' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'}`}
                                >
                                    <div className="flex items-center">
                                        <div className="p-3 bg-green-100 rounded-xl mr-4">
                                            <FaMobileAlt className="text-green-600 text-2xl" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900 text-lg">Baridi Pay</div>
                                            <p className="text-sm text-gray-600">Paiement par mobile</p>
                                            <span className="inline-block mt-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Rapide et sécurisé</span>
                                        </div>
                                    </div>
                                    {selectedMethod === 'baridi' ? 
                                        <FaCheckCircle className="text-green-500 text-xl" /> :
                                        <FaArrowRight className="text-gray-400" />
                                    }
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-8 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Total à payer :</span>
                                    <span className="text-2xl font-bold text-blue-700">{planDetails.price} DZD</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    {selectedMethod === 'poste' 
                                        ? 'Vous serez redirigé vers le portail de paiement sécurisé de la Poste.'
                                        : selectedMethod === 'baridi' 
                                            ? 'Saisissez votre numéro mobile pour confirmer le paiement.'
                                            : 'Sélectionnez un mode de paiement ci-dessus.'}
                                </div>
                            </div>
                            
                            <button
                                onClick={handlePayment}
                                disabled={!selectedMethod || isProcessing}
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center space-x-3 transition-all shadow-md ${
                                    !selectedMethod || isProcessing 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transform hover:scale-[1.02] active:scale-95'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-base">{t('processing')}...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-base">{t('pay')} {planDetails.price} DZD</span>
                                        <FaArrowRight className="text-lg" />
                                    </>
                                )}
                            </button>
                            
                            <div className="text-center mt-4">
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Paiement 100% sécurisé</span>
                                </div>
                                <button 
                                    onClick={() => navigate('/subscribe')}
                                    className="mt-4 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
