export interface Supplier {
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
  paymentTerms?: string;
  totalDue: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface SupplierInput extends Omit<Supplier, '_id' | 'totalDue' | 'createdAt'> {}