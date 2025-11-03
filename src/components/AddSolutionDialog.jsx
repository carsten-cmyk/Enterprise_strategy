import { useState } from 'react';
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
  { id: 'assessment', label: 'Analysis' },
  { id: 'planning', label: 'Time & Schedule' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'budget', label: 'Budget' },
  { id: 'actions', label: 'Action Plan' },
  { id: 'classification', label: 'Classification' }
];

const SUPPORT_OPTIONS = [
  { value: 'leverage', label: 'Maintain', color: 'bg-emerald-600', textColor: 'text-white' },
  { value: 'enhance', label: 'Uplift', color: 'bg-amber-500', textColor: 'text-white' },
  { value: 'transform', label: 'Transform', color: 'bg-rose-600', textColor: 'text-white' },
  { value: 'build', label: 'New build', color: 'bg-blue-600', textColor: 'text-white' },
  { value: 'not-touched', label: 'TBD', color: 'bg-slate-100', textColor: 'text-slate-700', border: 'border-2 border-slate-300' }
];

export function AddSolutionDialog({ open, onClose, onAdd, programItems = [], plannings = [], currentPlanningId = null }) {
  const { people, vendors, groups, addPerson, addVendor } = useSettings();
  const [activeTab, setActiveTab] = useState('basic');
  const [showAddPersonDialog, setShowAddPersonDialog] = useState(false);
  const [showAddVendorDialog, setShowAddVendorDialog] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newVendorName, setNewVendorName] = useState('');
  const [personFieldTarget, setPersonFieldTarget] = useState(null); // 'business' or 'technical'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    group: '',
    strategy: 'not-touched',
    linkedProgramItems: [],

    // NEW: Context fields from Planning/Program
    businessGoal: '',
    businessCase: '',

    // Assessment - using new selective inheritance field structure
    selectedAsIsProgramItems: [],
    selectedAsIsComponents: [],
    asIsUserNotes: '',
    selectedToBeProgramItems: [],
    selectedToBeComponents: [],
    toBeUserNotes: '',
    selectedBusinessImpactProgramItems: [],
    selectedBusinessImpactComponents: [],
    businessImpactUserNotes: '',
    gaps: [],

    // Assessment (legacy)
    investmentEstimate: '',

    // Planning
    expectedStart: '',
    estimatedDuration: '',
    durationUnit: 'weeks',
    dependencies: [],

    // Ownership
    businessOwner: '',
    technicalOwner: '',
    vendor: 'TBD',

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

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      group: '',
      strategy: 'not-touched',
      linkedProgramItems: [],

      // NEW: Context fields
      businessGoal: '',
      businessCase: '',

      // Assessment fields
      selectedAsIsProgramItems: [],
      selectedAsIsComponents: [],
      asIsUserNotes: '',
      selectedToBeProgramItems: [],
      selectedToBeComponents: [],
      toBeUserNotes: '',
      selectedBusinessImpactProgramItems: [],
      selectedBusinessImpactComponents: [],
      businessImpactUserNotes: '',
      gaps: [],

      investmentEstimate: '',

      // Planning
      expectedStart: '',
      estimatedDuration: '',
      durationUnit: 'weeks',
      dependencies: [],

      // Ownership
      businessOwner: '',
      technicalOwner: '',
      vendor: 'TBD',

      // Actions
      actions: [],

      // Budget
      investmentBudget: '',
      annualLicenseCost: '',
      annualMaintenance: '',
      latestReview: '',
      nextReview: '',

      // Classification
      domain: '',
      projectGroup: ''
    });
    setActiveTab('basic');
    onClose();
  };

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    onAdd(formData);
    handleClose();
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProgramItemToggle = (itemId) => {
    setFormData(prev => ({
      ...prev,
      linkedProgramItems: prev.linkedProgramItems.includes(itemId)
        ? prev.linkedProgramItems.filter(id => id !== itemId)
        : [...prev.linkedProgramItems, itemId]
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

  // Dependency Management
  const addDependency = (solutionId) => {
    if (solutionId && !formData.dependencies.includes(solutionId)) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, solutionId]
      }));
    }
  };

  const removeDependency = (solutionId) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(id => id !== solutionId)
    }));
  };

  // Get all available solutions from all plannings
  const getAvailableSolutions = () => {
    const allSolutions = [];
    plannings.forEach(planning => {
      (planning.solutions || []).forEach(sol => {
        allSolutions.push({
          ...sol,
          planningId: planning.id,
          planningName: planning.name
        });
      });
    });
    return allSolutions;
  };

  const availableSolutions = getAvailableSolutions();

  const isValid = formData.name.trim();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Solution / Project</DialogTitle>
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
                <Label>Project Group</Label>
                <select
                  value={formData.group}
                  onChange={(e) => updateField('group', e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select project group...</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.name}>{group.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Manage project groups in Settings
                </p>
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

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Context from Planning</h4>
                <p className="text-xs text-gray-500 mb-3">
                  These fields are copied from the Planning session and can be edited for this specific solution.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label>Business Goal</Label>
                    <Textarea
                      value={formData.businessGoal}
                      onChange={(value) => updateField('businessGoal', value)}
                      placeholder="Copy of the business goal from Planning (editable)..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Business Case</Label>
                    <Textarea
                      value={formData.businessCase}
                      onChange={(value) => updateField('businessCase', value)}
                      placeholder="Copy of the business case from Program (editable)..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Strategy</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {SUPPORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('strategy', option.value)}
                      className={`px-4 py-2 rounded font-medium text-sm transition-all ${option.color} ${option.textColor} ${option.border || ''} ${
                        formData.strategy === option.value
                          ? 'ring-2 ring-offset-2 ring-gray-600'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <Label>Latest Review</Label>
                  <Input
                    type="date"
                    value={formData.latestReview}
                    onChange={(value) => updateField('latestReview', value)}
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div>
                  <Label>Next Review</Label>
                  <Input
                    type="date"
                    value={formData.nextReview}
                    onChange={(value) => updateField('nextReview', value)}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              {/* SECTION B: Business Context */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">Business Context</h3>

                <div className="space-y-4">
                  <div>
                    <Label>🎯 Business Goal</Label>
                    <Textarea
                      value={formData.businessGoal}
                      onChange={(value) => updateField('businessGoal', value)}
                      placeholder="Describe the business goal for this solution/project..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>💼 Business Case</Label>
                    <Textarea
                      value={formData.businessCase}
                      onChange={(value) => updateField('businessCase', value)}
                      placeholder="Describe the business case and expected ROI..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Assessment */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">Assessment</h3>

                <div className="space-y-4">
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
              </div>
            </div>
          )}

          {/* Planning Tab */}
          {activeTab === 'planning' && (
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
                  When do you expect to start this project?
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

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Dependencies</Label>
                  {(availableSolutions.length > 0 || programItems.length > 0) && (
                    <span className="text-xs text-gray-500">
                      {formData.dependencies.length} selected
                    </span>
                  )}
                </div>

                {availableSolutions.length === 0 && programItems.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No solutions or program items available to link as dependencies</p>
                ) : (
                  <>
                    <div className="mb-3">
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            addDependency(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select a dependency...</option>

                        {/* Solutions & Projects */}
                        {availableSolutions.length > 0 && (
                          <optgroup label="Solutions & Projects">
                            {availableSolutions
                              .filter(sol => !formData.dependencies.includes(sol.id))
                              .map(sol => (
                                <option key={sol.id} value={sol.id}>
                                  {sol.name} ({sol.planningName})
                                </option>
                              ))
                            }
                          </optgroup>
                        )}

                        {/* Program Items */}
                        {programItems.length > 0 && (
                          <optgroup label="Program Items">
                            {programItems
                              .filter(item => !formData.dependencies.includes(item.id))
                              .map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))
                            }
                          </optgroup>
                        )}
                      </select>
                    </div>

                    {formData.dependencies.length > 0 && (
                      <div className="space-y-2">
                        {formData.dependencies.map(depId => {
                          // Check if it's a solution
                          const depSolution = availableSolutions.find(s => s.id === depId);
                          if (depSolution) {
                            return (
                              <div
                                key={depId}
                                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                              >
                                <div>
                                  <div className="text-xs font-medium text-blue-600 mb-1">Solution/Project</div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {depSolution.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {depSolution.planningName}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeDependency(depId)}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            );
                          }

                          // Check if it's a program item
                          const depProgramItem = programItems.find(r => r.id === depId);
                          if (depProgramItem) {
                            return (
                              <div
                                key={depId}
                                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                              >
                                <div>
                                  <div className="text-xs font-medium text-purple-600 mb-1">Program Item</div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {depProgramItem.name}
                                  </div>
                                  {depProgramItem.description && (
                                    <div className="text-xs text-gray-500">
                                      {depProgramItem.description}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeDependency(depId)}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Ownership Tab */}
          {activeTab === 'ownership' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Ownership & Partners</h3>

              <div>
                <Label>Business Owner</Label>
                <div className="flex gap-2 items-center">
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
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select person...</option>
                    {people.map(person => (
                      <option key={person.id} value={person.name}>{person.name}</option>
                    ))}
                    <option value="__add_new__">+ Add new person...</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Technical Owner</Label>
                <div className="flex gap-2 items-center">
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
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select person...</option>
                    {people.map(person => (
                      <option key={person.id} value={person.name}>{person.name}</option>
                    ))}
                    <option value="__add_new__">+ Add new person...</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Vendor</Label>
                <div className="flex gap-2 items-center">
                  <select
                    value={formData.vendor}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setShowAddVendorDialog(true);
                      } else {
                        updateField('vendor', e.target.value);
                      }
                    }}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="TBD">TBD</option>
                    {vendors.map(vendor => (
                      <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                    ))}
                    <option value="__add_new__">+ Add new vendor...</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Manage vendors in Settings
                </p>
              </div>
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Budget</h3>

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

              {/* Linked Program Items */}
              {programItems.length > 0 && (
                <div>
                  <Label>Linked Program Items</Label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {programItems.map(item => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.linkedProgramItems.includes(item.id)}
                          onChange={() => handleProgramItemToggle(item.id)}
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
            onClick={handleAdd}
            disabled={!isValid}
          >
            Add Solution
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
