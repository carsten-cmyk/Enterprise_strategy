import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './ui/Dialog';
import { Input, Textarea, Label } from './ui/Input';
import { Button } from './ui/Button';
import { useSettings } from '../data/settingsStore';

const TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'technical', label: 'Technical' }
];

const SUPPORT_OPTIONS = [
  { value: 'maintain', label: 'Maintain', color: 'bg-emerald-600', textColor: 'text-white' },
  { value: 'enhance', label: 'Enhance', color: 'bg-amber-500', textColor: 'text-white' },
  { value: 'transform', label: 'Transform', color: 'bg-rose-600', textColor: 'text-white' },
  { value: 'new-build', label: 'New Build', color: 'bg-blue-600', textColor: 'text-white' },
  { value: 'retire', label: 'Retire', color: 'bg-gray-600', textColor: 'text-white' },
  { value: 'tbd', label: 'TBD', color: 'bg-slate-100', textColor: 'text-slate-700', border: 'border-2 border-slate-300' }
];

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

const PROGRESS_STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' }
];

export function ComponentDetailDialog({ open, onClose, onSave, component, columnName }) {
  const { people, vendors, addPerson, addVendor } = useSettings();
  const [activeTab, setActiveTab] = useState('basic');
  const [showAddPersonDialog, setShowAddPersonDialog] = useState(false);
  const [showAddVendorDialog, setShowAddVendorDialog] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newVendorName, setNewVendorName] = useState('');
  const [personFieldTarget, setPersonFieldTarget] = useState(null); // 'business' or 'technical'

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    support: 'maintain',
    priority: 'medium',
    progressStatus: 'not-started',

    // Assessment
    asIs: '',
    toBe: '',
    businessImpact: '',
    gaps: [],

    // Ownership
    businessOwner: '',
    technicalOwner: '',
    businessProcess: '',

    // Technical
    vendor: 'TBD',
    technologyStack: '',
    integrationPoints: ''
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (component && open) {
      setFormData({
        name: component.name || '',
        description: component.description || '',
        // Map old values to new standardized values
        support: component.support || component.scope || 'maintain',
        priority: component.priority || 'medium',
        progressStatus: component.progressStatus || component.lifecycleStatus || 'not-started',

        // Support both old and new field names during transition
        asIs: component.asIs || component.currentState || '',
        toBe: component.toBe || component.desiredCapability || '',
        businessImpact: component.businessImpact || '',
        gaps: component.gaps || [],

        businessOwner: component.businessOwner || '',
        technicalOwner: component.technicalOwner || '',
        businessProcess: component.businessProcess || '',

        vendor: component.vendor || 'TBD',
        technologyStack: component.technologyStack || '',
        integrationPoints: component.integrationPoints || ''
      });
      setActiveTab('basic');
    }
  }, [component, open]);

  const handleClose = () => {
    setActiveTab('basic');
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

  // Gap Management
  const addGap = () => {
    setFormData(prev => ({
      ...prev,
      gaps: [...prev.gaps, { id: Date.now(), description: '' }]
    }));
  };

  const updateGap = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      gaps: prev.gaps.map(gap =>
        gap.id === id ? { ...gap, [field]: value } : gap
      )
    }));
  };

  const removeGap = (id) => {
    setFormData(prev => ({
      ...prev,
      gaps: prev.gaps.filter(gap => gap.id !== id)
    }));
  };

  const isValid = formData.name.trim();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Component</DialogTitle>
          {columnName && (
            <p className="text-sm text-gray-600 mt-1">
              Under: {columnName}
            </p>
          )}
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex gap-1 -mb-px justify-between">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 border-b-2 font-medium text-xs transition-colors whitespace-nowrap flex-1 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Basic Information</h3>

              <div>
                <Label>
                  Component Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoFocus
                  value={formData.name}
                  onChange={(value) => updateField('name', value)}
                  placeholder="E.g. CRM System, Mobile App"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(value) => updateField('description', value)}
                  placeholder="Detailed description of the component..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Strategy</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {SUPPORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('support', option.value)}
                      className={`px-4 py-2 rounded font-medium text-sm transition-all ${option.color} ${option.textColor} ${option.border || ''} ${
                        formData.support === option.value
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
                <Label>Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => updateField('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  {PRIORITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Progress Status</Label>
                <select
                  value={formData.progressStatus}
                  onChange={(e) => updateField('progressStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  {PROGRESS_STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <Label>Latest Review</Label>
                  <Input
                    type="date"
                    value={formData.latestReview}
                    onChange={(value) => updateField('latestReview', value)}
                  />
                </div>

                <div>
                  <Label>Next Review</Label>
                  <Input
                    type="date"
                    value={formData.nextReview}
                    onChange={(value) => updateField('nextReview', value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Assessment</h3>

              <div>
                <Label>As-Is</Label>
                <Textarea
                  value={formData.asIs}
                  onChange={(value) => updateField('asIs', value)}
                  placeholder="Describe the current state of this component..."
                  rows={3}
                />
              </div>

              <div>
                <Label>To-Be</Label>
                <Textarea
                  value={formData.toBe}
                  onChange={(value) => updateField('toBe', value)}
                  placeholder="Describe the desired future capability..."
                  rows={3}
                />
              </div>

              {/* Gap Analysis */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <Label>Gap Analysis</Label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={addGap}
                    className="flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Add Gap
                  </Button>
                </div>

                {formData.gaps.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No gaps identified yet. Click "Add Gap" to add one.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.gaps.map((gap, index) => (
                      <div key={gap.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGap(gap.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>

                        <div className="pr-8">
                          <Textarea
                            value={gap.description}
                            onChange={(value) => updateGap(gap.id, 'description', value)}
                            placeholder="Describe the gap..."
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Business Impact</Label>
                <Textarea
                  value={formData.businessImpact}
                  onChange={(value) => updateField('businessImpact', value)}
                  placeholder="Describe the expected business impact and benefits..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Ownership Tab */}
          {activeTab === 'ownership' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Ownership & Process</h3>

              <div>
                <Label>Business Owner</Label>
                <select
                  value={formData.businessOwner}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setPersonFieldTarget('business');
                      setShowAddPersonDialog(true);
                    } else {
                      updateField('businessOwner', e.target.value);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select person...</option>
                  {people.map(person => (
                    <option key={person.id} value={person.name}>{person.name}</option>
                  ))}
                  <option value="__add_new__">+ Add new person...</option>
                </select>
              </div>

              <div>
                <Label>Technical Owner</Label>
                <select
                  value={formData.technicalOwner}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setPersonFieldTarget('technical');
                      setShowAddPersonDialog(true);
                    } else {
                      updateField('technicalOwner', e.target.value);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select person...</option>
                  {people.map(person => (
                    <option key={person.id} value={person.name}>{person.name}</option>
                  ))}
                  <option value="__add_new__">+ Add new person...</option>
                </select>
              </div>

              <div>
                <Label>Business Process</Label>
                <Input
                  value={formData.businessProcess}
                  onChange={(value) => updateField('businessProcess', value)}
                  placeholder="E.g. Sales & Marketing, Finance & Accounting"
                />
              </div>
            </div>
          )}

          {/* Technical Tab */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Technical Information</h3>

              <div>
                <Label>Vendor</Label>
                <select
                  value={formData.vendor}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setShowAddVendorDialog(true);
                    } else {
                      updateField('vendor', e.target.value);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="TBD">TBD</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                  ))}
                  <option value="__add_new__">+ Add new vendor...</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Manage vendors in Settings
                </p>
              </div>

              <div>
                <Label>Technology Stack</Label>
                <Textarea
                  value={formData.technologyStack}
                  onChange={(value) => updateField('technologyStack', value)}
                  placeholder="E.g. React, Node.js, PostgreSQL"
                  rows={3}
                />
              </div>

              <div>
                <Label>Integration Points</Label>
                <Textarea
                  value={formData.integrationPoints}
                  onChange={(value) => updateField('integrationPoints', value)}
                  placeholder="E.g. ERP, CRM, Payment Gateway"
                  rows={3}
                />
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

      {/* Add Person Dialog */}
      <Dialog open={showAddPersonDialog} onClose={() => {
        setShowAddPersonDialog(false);
        setNewPersonName('');
        setPersonFieldTarget(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Person</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <Label>Person Name</Label>
            <Input
              autoFocus
              value={newPersonName}
              onChange={setNewPersonName}
              placeholder="Enter person name..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newPersonName.trim()) {
                  addPerson(newPersonName.trim());
                  if (personFieldTarget === 'business') {
                    updateField('businessOwner', newPersonName.trim());
                  } else if (personFieldTarget === 'technical') {
                    updateField('technicalOwner', newPersonName.trim());
                  }
                  setNewPersonName('');
                  setShowAddPersonDialog(false);
                  setPersonFieldTarget(null);
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => {
              setShowAddPersonDialog(false);
              setNewPersonName('');
              setPersonFieldTarget(null);
            }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (newPersonName.trim()) {
                  addPerson(newPersonName.trim());
                  if (personFieldTarget === 'business') {
                    updateField('businessOwner', newPersonName.trim());
                  } else if (personFieldTarget === 'technical') {
                    updateField('technicalOwner', newPersonName.trim());
                  }
                  setNewPersonName('');
                  setShowAddPersonDialog(false);
                  setPersonFieldTarget(null);
                }
              }}
              disabled={!newPersonName.trim()}
            >
              Add Person
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vendor Dialog */}
      <Dialog open={showAddVendorDialog} onClose={() => {
        setShowAddVendorDialog(false);
        setNewVendorName('');
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <Label>Vendor Name</Label>
            <Input
              autoFocus
              value={newVendorName}
              onChange={setNewVendorName}
              placeholder="Enter vendor name..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newVendorName.trim()) {
                  addVendor(newVendorName.trim());
                  updateField('vendor', newVendorName.trim());
                  setNewVendorName('');
                  setShowAddVendorDialog(false);
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => {
              setShowAddVendorDialog(false);
              setNewVendorName('');
            }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (newVendorName.trim()) {
                  addVendor(newVendorName.trim());
                  updateField('vendor', newVendorName.trim());
                  setNewVendorName('');
                  setShowAddVendorDialog(false);
                }
              }}
              disabled={!newVendorName.trim()}
            >
              Add Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
