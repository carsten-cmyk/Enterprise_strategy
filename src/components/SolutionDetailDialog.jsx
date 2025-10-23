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

const TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'planning', label: 'Planning' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'budget', label: 'Budget & Costs' },
  { id: 'actions', label: 'Action Plan' },
  { id: 'classification', label: 'Classification' }
];

const SUPPORT_OPTIONS = [
  { value: 'leverage', label: 'Leverage', color: 'bg-emerald-600', textColor: 'text-white' },
  { value: 'enhance', label: 'Enhance', color: 'bg-amber-500', textColor: 'text-white' },
  { value: 'transform', label: 'Transform', color: 'bg-rose-600', textColor: 'text-white' },
  { value: 'build', label: 'Build', color: 'bg-blue-600', textColor: 'text-white' },
  { value: 'not-touched', label: 'Not Touched', color: 'bg-slate-100', textColor: 'text-slate-700', border: 'border-2 border-slate-300' }
];

export function SolutionDetailDialog({ open, onClose, onSave, solution, roadmapItems = [] }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currentState: '',
    desiredState: '',
    scope: 'not-touched',
    linkedRoadmapItems: [],

    // Assessment
    businessImpact: '',
    investmentEstimate: '',

    // Planning
    timeline: '',
    dependencies: '',
    expectedGoLive: '',

    // Ownership
    businessOwner: '',
    technicalOwner: '',
    vendor: '',
    implementationPartner: '',

    // Gap Analysis
    gaps: [],

    // Action Plan
    actions: [],

    // Budget & Cost
    investmentBudget: '',
    annualLicenseCost: '',
    annualMaintenance: '',
    latestReview: '',
    nextReview: '',

    // Classification
    domain: '',
    projectGroup: ''
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (solution && open) {
      setFormData({
        name: solution.name || '',
        description: solution.description || '',
        currentState: solution.currentState || '',
        desiredState: solution.desiredState || '',
        scope: solution.scope || 'not-touched',
        linkedRoadmapItems: solution.linkedRoadmapItems || [],

        businessImpact: solution.businessImpact || '',
        investmentEstimate: solution.investmentEstimate || '',

        timeline: solution.timeline || '',
        dependencies: solution.dependencies || '',
        expectedGoLive: solution.expectedGoLive || '',

        businessOwner: solution.businessOwner || '',
        technicalOwner: solution.technicalOwner || '',
        vendor: solution.vendor || '',
        implementationPartner: solution.implementationPartner || '',

        gaps: solution.gaps || [],
        actions: solution.actions || [],

        investmentBudget: solution.investmentBudget || '',
        annualLicenseCost: solution.annualLicenseCost || '',
        annualMaintenance: solution.annualMaintenance || '',
        latestReview: solution.latestReview || '',
        nextReview: solution.nextReview || '',

        domain: solution.domain || '',
        projectGroup: solution.projectGroup || ''
      });
      setActiveTab('basic');
    }
  }, [solution, open]);

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

  const handleRoadmapItemToggle = (itemId) => {
    setFormData(prev => ({
      ...prev,
      linkedRoadmapItems: prev.linkedRoadmapItems.includes(itemId)
        ? prev.linkedRoadmapItems.filter(id => id !== itemId)
        : [...prev.linkedRoadmapItems, itemId]
    }));
  };

  // Gap Management
  const addGap = () => {
    setFormData(prev => ({
      ...prev,
      gaps: [...prev.gaps, { id: Date.now(), title: '', description: '' }]
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

  // Action Management
  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { id: Date.now(), title: '', description: '', owner: '', deadline: '' }]
    }));
  };

  const updateAction = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === id ? { ...action, [field]: value } : action
      )
    }));
  };

  const removeAction = (id) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter(action => action.id !== id)
    }));
  };

  const isValid = formData.name.trim();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Solution / Project</DialogTitle>
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
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Assessment</h3>

              <div>
                <Label>Current State (As-Is)</Label>
                <Textarea
                  value={formData.currentState}
                  onChange={(value) => updateField('currentState', value)}
                  placeholder="Describe the current state before this solution..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Desired State (To-Be)</Label>
                <Textarea
                  value={formData.desiredState}
                  onChange={(value) => updateField('desiredState', value)}
                  placeholder="Describe the desired future state after implementation..."
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

          {/* Planning Tab */}
          {activeTab === 'planning' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Planning & Timeline</h3>

              <div>
                <Label>Timeline</Label>
                <Input
                  value={formData.timeline}
                  onChange={(value) => updateField('timeline', value)}
                  placeholder="E.g. Q1 2024, 6 months, 2024-2025"
                />
              </div>

              <div>
                <Label>Expected Go-Live</Label>
                <Input
                  type="date"
                  value={formData.expectedGoLive}
                  onChange={(value) => updateField('expectedGoLive', value)}
                />
              </div>

              <div>
                <Label>Dependencies</Label>
                <Textarea
                  value={formData.dependencies}
                  onChange={(value) => updateField('dependencies', value)}
                  placeholder="List any dependencies on other projects, systems, or resources..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Ownership Tab */}
          {activeTab === 'ownership' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Ownership & Partners</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Owner</Label>
                  <Input
                    value={formData.businessOwner}
                    onChange={(value) => updateField('businessOwner', value)}
                    placeholder="Name of business owner"
                  />
                </div>

                <div>
                  <Label>Technical Owner</Label>
                  <Input
                    value={formData.technicalOwner}
                    onChange={(value) => updateField('technicalOwner', value)}
                    placeholder="Name of technical owner"
                  />
                </div>
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
          )}

          {/* Budget & Cost Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Budget & Costs</h3>

              <div>
                <Label>Vendor</Label>
                <Input
                  value={formData.vendor}
                  onChange={(value) => updateField('vendor', value)}
                  placeholder="Select or enter vendor"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Manage vendors in Settings
                </p>
              </div>

              <div>
                <Label>Investment Budget</Label>
                <Input
                  value={formData.investmentBudget}
                  onChange={(value) => updateField('investmentBudget', value)}
                  placeholder="E.g. 500,000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Currency can be set in Settings
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Annual License Cost</Label>
                  <Input
                    value={formData.annualLicenseCost}
                    onChange={(value) => updateField('annualLicenseCost', value)}
                    placeholder="E.g. 50,000"
                  />
                </div>

                <div>
                  <Label>Annual Maintenance</Label>
                  <Input
                    value={formData.annualMaintenance}
                    onChange={(value) => updateField('annualMaintenance', value)}
                    placeholder="E.g. 25,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

          {/* Action Plan Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 uppercase">Action Plan</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addAction}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Action
                </Button>
              </div>

              {formData.actions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No actions planned yet</p>
                  <Button
                    variant="secondary"
                    onClick={addAction}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Your First Action
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.actions.map((action, index) => (
                    <div key={action.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Action #{index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAction(action.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label>Action Title</Label>
                          <Input
                            value={action.title}
                            onChange={(value) => updateAction(action.id, 'title', value)}
                            placeholder="Brief title for this action"
                          />
                        </div>

                        <div>
                          <Label>Action Description</Label>
                          <Textarea
                            value={action.description}
                            onChange={(value) => updateAction(action.id, 'description', value)}
                            placeholder="Detailed description of the action..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Owner</Label>
                            <Input
                              value={action.owner}
                              onChange={(value) => updateAction(action.id, 'owner', value)}
                              placeholder="Person responsible"
                            />
                          </div>

                          <div>
                            <Label>Deadline</Label>
                            <Input
                              type="date"
                              value={action.deadline}
                              onChange={(value) => updateAction(action.id, 'deadline', value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Classification Tab */}
          {activeTab === 'classification' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Classification</h3>

              <div>
                <Label>Domain</Label>
                <Input
                  value={formData.domain}
                  onChange={(value) => updateField('domain', value)}
                  placeholder="E.g. Sales, Administration, Marketing, IT"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Categorize this project by business domain
                </p>
              </div>

              <div>
                <Label>Project Group</Label>
                <Input
                  value={formData.projectGroup}
                  onChange={(value) => updateField('projectGroup', value)}
                  placeholder="E.g. Website, Mobile App, Marketing Site"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Group related projects together
                </p>
              </div>

              {/* Linked Roadmap Items */}
              {roadmapItems.length > 0 && (
                <div>
                  <Label>Linked Roadmap Items</Label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
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
