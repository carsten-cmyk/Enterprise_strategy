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
  { value: 'leverage', label: 'Leverage', color: 'bg-emerald-600', textColor: 'text-white' },
  { value: 'enhance', label: 'Enhance', color: 'bg-amber-500', textColor: 'text-white' },
  { value: 'transform', label: 'Transform', color: 'bg-rose-600', textColor: 'text-white' },
  { value: 'build', label: 'Build', color: 'bg-blue-600', textColor: 'text-white' },
  { value: 'not-touched', label: 'Not Touched', color: 'bg-slate-100', textColor: 'text-slate-700', border: 'border-2 border-slate-300' }
];

export function SolutionDetailDialog({ open, onClose, onSave, solution, roadmapItems = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scope: 'not-touched',
    linkedRoadmapItems: [],
    budget: '',
    vendor: '',
    implementationPartner: '',
    expectedGoLive: ''
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (solution && open) {
      setFormData({
        name: solution.name || '',
        description: solution.description || '',
        scope: solution.scope || 'not-touched',
        linkedRoadmapItems: solution.linkedRoadmapItems || [],
        budget: solution.budget || '',
        vendor: solution.vendor || '',
        implementationPartner: solution.implementationPartner || '',
        expectedGoLive: solution.expectedGoLive || ''
      });
    }
  }, [solution, open]);

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

  const handleRoadmapItemToggle = (itemId) => {
    setFormData(prev => ({
      ...prev,
      linkedRoadmapItems: prev.linkedRoadmapItems.includes(itemId)
        ? prev.linkedRoadmapItems.filter(id => id !== itemId)
        : [...prev.linkedRoadmapItems, itemId]
    }));
  };

  const isValid = formData.name.trim();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Solution / Project</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Basic Information</h3>

            <div>
              <Label>
                Solution / Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                autoFocus
                value={formData.name}
                onChange={(value) => updateField('name', value)}
                placeholder="E.g. Salesforce CRM Implementation"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(value) => updateField('description', value)}
                placeholder="Detailed description of the solution or project..."
                rows={4}
              />
            </div>
          </div>

          {/* Financial & Partners */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Financial & Partners</h3>

            <div>
              <Label>Budget</Label>
              <Input
                value={formData.budget}
                onChange={(value) => updateField('budget', value)}
                placeholder="E.g. 500,000 DKK or High"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vendor</Label>
                <Input
                  value={formData.vendor}
                  onChange={(value) => updateField('vendor', value)}
                  placeholder="E.g. Salesforce, Microsoft"
                />
              </div>

              <div>
                <Label>Implementation Partner</Label>
                <Input
                  value={formData.implementationPartner}
                  onChange={(value) => updateField('implementationPartner', value)}
                  placeholder="E.g. Accenture, Deloitte"
                />
              </div>
            </div>
          </div>

          {/* Timeline & Classification */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Timeline & Classification</h3>

            <div>
              <Label>Expected Go-Live</Label>
              <Input
                type="date"
                value={formData.expectedGoLive}
                onChange={(value) => updateField('expectedGoLive', value)}
              />
            </div>

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
          </div>

          {/* Linked Roadmap Items */}
          {roadmapItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Linked Roadmap Items</h3>

              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {roadmapItems.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.linkedRoadmapItems.includes(item.id)}
                      onChange={() => handleRoadmapItemToggle(item.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-700">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500">{item.description}</div>
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
