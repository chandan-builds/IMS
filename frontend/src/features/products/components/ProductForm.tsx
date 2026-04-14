import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import type { SelectOption } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { BarcodeScanner } from '../../../components/ui/BarcodeScanner';
import { Camera } from 'lucide-react';
import type { Product, CreateProductDto } from '../types/product.types';
import { useCategoryViewModel } from '../../categories/hooks/useCategoryViewModel';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const UNIT_TYPES: SelectOption[] = [
  { label: 'Weight', value: 'weight' },
  { label: 'Volume', value: 'volume' },
  { label: 'Length', value: 'length' },
  { label: 'Count', value: 'count' },
];

const STATUS_OPTIONS: SelectOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Discontinued', value: 'discontinued' },
];

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { categories } = useCategoryViewModel();
  const [showScanner, setShowScanner] = useState(false);
  
  const categoryOptions = categories.map(c => ({
    label: c.name,
    value: c.id || (c as any)._id,
  }));

  const [formData, setFormData] = useState<Partial<CreateProductDto> & { barcode?: string, batchTracking?: boolean, expiryTracking?: boolean }>({
    name: '',
    sku: '',
    barcode: '',
    categoryId: '',
    unitType: 'count',
    baseUnitSymbol: 'pcs',
    purchaseUnitSymbol: 'pcs',
    saleUnitSymbol: 'pcs',
    purchasePrice: 0,
    salePrice: 0,
    minStock: 0,
    status: 'active',
    batchTracking: false,
    expiryTracking: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        sku: initialData.sku,
        barcode: initialData.barcode || '',
        categoryId: typeof initialData.categoryId === 'object' ? (initialData.categoryId as any)._id : initialData.categoryId,
        unitType: initialData.unitType,
        baseUnitSymbol: initialData.baseUnitSymbol,
        purchaseUnitSymbol: initialData.purchaseUnitSymbol,
        saleUnitSymbol: initialData.saleUnitSymbol,
        purchasePrice: initialData.purchasePrice,
        salePrice: initialData.salePrice,
        minStock: initialData.minStock,
        status: initialData.status,
        batchTracking: initialData.batchTracking || false,
        expiryTracking: initialData.expiryTracking || false,
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
            {initialData ? 'Edit Product' : 'Create Product'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Product Name" 
              required 
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input 
                  label="Barcode" 
                  value={formData.barcode || ''}
                  onChange={(e) => handleChange('barcode', e.target.value)}
                  placeholder="Scan or type barcode"
                />
              </div>
              <button 
                type="button" 
                onClick={() => setShowScanner(true)}
                className="mb-1 p-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
                title="Scan Barcode"
              >
                <Camera size={20} />
              </button>
            </div>
            
            <Input 
              label="SKU" 
              value={formData.sku || ''}
              onChange={(e) => handleChange('sku', e.target.value)}
              placeholder="Leave empty to auto-generate"
            />
            
            <Select 
              label="Category" 
              options={categoryOptions}
              value={formData.categoryId || ''}
              onChange={(val) => handleChange('categoryId', val)}
              required
            />
            
            <Select 
              label="Status" 
              options={STATUS_OPTIONS}
              value={formData.status || 'active'}
              onChange={(val) => handleChange('status', val)}
              required
            />

            <Select 
              label="Unit Type" 
              options={UNIT_TYPES}
              value={formData.unitType || 'count'}
              onChange={(val) => handleChange('unitType', val)}
              required
            />
            <Input 
              label="Base Unit Symbol (e.g. g, ml, pcs)" 
              required 
              value={formData.baseUnitSymbol || ''}
              onChange={(e) => handleChange('baseUnitSymbol', e.target.value)}
            />

            <Input 
              label="Purchase Price" 
              type="number" 
              step="0.01"
              required 
              value={formData.purchasePrice || 0}
              onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value))}
            />
            <Input 
              label="Sale Price" 
              type="number" 
              step="0.01"
              required 
              value={formData.salePrice || 0}
              onChange={(e) => handleChange('salePrice', parseFloat(e.target.value))}
            />

            <Input 
              label="Min Stock Alert" 
              type="number" 
              required 
              value={formData.minStock || 0}
              onChange={(e) => handleChange('minStock', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Advanced Options */}
          <div className="pt-4 border-t border-[var(--color-border)]">
            <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Advanced Tracking</h4>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.batchTracking || false}
                  onChange={(e) => handleChange('batchTracking', e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                Enable Batch Tracking
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.expiryTracking || false}
                  onChange={(e) => handleChange('expiryTracking', e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                Enable Expiry Tracking
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="default" loading={isLoading}>
              {initialData ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </form>
      </Card>
      
      {showScanner && (
        <BarcodeScanner 
          onScan={(decodedText) => {
            handleChange('barcode', decodedText);
            setShowScanner(false);
          }} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </>
  );
};
