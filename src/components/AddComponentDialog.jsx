import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './ui/Dialog';
import { Input, Textarea, Label } from './ui/Input';
import { Button } from './ui/Button';

export function AddComponentDialog({ open, onClose, onAdd, columnName }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('not-touched');

  const handleClose = () => {
    setName('');
    setDescription('');
    setScope('not-touched');
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      scope
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tilføj Component</DialogTitle>
          {columnName && (
            <p className="text-sm text-gray-600 mt-1">
              Under: {columnName}
            </p>
          )}
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <div>
            <Label>Navn på component</Label>
            <Input
              autoFocus
              value={name}
              onChange={setName}
              placeholder="F.eks. Lead Tracking System"
            />
          </div>

          <div>
            <Label>Beskrivelse (valgfri)</Label>
            <Textarea
              value={description}
              onChange={setDescription}
              placeholder="Kort beskrivelse af component..."
              rows={3}
            />
          </div>

          <div>
            <Label>Scope Classification</Label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              <option value="primary">Primary - Direkte påvirket</option>
              <option value="secondary">Secondary - Indirekte påvirket</option>
              <option value="not-touched">Not Touched - Ikke påvirket</option>
            </select>
          </div>
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
