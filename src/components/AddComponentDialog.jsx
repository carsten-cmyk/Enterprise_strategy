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

const SUPPORT_OPTIONS = [
  { value: 'maintain', label: 'Maintain (Emerald)' },
  { value: 'enhance', label: 'Enhance (Amber)' },
  { value: 'transform', label: 'Transform (Rose)' },
  { value: 'new-build', label: 'New Build (Blue)' },
  { value: 'retire', label: 'Retire (Gray)' },
  { value: 'tbd', label: 'TBD (White)' }
];

const PROGRESS_STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' }
];

export function AddComponentDialog({ open, onClose, onAdd, columnName }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [support, setSupport] = useState('maintain');
  const [priority, setPriority] = useState('medium');
  const [progressStatus, setProgressStatus] = useState('not-started');

  const handleClose = () => {
    setName('');
    setDescription('');
    setSupport('maintain');
    setPriority('medium');
    setProgressStatus('not-started');
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      support,
      priority,
      progressStatus
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
            <Label>Strategy</Label>
            <select
              value={support}
              onChange={(e) => setSupport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              {SUPPORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Priority</Label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <Label>Progress Status</Label>
            <select
              value={progressStatus}
              onChange={(e) => setProgressStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              {PROGRESS_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
