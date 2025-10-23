import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './ui/Dialog';
import { Input, Textarea, Label } from './ui/Input';
import { Button } from './ui/Button';

export function AddLevel0ColumnDialog({ open, onClose, onAdd, initialData = null }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData && open) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
    }
  }, [initialData, open]);

  const handleClose = () => {
    if (!initialData) {
      setName('');
      setDescription('');
    }
    onClose();
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim()
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Rediger Level 0 Capability' : 'Tilføj Level 0 Capability'}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <div>
            <Label>
              Navn på Level 0 Capability <span className="text-red-500">*</span>
            </Label>
            <Input
              autoFocus
              value={name}
              onChange={setName}
              placeholder="F.eks. Contact Management"
            />
          </div>

          <div>
            <Label>Beskrivelse</Label>
            <Textarea
              value={description}
              onChange={setDescription}
              placeholder="Kort beskrivelse af denne capability..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Annuller
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
            {initialData ? 'Gem Ændringer' : 'Tilføj'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
