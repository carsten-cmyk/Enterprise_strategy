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

const TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'timeline', label: 'Time & Schedule' },
  { id: 'classification', label: 'Classification' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'capabilities', label: 'Linked Capabilities' }
];

const SUPPORT_OPTIONS = [
  { value: 'leverage', label: 'Maintain', color: 'bg-emerald-600', textColor: 'text-white' },
  { value: 'enhance', label: 'Uplift', color: 'bg-amber-500', textColor: 'text-white' },
  { value: 'transform', label: 'Transform', color: 'bg-rose-600', textColor: 'text-white' },
  { value: 'build', label: 'New build', color: 'bg-blue-600', textColor: 'text-white' },
  { value: 'not-touched', label: 'TBD', color: 'bg-slate-100', textColor: 'text-slate-700', border: 'border-2 border-slate-300' }
];

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning', color: 'bg-gray-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'on-hold', label: 'On Hold', color: 'bg-orange-500' }
];

export function RoadmapItemDetailDialog({ open, onClose, onSave, roadmapItem, capabilities = [] }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scope: 'not-touched',
    linkedCapabilities: [],
    startDate: '',
    endDate: '',
    expectedStart: '',
    estimatedDuration: '',
    durationUnit: 'weeks',
    owner: '',
    status: 'planning'
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (roadmapItem && open) {
      setFormData({
        name: roadmapItem.name || '',
        description: roadmapItem.description || '',
        scope: roadmapItem.scope || 'not-touched',
        linkedCapabilities: roadmapItem.linkedCapabilities || [],
        startDate: roadmapItem.startDate || '',
        endDate: roadmapItem.endDate || '',
        expectedStart: roadmapItem.expectedStart || '',
        estimatedDuration: roadmapItem.estimatedDuration || '',
        durationUnit: roadmapItem.durationUnit || 'weeks',
        owner: roadmapItem.owner || '',
        status: roadmapItem.status || 'planning'
      });
    }
  }, [roadmapItem, open]);

  // Reset to first tab when opening
  useEffect(() => {
    if (open) {
      setActiveTab('basic');
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
    handleClose();
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCapabilityToggle = (capabilityId) => {
    setFormData(prev => ({
      ...prev,
      linkedCapabilities: prev.linkedCapabilities.includes(capabilityId)
        ? prev.linkedCapabilities.filter(id => id !== capabilityId)
        : [...prev.linkedCapabilities, capabilityId]
    }));
  };

  const isValid = formData.name.trim();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Roadmap Item</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <Label>
                  Roadmap Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoFocus
                  value={formData.name}
                  onChange={(value) => updateField('name', value)}
                  placeholder="E.g. CRM Migration Project"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(value) => updateField('description', value)}
                  placeholder="Detailed description of the roadmap item..."
                  rows={6}
                />
              </div>
            </div>
          )}

          {/* Time & Schedule Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Planning & Timeline</h3>

              <div>
                <Label>Expected Start</Label>
                <Input
                  type="date"
                  value={formData.expectedStart}
                  onChange={(value) => updateField('expectedStart', value)}
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
                    value={formData.estimatedDuration || ''}
                    onChange={(value) => updateField('estimatedDuration', value)}
                    placeholder="e.g. 8"
                  />
                </div>

                <div>
                  <Label>Duration Unit</Label>
                  <select
                    value={formData.durationUnit || 'weeks'}
                    onChange={(e) => updateField('durationUnit', e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Classification Tab */}
          {activeTab === 'classification' && (
            <div className="space-y-6">
              <div>
                <Label>Support Type</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {SUPPORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('scope', option.value)}
                      className={`px-4 py-2 rounded font-medium text-sm transition-all ${option.color} ${option.textColor} ${option.border || ''} ${
                        formData.scope === option.value
                          ? 'ring-2 ring-offset-2 ring-gray-600'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <div className="flex gap-3 mt-2">
                  {STATUS_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('status', option.value)}
                      className={`px-4 py-2 rounded font-medium text-sm text-white transition-all ${option.color} ${
                        formData.status === option.value
                          ? 'ring-2 ring-offset-2 ring-gray-600'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ownership Tab */}
          {activeTab === 'ownership' && (
            <div className="space-y-4">
              <div>
                <Label>Owner</Label>
                <Input
                  value={formData.owner}
                  onChange={(value) => updateField('owner', value)}
                  placeholder="E.g. John Doe or IT Department"
                />
                <p className="text-xs text-gray-500 mt-1">Person or team responsible for this roadmap item</p>
              </div>
            </div>
          )}

          {/* Linked Capabilities Tab */}
          {activeTab === 'capabilities' && (
            <div className="space-y-4">
              {capabilities.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {capabilities.map(cap => (
                    <label
                      key={cap.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.linkedCapabilities.includes(cap.id)}
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No capabilities available to link.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isValid}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
