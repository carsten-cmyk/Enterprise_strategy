import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './ui/Dialog';
import { Input, Label } from './ui/Input';
import { Button } from './ui/Button';

export function AddLevel0ColumnDialog({ open, onClose, onAdd }) {
  const [name, setName] = useState('');

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tilføj Level 0 Capability</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <Label>Navn på Level 0 Capability</Label>
          <Input
            autoFocus
            value={name}
            onChange={setName}
            placeholder="F.eks. Contact Management"
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Annuller
          </Button>
          <Button variant="primary" onClick={handleAdd} disabled={!name.trim()}>
            Tilføj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
