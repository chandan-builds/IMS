import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  danger = false,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  className,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="sm" className={className}>
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={cn(
            'mb-5 flex h-14 w-14 items-center justify-center rounded-full ring-8 ring-opacity-30',
            danger
              ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)] ring-[var(--color-danger)]'
              : 'bg-[var(--color-primary-light)] text-[var(--color-primary)] ring-[var(--color-primary)]'
          )}
        >
          <AlertTriangle size={28} />
        </div>
        <h3 className="mb-2 text-xl font-bold text-[var(--color-text-primary)]">
          {title}
        </h3>
        <div className="mb-8 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {message}
        </div>
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'default'}
            className="flex-1"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};