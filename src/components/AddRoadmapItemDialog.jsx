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

const STRATEGY_OPTIONS = [
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

export function AddRoadmapItemDialog({ open, onClose, onAdd, capabilities = [] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [strategy, setStrategy] = useState('tbd');
  const [linkedCapabilities, setLinkedCapabilities] = useState([]);

  // Assessment - using new selective inheritance field structure
  const [selectedAsIsComponents, setSelectedAsIsComponents] = useState([]);
  const [asIsUserNotes, setAsIsManualNotes] = useState('');
  const [selectedToBeComponents, setSelectedToBeComponents] = useState([]);
  const [toBeUserNotes, setToBeManualNotes] = useState('');
  const [selectedBusinessImpactComponents, setSelectedBusinessImpactComponents] = useState([]);
  const [businessImpactUserNotes, setBusinessImpactManualNotes] = useState('');
  const [gaps, setGaps] = useState([]);

  // Timeline
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expectedStart, setExpectedStart] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('weeks');

  // Ownership
  const [owner, setOwner] = useState('');

  // Classification
  const [progressStatus, setProgressStatus] = useState('not-started');

  const handleClose = () => {
    setName('');
    setDescription('');
    setStrategy('tbd');
    setLinkedCapabilities([]);

    // Assessment fields
    setSelectedAsIsComponents([]);
    setAsIsManualNotes('');
    setSelectedToBeComponents([]);
    setToBeManualNotes('');
    setSelectedBusinessImpactComponents([]);
    setBusinessImpactManualNotes('');
    setGaps([]);

    // Timeline fields
    setStartDate('');
    setEndDate('');
    setExpectedStart('');
    setEstimatedDuration('');
    setDurationUnit('weeks');

    // Ownership
    setOwner('');

    // Classification
    setProgressStatus('not-started');

    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      strategy,
      linkedCapabilities,

      // Assessment - new selective inheritance fields
      selectedAsIsComponents,
      asIsUserNotes,
      selectedToBeComponents,
      toBeUserNotes,
      selectedBusinessImpactComponents,
      businessImpactUserNotes,
      gaps,

      // Timeline
      startDate,
      endDate,
      expectedStart,
      estimatedDuration,
      durationUnit,

      // Ownership
      owner: owner.trim(),

      // Classification
      progressStatus
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

          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">Planning & Timeline</h3>

            <div className="mb-4">
              <Label>Expected Start</Label>
              <Input
                type="date"
                value={expectedStart}
                onChange={setExpectedStart}
              />
              <p className="text-xs text-gray-500 mt-1">
                When do you expect to start this roadmap item?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estimated Duration</Label>
                <Input
                  type="number"
                  min="0"
                  value={estimatedDuration}
                  onChange={setEstimatedDuration}
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <Label>Duration Unit</Label>
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
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
            <Label>Strategy</Label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              {STRATEGY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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

          {capabilities.length > 0 && (
            <div>
              <Label>Linked Capabilities (Components)</Label>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
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
                    <div>
                      <div className="text-sm font-medium text-gray-700">{cap.displayName || cap.name}</div>
                      {cap.description && (
                        <div className="text-xs text-gray-500">{cap.description}</div>
                      )}
                    </div>
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
