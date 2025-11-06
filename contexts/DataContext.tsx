import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Book, Category, Rack, User, Rental, Subscription } from '../types';

// MOCK DATA
const MOCK_CATEGORIES: Category[] = [
    { id: '1', name_fr: 'Fiction', name_ar: 'خيال' },
    { id: '2', name_fr: 'Science', name_ar: 'علوم' },
    { id: '3', name_fr: 'Histoire', name_ar: 'تاريخ' },
    { id: '4', name_fr: 'Poésie', name_ar: 'شعر' },
];

const MOCK_RACKS_INIT: Rack[] = [
    { id: 'r1', location: 'A1-01' },
    { id: 'r2', location: 'A1-02' },
    { id: 'r3', location: 'B2-05' },
    { id: 'r4', location: 'C1-03' },
];

const MOCK_BOOKS: Book[] = [
    { id: '1', title_fr: 'L\'Étranger', title_ar: 'الغريب', author_fr: 'Albert Camus', author_ar: 'ألبير كامو', description_fr: 'Un classique de la littérature française.', description_ar: 'من كلاسيكيات الأدب الفرنسي.', coverImage: 'https://picsum.photos/id/10/300/450', category: '1', rack: 'r1', location: 'A1-01-1', quantity: 5, available: 2, rating: 4.5, reviews: 120, isRare: false },
    { id: '2', title_fr: 'Nedjma', title_ar: 'نجمة', author_fr: 'Kateb Yacine', author_ar: 'كاتب ياسين', description_fr: 'Un roman fondamental de la littérature algérienne.', description_ar: 'رواية أساسية في الأدب الجزائري.', coverImage: 'https://picsum.photos/id/21/300/450', category: '1', rack: 'r2', location: 'A1-02-3', quantity: 3, available: 0, rating: 4.8, reviews: 90, isRare: true },
    { id: '3', title_fr: 'Une Brève Histoire du Temps', title_ar: 'تاريخ موجز للزمن', author_fr: 'Stephen Hawking', author_ar: 'ستيفن هوكينغ', description_fr: 'Du Big Bang aux trous noirs.', description_ar: 'من الانفجار العظيم إلى الثقوب السوداء.', coverImage: 'https://picsum.photos/id/33/300/450', category: '2', rack: 'r3', location: 'B2-05-2', quantity: 7, available: 7, rating: 4.7, reviews: 200, isRare: false },
    { id: '4', title_fr: 'L\'Histoire de l\'Algérie', title_ar: 'تاريخ الجزائر', author_fr: 'Mahfoud Kaddache', author_ar: 'محفوظ قداش', description_fr: 'Une vue d\'ensemble complète.', description_ar: 'نظرة شاملة.', coverImage: 'https://picsum.photos/id/45/300/450', category: '3', rack: 'r1', location: 'A1-01-2', quantity: 4, available: 2, rating: 4.6, reviews: 50, isRare: false },
    { id: '5', title_fr: 'Les Poètes de la Révolution', title_ar: 'شعراء الثورة', author_fr: 'Jean Sénac', author_ar: 'جان سيناك', description_fr: 'Anthologie de poètes algériens de graphie française.', description_ar: 'مختارات من الشعراء الجزائريين باللغة الفرنسية.', coverImage: 'https://picsum.photos/id/52/300/450', category: '4', rack: 'r4', location: 'C1-03-1', quantity: 6, available: 6, rating: 4.9, reviews: 35, isRare: false },
    { id: '6', title_fr: 'Cosmos', title_ar: 'الكون', author_fr: 'Carl Sagan', author_ar: 'كارل ساجان', description_fr: 'Un voyage personnel à travers l\'univers.', description_ar: 'رحلة شخصية عبر الكون.', coverImage: 'https://picsum.photos/id/61/300/450', category: '2', rack: 'r3', location: 'B2-05-3', quantity: 5, available: 1, rating: 4.8, reviews: 250, isRare: false },
    { id: '7', title_fr: 'L\'Algérie des Origines', title_ar: 'الجزائر من الأصول', author_fr: 'Gilbert Meynier', author_ar: 'جيلبرت ماينير', description_fr: 'De la préhistoire à l\'avènement de l\'Islam.', description_ar: 'من عصور ما قبل التاريخ إلى ظهور الإسلام.', coverImage: 'https://picsum.photos/id/78/300/450', category: '3', rack: 'r1', location: 'A1-01-3', quantity: 3, available: 0, rating: 4.7, reviews: 40, isRare: true },
    { id: '8', title_fr: 'Le Petit Prince', title_ar: 'الأمير الصغير', author_fr: 'Antoine de Saint-Exupéry', author_ar: 'أنطوان دو سانت إكزوبيري', description_fr: 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.', description_ar: 'حكاية شعرية وفلسفية تحت ستار قصة أطفال.', coverImage: 'https://picsum.photos/id/84/300/450', category: '1', rack: 'r2', location: 'A1-02-1', quantity: 10, available: 5, rating: 4.9, reviews: 500, isRare: false },
];

const MOCK_USERS_INIT: User[] = [
    { id: '1', name: 'Ilyes Admin', email: 'admin@library.dz', nationalId: '123456789012345678', phone: '0512345678', role: 'admin', createdAt: new Date('2023-01-15'), cardStatus: 'none' },
    { id: '2', name: 'Fatima User', email: 'user@library.dz', nationalId: '098765432109876543', phone: '0612345678', role: 'user', createdAt: new Date('2023-05-20'), subscription: {id: 'sub1', userId: '2', plan: 'standard', status: 'active', startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), autoRenew: true }, cardStatus: 'active' },
    { id: '3', name: 'Karim NoSub', email: 'karim@library.dz', nationalId: '112233445566778899', phone: '0712345678', role: 'user', createdAt: new Date('2023-08-10'), cardStatus: 'none'},
    { id: '4', name: 'Amina Suspended', email: 'amina@library.dz', nationalId: '223344556677889900', phone: '0798765432', role: 'user', createdAt: new Date('2023-09-01'), subscription: {id: 'sub2', userId: '4', plan: 'basic', status: 'active', startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), autoRenew: false }, cardStatus: 'suspended' },
    { id: '5', name: 'Samir NewSub', email: 'samir@library.dz', nationalId: '334455667788990011', phone: '0611223344', role: 'user', createdAt: new Date('2024-01-05'), subscription: {id: 'sub3', userId: '5', plan: 'premium', status: 'active', startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), autoRenew: true }, cardStatus: 'none' },
    { id: '6', name: 'Leila Basic', email: 'leila@library.dz', nationalId: '445566778899001122', phone: '0555667788', role: 'user', createdAt: new Date('2024-02-10'), subscription: {id: 'sub4', userId: '6', plan: 'basic', status: 'active', startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), autoRenew: true }, cardStatus: 'active' },
    { id: '7', name: 'Yacine Premium', email: 'yacine@library.dz', nationalId: '556677889900112233', phone: '0666778899', role: 'user', createdAt: new Date('2024-03-15'), subscription: {id: 'sub5', userId: '7', plan: 'premium', status: 'active', startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), autoRenew: true }, cardStatus: 'active' },
];

const MOCK_RENTALS: Rental[] = [
    // Active Rentals
    { id: '1', userId: '2', bookId: '1', requestDate: new Date(), rentalDate: new Date(), dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), status: 'rented', renewalsLeft: 1 },
    { id: '2', userId: '7', bookId: '2', requestDate: new Date(), rentalDate: new Date(), dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'rented', renewalsLeft: 1 }, // Rare book for premium user
    { id: '3', userId: '6', bookId: '8', requestDate: new Date(), rentalDate: new Date(), dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'rented', renewalsLeft: 1 },

    // Overdue Rental
    { id: '4', userId: '4', bookId: '1', requestDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), rentalDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), status: 'rented', renewalsLeft: 0 },

    // Pending Requests
    { id: '5', userId: '2', bookId: '4', requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'pending', dueDate: new Date(), renewalsLeft: 1 },
    { id: '6', userId: '7', bookId: '7', requestDate: new Date(), status: 'pending', dueDate: new Date(), renewalsLeft: 2 }, // Pending rare book
    
    // Another Active Rental
    { id: '7', userId: '2', bookId: '6', requestDate: new Date(), rentalDate: new Date(), dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), status: 'rented', renewalsLeft: 2 },

    // Another Overdue Rental
    { id: '8', userId: '6', bookId: '4', requestDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), rentalDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'rented', renewalsLeft: 0 },
];

const MOCK_SUBSCRIPTIONS: Subscription[] = MOCK_USERS_INIT.filter(u => u.subscription).map(u => u.subscription!);


interface DataContextType {
    books: Book[];
    categories: Category[];
    racks: Rack[];
    users: User[];
    rentals: Rental[];
    subscriptions: Subscription[];
    findBook: (id: string) => Book | undefined;
    findUser: (id: string) => User | undefined;
    findCategory: (id: string) => Category | undefined;
    addBook: (book: Omit<Book, 'id' | 'available' | 'rating' | 'reviews'>) => void;
    updateBook: (book: Book) => void;
    deleteBook: (id: string) => void;
    approveRental: (rentalId: string) => void;
    rejectRental: (rentalId: string) => void;
    returnRental: (rentalId: string) => void;
    generateCard: (userId: string) => User | undefined;
    suspendCard: (userId: string) => User | undefined;
    activateCard: (userId: string) => User | undefined;
    addRack: (location: string) => void;
    deleteRack: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
    const [categories] = useState<Category[]>(MOCK_CATEGORIES);
    const [racks, setRacks] = useState<Rack[]>(MOCK_RACKS_INIT);
    const [users, setUsers] = useState<User[]>(MOCK_USERS_INIT);
    const [rentals, setRentals] = useState<Rental[]>(MOCK_RENTALS);
    const [subscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);

    const findBook = (id: string) => books.find(b => b.id === id);
    const findUser = (id: string) => users.find(u => u.id === id);
    const findCategory = (id: string) => categories.find(c => c.id === id);
    
    const addBook = (book: Omit<Book, 'id' | 'available' | 'rating' | 'reviews'>) => {
        const newId = (Math.max(...books.map(b => parseInt(b.id)), 0) + 1).toString();
        const newBook: Book = { 
            ...book, 
            id: newId,
            available: book.quantity,
            rating: 0,
            reviews: 0,
        };
        setBooks(prev => [newBook, ...prev]);
    };

    const updateBook = (updatedBook: Book) => {
        setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
    };

    const deleteBook = (id: string) => {
        setBooks(prev => prev.filter(b => b.id !== id));
    };

    const approveRental = (rentalId: string) => {
        setRentals(prev => prev.map(r => r.id === rentalId ? { ...r, status: 'approved', rentalDate: new Date(), dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) } : r));
        // In a real app, you'd also decrease book availability
    };

    const rejectRental = (rentalId: string) => {
         setRentals(prev => prev.map(r => r.id === rentalId ? { ...r, status: 'rejected' } : r));
    };
    
    const returnRental = (rentalId: string) => {
        const rental = rentals.find(r => r.id === rentalId);
        if(rental) {
            setRentals(prev => prev.map(r => r.id === rentalId ? { ...r, status: 'returned', returnDate: new Date() } : r));
            // In a real app, you'd increase book availability
            setBooks(prev => prev.map(b => b.id === rental.bookId ? {...b, available: b.available + 1} : b));
        }
    };

    const generateCard = (userId: string): User | undefined => {
        let updatedUser: User | undefined;
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, cardStatus: 'active' };
                return updatedUser;
            }
            return u;
        }));
        return updatedUser;
    };

    const suspendCard = (userId: string): User | undefined => {
        let updatedUser: User | undefined;
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, cardStatus: 'suspended' };
                return updatedUser;
            }
            return u;
        }));
        return updatedUser;
    };

    const activateCard = (userId: string): User | undefined => {
        let updatedUser: User | undefined;
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, cardStatus: 'active' };
                return updatedUser;
            }
            return u;
        }));
        return updatedUser;
    };
    
    const addRack = (location: string) => {
        const newRack: Rack = {
            id: `r${Date.now()}`,
            location,
        };
        setRacks(prev => [newRack, ...prev]);
    };

    const deleteRack = (id: string) => {
        // In a real app, you'd check if any books are currently assigned to this rack
        setRacks(prev => prev.filter(r => r.id !== id));
    };


    return (
        <DataContext.Provider value={{ 
            books, categories, racks, users, rentals, subscriptions, 
            findBook, findUser, findCategory, 
            addBook, updateBook, deleteBook, 
            approveRental, rejectRental, returnRental,
            generateCard, suspendCard, activateCard,
            addRack, deleteRack
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};