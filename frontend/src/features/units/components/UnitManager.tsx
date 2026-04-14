import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useUnitViewModel } from '../hooks/useUnitViewModel';
import type { Unit, CreateUnitDto, UpdateUnitDto } from '../types/unit.types';
import { Table } from '../../../components/ui/Table';
import type { Column } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const UnitManager: React.FC = () => {
  const { units, isLoading, createUnit, updateUnit, deleteUnit } = useUnitViewModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<CreateUnitDto>({
    defaultValues: {
      name: '',
      symbol: '',
      type: 'count',
      isBaseUnit: true,
      baseUnit: '',
      conversionToBase: 1,
    }
  });

  const isBaseUnit = watch('isBaseUnit');

  const openModal = (unit?: Unit) => {
    if (unit) {
      setEditingUnit(unit);
      reset({
        name: unit.name,
        symbol: unit.symbol,
        type: unit.type,
        isBaseUnit: unit.isBaseUnit,
        baseUnit: unit.baseUnit || '',
        conversionToBase: unit.conversionToBase || 1,
      });
    } else {
      setEditingUnit(null);
      reset({
        name: '',
        symbol: '',
        type: 'count',
        isBaseUnit: true,
        baseUnit: '',
        conversionToBase: 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
  };

  const onSubmit = async (data: CreateUnitDto) => {
    try {
      const payload = {
        ...data,
        conversionToBase: data.isBaseUnit ? 1 : Number(data.conversionToBase),
        baseUnit: data.isBaseUnit ? null : (data.baseUnit || null),
      };

      if (editingUnit) {
        await updateUnit({ id: editingUnit.id, data: payload as UpdateUnitDto });
      } else {
        await createUnit(payload);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save unit:', error);
    }
  };

  const confirmDelete = async () => {
    if (unitToDelete) {
      try {
        await deleteUnit(unitToDelete.id);
        setUnitToDelete(null);
      } catch (error) {
        console.error('Failed to delete unit:', error);
      }
    }
  };

  const columns: Column<Unit>[] = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Symbol', accessor: 'symbol' },
    { header: 'Type', accessor: 'type' },
    { 
      header: 'Base Unit?', 
      accessor: (row) => row.isBaseUnit ? <Badge variant="success">Yes</Badge> : <Badge variant="default">No</Badge> 
    },
    { header: 'Conversion', accessor: (row) => row.isBaseUnit ? '-' : `x ${row.conversionToBase} ${row.baseUnit}` },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openModal(row); }}>
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); setUnitToDelete(row); }}>
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
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Units of Measure</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Manage units for your products and variants.</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus size={16} />
          Add Unit
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-[var(--color-text-muted)]">Loading units...</div>
      ) : (
        <Table data={units} columns={columns} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUnit ? 'Edit Unit' : 'Add Unit'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Unit Name" 
            placeholder="e.g. Kilogram" 
            {...register('name', { required: 'Name is required' })} 
            error={errors.name?.message} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Symbol" 
              placeholder="e.g. kg" 
              {...register('symbol', { required: 'Symbol is required' })} 
              error={errors.symbol?.message} 
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  label="Type"
                  options={[
                    { label: 'Weight', value: 'weight' },
                    { label: 'Volume', value: 'volume' },
                    { label: 'Length', value: 'length' },
                    { label: 'Count', value: 'count' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.type?.message}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-2 pt-2 pb-2">
            <input 
              type="checkbox" 
              id="isBaseUnit" 
              {...register('isBaseUnit')} 
              className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="isBaseUnit" className="text-sm font-medium text-[var(--color-text-primary)]">
              This is a base unit
            </label>
          </div>

          {!isBaseUnit && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
              <Input 
                label="Base Unit Symbol" 
                placeholder="e.g. g" 
                {...register('baseUnit', { required: !isBaseUnit ? 'Base unit is required' : false })} 
                error={errors.baseUnit?.message} 
              />
              <Input 
                label="Conversion Multiplier" 
                type="number" 
                step="0.000001" 
                {...register('conversionToBase', { 
                  required: !isBaseUnit ? 'Conversion is required' : false,
                  valueAsNumber: true 
                })} 
                error={errors.conversionToBase?.message} 
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="default" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!unitToDelete}
        onCancel={() => setUnitToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Unit"
        message={`Are you sure you want to delete ${unitToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};
