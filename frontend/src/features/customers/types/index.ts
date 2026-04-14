export interface Customer {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  gstNumber?: string;
  type: 'B2B' | 'B2C';
  creditLimit: number;
  totalDue: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CustomerInput extends Omit<Customer, '_id' | 'totalDue' | 'createdAt'> {}