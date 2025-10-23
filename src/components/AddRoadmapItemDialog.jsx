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
  { value: 'leverage', label: 'Leverage (Emerald)' },
  { value: 'enhance', label: 'Enhance (Amber)' },
  { value: 'transform', label: 'Transform (Rose)' },
  { value: 'build', label: 'Build (Blue)' },
  { value: 'not-touched', label: 'Not Touched (White)' }
];

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' }
];

export function AddRoadmapItemDialog({ open, onClose, onAdd, capabilities = [] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('not-touched');
  const [linkedCapabilities, setLinkedCapabilities] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('planning');

  const handleClose = () => {
    setName('');
    setDescription('');
    setScope('not-touched');
    setLinkedCapabilities([]);
    setStartDate('');
    setEndDate('');
    setOwner('');
    setStatus('planning');
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      scope,
      linkedCapabilities,
      startDate,
      endDate,
      owner: owner.trim(),
      status
    });
    handleClose();
  };

  const handleCapabilityToggle = (capabilityId) => {
    setLinkedCapabilities(prev =>
      prev.includes(capabilityId)
        ? prev.filter(id => id !== capabilityId)
        : [...prev, capabilityId]
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Roadmap Item</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label>
              Roadmap Item Name <span className="text-red-500">*</span>
            </Label>
            <Input
              autoFocus
              value={name}
              onChange={setName}
              placeholder="E.g. CRM Migration Project"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={setDescription}
              placeholder="Brief description of the roadmap item..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={setStartDate}
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={setEndDate}
              />
            </div>
          </div>

          <div>
            <Label>Owner</Label>
            <Input
              value={owner}
              onChange={setOwner}
              placeholder="E.g. John Doe or IT Department"
            />
          </div>

          <div>
            <Label>Support Type</Label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
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
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {capabilities.length > 0 && (
            <div>
              <Label>Linked Level 0 Capabilities</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {capabilities.map(cap => (
                  <label
                    key={cap.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={linkedCapabilities.includes(cap.id)}
                      onChange={() => handleCapabilityToggle(cap.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{cap.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd} disabled={!name.trim()}>
            Add Roadmap Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
