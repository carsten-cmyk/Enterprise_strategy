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

export function AddSolutionDialog({ open, onClose, onAdd, roadmapItems = [] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('not-touched');
  const [linkedRoadmapItems, setLinkedRoadmapItems] = useState([]);
  const [budget, setBudget] = useState('');
  const [vendor, setVendor] = useState('');
  const [implementationPartner, setImplementationPartner] = useState('');
  const [expectedGoLive, setExpectedGoLive] = useState('');

  const handleClose = () => {
    setName('');
    setDescription('');
    setScope('not-touched');
    setLinkedRoadmapItems([]);
    setBudget('');
    setVendor('');
    setImplementationPartner('');
    setExpectedGoLive('');
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      scope,
      linkedRoadmapItems,
      budget: budget.trim(),
      vendor: vendor.trim(),
      implementationPartner: implementationPartner.trim(),
      expectedGoLive
    });
    handleClose();
  };

  const handleRoadmapItemToggle = (itemId) => {
    setLinkedRoadmapItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Solution / Project</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label>
              Solution / Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              autoFocus
              value={name}
              onChange={setName}
              placeholder="E.g. Salesforce CRM Implementation"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={setDescription}
              placeholder="Brief description of the solution or project..."
              rows={3}
            />
          </div>

          <div>
            <Label>Budget</Label>
            <Input
              value={budget}
              onChange={setBudget}
              placeholder="E.g. 500,000 DKK or High"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vendor</Label>
              <Input
                value={vendor}
                onChange={setVendor}
                placeholder="E.g. Salesforce, Microsoft"
              />
            </div>

            <div>
              <Label>Implementation Partner</Label>
              <Input
                value={implementationPartner}
                onChange={setImplementationPartner}
                placeholder="E.g. Accenture, Deloitte"
              />
            </div>
          </div>

          <div>
            <Label>Expected Go-Live</Label>
            <Input
              type="date"
              value={expectedGoLive}
              onChange={setExpectedGoLive}
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

          {roadmapItems.length > 0 && (
            <div>
              <Label>Linked Roadmap Items</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {roadmapItems.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={linkedRoadmapItems.includes(item.id)}
                      onChange={() => handleRoadmapItemToggle(item.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
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
            Add Solution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
