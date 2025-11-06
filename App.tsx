import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentPage from './pages/PaymentPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

const PrivateRoute: React.FC<{ children: React.ReactElement; roles?: string[] }> = ({ children, roles }) => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AuthProvider>
                <DataProvider>
                    <HashRouter>
                        <div className="flex flex-col min-h-screen bg-background text-text-primary">
                            <Toaster position="top-center" reverseOrder={false} />
                            <Header />
                            <main className="flex-grow container mx-auto px-4 py-8">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/books" element={<BooksPage />} />
                                    <Route path="/books/:id" element={<BookDetailPage />} />
                                    <Route path="/subscribe" element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
                                    <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
                                    <Route path="/dashboard" element={<PrivateRoute><UserDashboardPage /></PrivateRoute>} />
                                    <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboardPage /></PrivateRoute>} />
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    </HashRouter>
                </DataProvider>
            </AuthProvider>
        </LanguageProvider>
    );
};

export default App;