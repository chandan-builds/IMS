import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useCategoryViewModel } from '../hooks/useCategoryViewModel';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';
import { Table } from '../../../components/ui/Table';
import type { Column } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const CategoryManager: React.FC = () => {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategoryViewModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateCategoryDto>({
    defaultValues: {
      name: '',
      description: '',
      parentId: '',
      isActive: true,
    }
  });

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      reset({
        name: category.name,
        description: category.description || '',
        parentId: category.parentId || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        description: '',
        parentId: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const onSubmit = async (data: CreateCategoryDto) => {
    try {
      const payload = {
        ...data,
        parentId: data.parentId === '' ? null : data.parentId,
      };

      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, data: payload as UpdateCategoryDto });
      } else {
        await createCategory(payload);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const parentOptions = categories.map(c => ({ label: c.name, value: c.id }));
  // Add a "None" option
  parentOptions.unshift({ label: 'None (Root Category)', value: '' });

  const columns: Column<Category>[] = [
    { header: 'Name', accessor: 'name', sortable: true },
    { 
      header: 'Parent', 
      accessor: (row) => {
        if (!row.parentId) return '-';
        const parent = categories.find(c => c.id === row.parentId);
        return parent ? parent.name : row.parentId;
      }
    },
    { 
      header: 'Status', 
      accessor: (row) => row.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="default">Inactive</Badge> 
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openModal(row); }}>
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); setCategoryToDelete(row); }}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Categories</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Manage product categories and subcategories.</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-[var(--color-text-muted)]">Loading categories...</div>
      ) : (
        <Table data={categories} columns={columns} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Category Name" 
            placeholder="e.g. Electronics" 
            {...register('name', { required: 'Name is required' })} 
            error={errors.name?.message} 
          />
          
          <Input 
            label="Description" 
            placeholder="Optional description" 
            {...register('description')} 
          />

          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                label="Parent Category"
                options={parentOptions.filter(opt => opt.value !== editingCategory?.id)} // Prevent self-parenting
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.parentId?.message}
              />
            )}
          />

          <div className="flex items-center gap-2 pt-2 pb-2">
            <input 
              type="checkbox" 
              id="isActive" 
              {...register('isActive')} 
              className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-text-primary)]">
              Active (Visible in menus)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--color-border)]">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="default" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!categoryToDelete}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete ${categoryToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};
