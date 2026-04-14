export interface Product {
  _id: string;
  id: string; // Map _id to id if needed, or keep _id
  orgId: string;
  shopId: string | null;
  categoryId: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  brand?: string;
  description?: string;
  images: string[];

  unitType: 'weight' | 'volume' | 'length' | 'count';
  baseUnitSymbol: string;
  purchaseUnitSymbol: string;
  saleUnitSymbol: string;
  customConversions: {
    unitSymbol: string;
    toBaseMultiplier: number;
    _id?: string;
  }[];

  purchasePrice: number;
  salePrice: number;
  mrp?: number;
  taxRate?: number;
  margin?: number;

  minStock: number;
  maxStock?: number;
  reorderLevel?: number;

  hasVariants: boolean;
  batchTracking: boolean;
  expiryTracking: boolean;
  supplierId?: string;

  status: 'active' | 'inactive' | 'discontinued';
  tags: string[];
  customFields?: Record<string, any>;
  
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  _id: string;
  id: string;
  orgId: string;
  productId: string;
  variantName: string;
  sku: string;
  barcode?: string;
  unitSymbol: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  mrp?: number;
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  categoryId: string;
  name: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  description?: string;
  unitType: 'weight' | 'volume' | 'length' | 'count';
  baseUnitSymbol: string;
  purchaseUnitSymbol: string;
  saleUnitSymbol: string;
  purchasePrice: number;
  salePrice: number;
  minStock?: number;
  maxStock?: number;
  reorderLevel?: number;
  hasVariants?: boolean;
  batchTracking?: boolean;
  expiryTracking?: boolean;
  status?: 'active' | 'inactive' | 'discontinued';
  customConversions?: {
    unitSymbol: string;
    toBaseMultiplier: number;
  }[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedProductResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
