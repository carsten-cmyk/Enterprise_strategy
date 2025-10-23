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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scope: 'not-touched',
    linkedCapabilities: [],
    startDate: '',
    endDate: '',
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
        owner: roadmapItem.owner || '',
        status: roadmapItem.status || 'planning'
      });
    }
  }, [roadmapItem, open]);

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

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Basic Information</h3>

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
                rows={4}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Timeline</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(value) => updateField('startDate', value)}
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(value) => updateField('endDate', value)}
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Classification</h3>

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

          {/* Ownership */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Ownership</h3>

            <div>
              <Label>Owner</Label>
              <Input
                value={formData.owner}
                onChange={(value) => updateField('owner', value)}
                placeholder="E.g. John Doe or IT Department"
              />
            </div>
          </div>

          {/* Linked Capabilities */}
          {capabilities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Linked Capabilities</h3>

              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
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
                      <div className="text-sm font-medium text-gray-700">{cap.name}</div>
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
