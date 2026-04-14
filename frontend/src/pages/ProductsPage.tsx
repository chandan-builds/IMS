import React, { useState } from 'react';
import { ProductList } from '../features/products/components/ProductList';
import { ProductForm } from '../features/products/components/ProductForm';
import { Modal } from '../components/ui/Modal';
import { useProductViewModel } from '../features/products/hooks/useProductViewModel';
import type { Product } from '../features/products/types/product.types';
import { useProductFilters } from '../features/products/hooks/useProductFilters';

export const ProductsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  // We just need the mutations here, the list fetches on its own
  const { filters } = useProductFilters();
  const { createProduct, updateProduct, isCreating, isUpdating } = useProductViewModel(filters);

  const handleCreateClick = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data });
      } else {
        await createProduct(data);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Failed to save product', error);
      // Error handling is usually done in the view model or form, but we can catch it here
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Products</h1>
          <p className="text-[var(--color-text-secondary)]">Manage your product inventory and variants</p>
        </div>
      </div>

      <div className="flex-1 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-4 shadow-sm overflow-hidden">
        <ProductList 
          onCreateClick={handleCreateClick} 
          onEditClick={handleEditClick} 
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <ProductForm 
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isCreating || isUpdating}
        />
      </Modal>
    </div>
  );
};
