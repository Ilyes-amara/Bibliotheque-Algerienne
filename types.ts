export interface User {
    id: string;
    name: string;
    email: string;
    nationalId: string;
    phone: string;
    role: 'user' | 'admin';
    subscription?: Subscription;
    createdAt: Date;
    cardStatus: 'active' | 'suspended' | 'none';
}

export interface Subscription {
    id: string;
    userId: string;
    plan: 'basic' | 'standard' | 'premium';
    status: 'active' | 'inactive' | 'cancelled';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
}

export interface Book {
    id: string;
    title_fr: string;
    title_ar: string;
    author_fr: string;
    author_ar: string;
    description_fr: string;
    description_ar: string;
    coverImage: string;
    category: string;
    rack: string;
    location?: string; // Add location as an optional property
    quantity: number;
    available: number;
    rating: number;
    reviews: number;
    isRare: boolean;
}

export interface Rental {
    id: string;
    userId: string;
    bookId: string;
    requestDate: Date;
    rentalDate?: Date;
    dueDate: Date;
    returnDate?: Date;
    status: 'pending' | 'approved' | 'rejected' | 'rented' | 'returned' | 'overdue';
    renewalsLeft: number;
}

export interface Category {
    id: string;
    name_fr: string;
    name_ar: string;
}

export interface Rack {
    id: string;
    location: string;
}