import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';
import BookForm from '../components/BookForm';
import { Book, User } from '../types';
import toast from 'react-hot-toast';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { users, books, rentals, deleteBook, addBook, updateBook, approveRental, rejectRental, returnRental, findBook, findUser, suspendCard, activateCard, racks, addRack, deleteRack } = useData();
    const [activeTab, setActiveTab] = useState('statistics');
    const [activeRentalTab, setActiveRentalTab] = useState('pending');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    const [newRackLocation, setNewRackLocation] = useState('');

    const handleOpenModal = (book: Book | null = null) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBook(null);
    };
    const handleDeleteBook = (id: string) => {
        if (window.confirm(t('are_you_sure_delete'))) {
            deleteBook(id);
            toast.success(t('book_deleted_success'));
        }
    };
    const handleFormSubmit = (bookData: Omit<Book, 'id'>) => {
        if (editingBook) {
            updateBook({ ...bookData, id: editingBook.id });
        } else {
            addBook(bookData);
        }
        toast.success(t('book_saved_success'));
        handleCloseModal();
    };

    const handleApprove = (id: string) => { approveRental(id); toast.success(t('rental_approved_success')); };
    const handleReject = (id: string) => { rejectRental(id); toast.success(t('rental_rejected_success')); };
    const handleReturn = (id: string) => { returnRental(id); toast.success(t('book_returned_success')); };

    const handleSuspendCard = (userId: string) => { suspendCard(userId); toast.success(t('card_suspended_success')); };
    const handleActivateCard = (userId: string) => { activateCard(userId); toast.success(t('card_activated_success')); };

    const handleAddRack = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRackLocation.trim()) {
            addRack(newRackLocation.trim());
            setNewRackLocation('');
            toast.success(t('rack_saved_success'));
        }
    };

    const handleDeleteRack = (id: string) => {
        if (window.confirm(t('are_you_sure_delete_rack'))) {
            deleteRack(id);
            toast.success(t('rack_deleted_success'));
        }
    };

    const renderStatistics = () => (
        <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('total_users')} value={users.length} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
                <StatCard title={t('total_books')} value={books.length} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>} />
                <StatCard title={t('active_rentals')} value={rentals.filter(r => r.status === 'rented').length} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 9 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>} />
                <StatCard title={t('monthly_revenue')} value={` ${6000} DZD`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
            </div>
            {/* Charts are removed due to compatibility issues with React 19 */}
        </div>
    );

    const renderBookManagement = () => (
        <div className="bg-surface p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-primary">{t('book_management')}</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus transition-colors">
                    {t('add_new_book')}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 font-semibold text-text-secondary">{t('title_fr')}</th>
                            <th className="p-3 font-semibold text-text-secondary">{t('author_fr')}</th>
                            <th className="p-3 font-semibold text-text-secondary">{t('quantity')}</th>
                            <th className="p-3 font-semibold text-text-secondary">{t('available')}</th>
                            <th className="p-3 font-semibold text-center text-text-secondary">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-text-primary">{book.title_fr}</td>
                                <td className="p-3 text-text-secondary">{book.author_fr}</td>
                                <td className="p-3 text-center text-text-secondary">{book.quantity}</td>
                                <td className="p-3 text-center text-text-secondary">{book.available}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => handleOpenModal(book)} className="text-blue-600 hover:underline mx-2">{t('edit')}</button>
                                    <button onClick={() => handleDeleteBook(book.id)} className="text-danger hover:underline mx-2">{t('delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const renderRentalManagement = () => {
        const pending = rentals.filter(r => r.status === 'pending');
        const active = rentals.filter(r => r.status === 'rented' && new Date(r.dueDate) >= new Date());
        const overdue = rentals.filter(r => r.status === 'rented' && new Date(r.dueDate) < new Date());

        return (
             <div className="bg-surface p-6 rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveRentalTab('pending')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeRentalTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{t('pending_requests')} ({pending.length})</button>
                        <button onClick={() => setActiveRentalTab('active')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeRentalTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{t('active_rentals')} ({active.length})</button>
                        <button onClick={() => setActiveRentalTab('overdue')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeRentalTab === 'overdue' ? 'border-danger text-danger' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{t('overdue_rentals')} ({overdue.length})</button>
                    </nav>
                </div>
                <div className="mt-6 overflow-x-auto">
                    {activeRentalTab === 'pending' && (
                        <RentalTable data={pending} columns={['user', 'book', 'requestDate']} actions={{ approve: handleApprove, reject: handleReject }} />
                    )}
                     {activeRentalTab === 'active' && (
                        <RentalTable data={active} columns={['user', 'book', 'rental_date', 'due_date']} actions={{ return: handleReturn }} />
                    )}
                     {activeRentalTab === 'overdue' && (
                        <RentalTable data={overdue} columns={['user', 'book', 'due_date', 'contact']} actions={{ return: handleReturn }} />
                    )}
                </div>
            </div>
        );
    };

    const renderUserManagement = () => {
        const regularUsers = users.filter(u => u.role === 'user');
        return (
            <div className="bg-surface p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">{t('user_management')}</h2>
                <div className="overflow-x-auto">
                    {regularUsers.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 font-semibold text-text-secondary">{t('user')}</th>
                                    <th className="p-3 font-semibold text-text-secondary">{t('joined_on')}</th>
                                    <th className="p-3 font-semibold text-text-secondary">{t('subscription_plan')}</th>
                                    <th className="p-3 font-semibold text-text-secondary">{t('card_status')}</th>
                                    <th className="p-3 font-semibold text-center text-text-secondary">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {regularUsers.map(user => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <p className="font-bold text-text-primary">{user.name}</p>
                                            <p className="text-sm text-text-secondary">{user.email}</p>
                                        </td>
                                        <td className="p-3 text-text-secondary">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-text-secondary capitalize">
                                            {user.subscription ? t(user.subscription.plan + '_plan') : 'N/A'}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.cardStatus === 'active' ? 'bg-green-100 text-green-800' :
                                                user.cardStatus === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {t(user.cardStatus)}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            {user.cardStatus === 'active' ? (
                                                <button onClick={() => handleSuspendCard(user.id)} className="text-danger hover:underline">{t('suspend')}</button>
                                            ) : user.cardStatus === 'suspended' ? (
                                                <button onClick={() => handleActivateCard(user.id)} className="text-green-600 hover:underline">{t('activate')}</button>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center py-10 text-text-secondary">{t('no_users_found')}</p>
                    )}
                </div>
            </div>
        );
    };

    const renderRackManagement = () => (
        <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">{t('rack_management')}</h2>
            <form onSubmit={handleAddRack} className="flex items-center gap-4 mb-6 pb-6 border-b">
                <input
                    type="text"
                    value={newRackLocation}
                    onChange={(e) => setNewRackLocation(e.target.value)}
                    placeholder={t('rack_location')}
                    className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
                <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus transition-colors">
                    {t('add_new_rack')}
                </button>
            </form>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 font-semibold text-text-secondary">{t('location')}</th>
                            <th className="p-3 font-semibold text-center text-text-secondary">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {racks.map(rack => (
                            <tr key={rack.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-mono text-text-primary">{rack.location}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => handleDeleteRack(rack.id)} className="text-danger hover:underline">{t('delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const RentalTable = ({ data, columns, actions }: { data: any[], columns: string[], actions?: any }) => {
        if (data.length === 0) {
            let message = '';
            if (activeRentalTab === 'pending') message = t('no_pending_requests');
            else if (activeRentalTab === 'active') message = t('no_active_rentals');
            else if (activeRentalTab === 'overdue') message = t('no_overdue_rentals');
            return <div className="text-center py-10 text-text-secondary">{message}</div>;
        }

        const getDaysOverdue = (dueDate: Date) => {
            const diff = new Date().getTime() - new Date(dueDate).getTime();
            return Math.floor(diff / (1000 * 3600 * 24));
        };
        
        return (
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        {columns.map(col => <th key={col} className="p-3 font-semibold text-text-secondary">{t(col)}</th>)}
                        {actions && <th className="p-3 font-semibold text-center text-text-secondary">{t('actions')}</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map(rental => {
                        const user = findUser(rental.userId);
                        const book = findBook(rental.bookId);
                        return (
                            <tr key={rental.id} className="border-b hover:bg-gray-50">
                                {columns.map(col => (
                                    <td key={col} className="p-3 text-text-secondary">
                                        {col === 'user' && user?.name}
                                        {col === 'book' && (language === 'ar' ? book?.title_ar : book?.title_fr)}
                                        {col === 'requestDate' && new Date(rental.requestDate).toLocaleDateString()}
                                        {col === 'rental_date' && rental.rentalDate && new Date(rental.rentalDate).toLocaleDateString()}
                                        {col === 'due_date' && (
                                            <span className={getDaysOverdue(rental.dueDate) > 0 ? 'text-danger font-bold' : ''}>
                                                {new Date(rental.dueDate).toLocaleDateString()}
                                                {getDaysOverdue(rental.dueDate) > 0 && ` (${t('overdue_by')} ${getDaysOverdue(rental.dueDate)} ${t('days')})`}
                                            </span>
                                        )}
                                        {col === 'contact' && user && `${user.email}, ${user.phone}`}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="p-3 text-center">
                                        {actions.approve && <button onClick={() => actions.approve(rental.id)} className="text-green-600 hover:underline mx-1">{t('approve')}</button>}
                                        {actions.reject && <button onClick={() => actions.reject(rental.id)} className="text-danger hover:underline mx-1">{t('reject')}</button>}
                                        {actions.return && <button onClick={() => actions.return(rental.id)} className="text-blue-600 hover:underline mx-1">{t('mark_as_returned')}</button>}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">{t('admin_dashboard')}</h1>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('statistics')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'statistics' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {t('statistics')}
                    </button>
                    <button onClick={() => setActiveTab('books')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'books' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {t('book_management')}
                    </button>
                    <button onClick={() => setActiveTab('rentals')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'rentals' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {t('rental_management')}
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {t('user_management')}
                    </button>
                     <button onClick={() => setActiveTab('racks')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'racks' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {t('rack_management')}
                    </button>
                </nav>
            </div>

            {activeTab === 'statistics' && renderStatistics()}
            {activeTab === 'books' && renderBookManagement()}
            {activeTab === 'rentals' && renderRentalManagement()}
            {activeTab === 'users' && renderUserManagement()}
            {activeTab === 'racks' && renderRackManagement()}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingBook ? t('edit_book') : t('add_new_book')}>
                <BookForm 
                    onSubmit={handleFormSubmit}
                    initialData={editingBook}
                />
            </Modal>
        </div>
    );
};

export default AdminDashboardPage;