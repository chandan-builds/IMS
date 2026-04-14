import React, { useState } from 'react';
import { useStockAdjustment } from '../hooks';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { toast } from 'react-hot-toast';

interface StockAdjustmentFormProps {
  productId: string;
  shopId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ productId, shopId, onSuccess, onCancel }) => {
  const [quantity, setQuantity] = useState('');
  const [unitSymbol, setUnitSymbol] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState('adjustment');

  const { mutate: adjustStock, isPending } = useStockAdjustment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || !unitSymbol) {
      toast.error('Quantity and Unit are required');
      return;
    }

    const payload = {
      productId,
      shopId,
      type,
      quantity: Number(quantity),
      unitSymbol,
      note,
    };

    adjustStock(payload, {
      onSuccess: () => {
        toast.success('Stock adjusted successfully');
        if (onSuccess) onSuccess();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to adjust stock');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Adjustment Type"
        value={type}
        onChange={(val) => setType(val)}
        options={[
          { label: 'Manual Adjustment', value: 'adjustment' },
          { label: 'Damage', value: 'damage' },
          { label: 'Return', value: 'return' }
        ]}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 10 or -5"
          required
        />
        <Input
          label="Unit Symbol"
          value={unitSymbol}
          onChange={(e: any) => setUnitSymbol(e.target.value)}
          placeholder="e.g. kg or pcs"
          required
        />
      </div>
      <Input
        label="Note / Reason"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Reason for adjustment"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} type="button">
            Cancel
          </Button>
        )}
        <Button loading={isPending} type="submit">
          Save Adjustment
        </Button>
      </div>
    </form>
  );
};

export default StockAdjustmentForm;
