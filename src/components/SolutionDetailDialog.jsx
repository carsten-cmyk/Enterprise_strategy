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

export function SolutionDetailDialog({ open, onClose, onSave, onRefresh, solution, programItems = [], plannings = [], currentPlanningId = null }) {
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

  // Pre-fill form when editing
  useEffect(() => {
    if (solution && open) {
      // Backward compatibility: migrate old field names to new structure
      const migratedAsIsProgramItems = solution.selectedAsIsProgramItems
        ? solution.selectedAsIsProgramItems
        : (solution.currentState)
          ? solution.linkedProgramItems || []
          : [];

      const migratedAsIsComponents = solution.selectedAsIsComponents
        ? solution.selectedAsIsComponents
        : [];

      const migratedToBeProgramItems = solution.selectedToBeProgramItems
        ? solution.selectedToBeProgramItems
        : (solution.desiredState)
          ? solution.linkedProgramItems || []
          : [];

      const migratedToBeComponents = solution.selectedToBeComponents
        ? solution.selectedToBeComponents
        : [];

      const migratedBusinessImpactProgramItems = solution.selectedBusinessImpactProgramItems
        ? solution.selectedBusinessImpactProgramItems
        : (solution.businessImpact)
          ? solution.linkedProgramItems || []
          : [];

      const migratedBusinessImpactComponents = solution.selectedBusinessImpactComponents
        ? solution.selectedBusinessImpactComponents
        : [];

      setFormData({
        name: solution.name || '',
        description: solution.description || '',
        group: solution.group || '',
        strategy: solution.strategy || solution.scope || 'not-touched',
        linkedProgramItems: solution.linkedProgramItems || [],

        // NEW: Context fields from Planning/Program
        businessGoal: solution.businessGoal || '',
        businessCase: solution.businessCase || '',

        // Assessment - new selective inheritance fields
        selectedAsIsProgramItems: migratedAsIsProgramItems,
        selectedAsIsComponents: migratedAsIsComponents,
        asIsUserNotes: solution.asIsUserNotes || '',
        selectedToBeProgramItems: migratedToBeProgramItems,
        selectedToBeComponents: migratedToBeComponents,
        toBeUserNotes: solution.toBeUserNotes || '',
        selectedBusinessImpactProgramItems: migratedBusinessImpactProgramItems,
        selectedBusinessImpactComponents: migratedBusinessImpactComponents,
        businessImpactUserNotes: solution.businessImpactUserNotes || '',
        gaps: solution.gaps || [],

        investmentEstimate: solution.investmentEstimate || '',

        expectedStart: solution.expectedStart || solution.expectedGoLive || '',
        estimatedDuration: solution.estimatedDuration || '',
        durationUnit: solution.durationUnit || 'weeks',
        dependencies: Array.isArray(solution.dependencies) ? solution.dependencies : [],

        businessOwner: solution.businessOwner || '',
        technicalOwner: solution.technicalOwner || '',
        vendor: solution.vendor || 'TBD',

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

  // Helper functions for selective inheritance

  // Get linked program items
  const getLinkedProgramItems = () => {
    return programItems.filter(item =>
      formData.linkedProgramItems.includes(item.id)
    );
  };

  // Get all components from linked program items
  const getComponentsFromLinkedProgramItems = () => {
    const components = [];
    const linkedItems = getLinkedProgramItems();

    linkedItems.forEach(item => {
      if (item.linkedCapabilities && Array.isArray(item.linkedCapabilities)) {
        // For now, store component info from program item
        // In a real implementation, we'd fetch the actual component objects
        item.linkedCapabilities.forEach(capId => {
          // Find capability in plannings
          plannings.forEach(planning => {
            if (planning.capabilities) {
              planning.capabilities.forEach(cap => {
                if (cap.id === capId && !components.find(c => c.id === cap.id)) {
                  components.push({
                    ...cap,
                    sourceProgramItemId: item.id,
                    sourceProgramItemName: item.name
                  });
                }
              });
            }
          });
        });
      }
    });

    return components;
  };

  // Get program items by IDs
  const getProgramItemsByIds = (itemIds) => {
    return itemIds
      .map(id => programItems.find(item => item.id === id))
      .filter(Boolean);
  };

  // Get components by IDs
  const getComponentsByIds = (componentIds) => {
    const allComponents = getComponentsFromLinkedProgramItems();
    return componentIds
      .map(id => allComponents.find(comp => comp.id === id))
      .filter(Boolean);
  };

  // Toggle functions for As-Is
  const toggleAsIsProgramItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      selectedAsIsProgramItems: prev.selectedAsIsProgramItems.includes(itemId)
        ? prev.selectedAsIsProgramItems.filter(id => id !== itemId)
        : [...prev.selectedAsIsProgramItems, itemId]
    }));
  };

  const toggleAsIsComponent = (componentId) => {
    setFormData(prev => ({
      ...prev,
      selectedAsIsComponents: prev.selectedAsIsComponents.includes(componentId)
        ? prev.selectedAsIsComponents.filter(id => id !== componentId)
        : [...prev.selectedAsIsComponents, componentId]
    }));
  };

  // Toggle functions for To-Be
  const toggleToBeProgramItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      selectedToBeProgramItems: prev.selectedToBeProgramItems.includes(itemId)
        ? prev.selectedToBeProgramItems.filter(id => id !== itemId)
        : [...prev.selectedToBeProgramItems, itemId]
    }));
  };

  const toggleToBeComponent = (componentId) => {
    setFormData(prev => ({
      ...prev,
      selectedToBeComponents: prev.selectedToBeComponents.includes(componentId)
        ? prev.selectedToBeComponents.filter(id => id !== componentId)
        : [...prev.selectedToBeComponents, componentId]
    }));
  };

  // Toggle functions for Business Impact
  const toggleBusinessImpactProgramItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      selectedBusinessImpactProgramItems: prev.selectedBusinessImpactProgramItems.includes(itemId)
        ? prev.selectedBusinessImpactProgramItems.filter(id => id !== itemId)
        : [...prev.selectedBusinessImpactProgramItems, itemId]
    }));
  };

  const toggleBusinessImpactComponent = (componentId) => {
    setFormData(prev => ({
      ...prev,
      selectedBusinessImpactComponents: prev.selectedBusinessImpactComponents.includes(componentId)
        ? prev.selectedBusinessImpactComponents.filter(id => id !== componentId)
        : [...prev.selectedBusinessImpactComponents, componentId]
    }));
  };

  // Generate final As-Is text from selected sources
  const generateFinalAsIs = () => {
    const selectedProgramItems = getProgramItemsByIds(formData.selectedAsIsProgramItems);
    const selectedComponents = getComponentsByIds(formData.selectedAsIsComponents);

    const sections = [];

    // Add program items
    selectedProgramItems.forEach(item => {
      const asIs = item.asIs || item.currentState || 'Not documented';
      sections.push(`**[Program Item] ${item.name}**\n\n${asIs}`);
    });

    // Add components
    selectedComponents.forEach(comp => {
      const asIs = comp.asIs || comp.currentState || 'Not documented';
      sections.push(`**[Component] ${comp.displayName || comp.name}**\n\n${asIs}`);
    });

    const combinedSections = sections.join('\n\n---\n\n');

    const manualSection = formData.asIsUserNotes.trim()
      ? `\n\n---\n\n**Additional Notes**\n\n${formData.asIsUserNotes}`
      : '';

    return combinedSections + manualSection;
  };

  // Generate final To-Be text
  const generateFinalToBe = () => {
    const selectedProgramItems = getProgramItemsByIds(formData.selectedToBeProgramItems);
    const selectedComponents = getComponentsByIds(formData.selectedToBeComponents);

    const sections = [];

    // Add program items
    selectedProgramItems.forEach(item => {
      const toBe = item.toBe || item.desiredCapability || 'Not documented';
      sections.push(`**[Program Item] ${item.name}**\n\n${toBe}`);
    });

    // Add components
    selectedComponents.forEach(comp => {
      const toBe = comp.toBe || comp.desiredCapability || 'Not documented';
      sections.push(`**[Component] ${comp.displayName || comp.name}**\n\n${toBe}`);
    });

    const combinedSections = sections.join('\n\n---\n\n');

    const manualSection = formData.toBeUserNotes.trim()
      ? `\n\n---\n\n**Additional Notes**\n\n${formData.toBeUserNotes}`
      : '';

    return combinedSections + manualSection;
  };

  // Generate final Business Impact text
  const generateFinalBusinessImpact = () => {
    const selectedProgramItems = getProgramItemsByIds(formData.selectedBusinessImpactProgramItems);
    const selectedComponents = getComponentsByIds(formData.selectedBusinessImpactComponents);

    const sections = [];

    // Add program items with business impact
    selectedProgramItems
      .filter(item => item.businessImpact)
      .forEach(item => {
        sections.push(`**[Program Item] ${item.name}**\n\n${item.businessImpact}`);
      });

    // Add components with business impact
    selectedComponents
      .filter(comp => comp.businessImpact)
      .forEach(comp => {
        sections.push(`**[Component] ${comp.displayName || comp.name}**\n\n${comp.businessImpact}`);
      });

    const combinedSections = sections.join('\n\n---\n\n');

    const manualSection = formData.businessImpactUserNotes.trim()
      ? `\n\n---\n\n**Additional Impact**\n\n${formData.businessImpactUserNotes}`
      : '';

    return combinedSections + manualSection;
  };

  // Get all available solutions from all plannings (excluding current solution)
  const getAvailableSolutions = () => {
    const allSolutions = [];
    plannings.forEach(planning => {
      (planning.solutions || []).forEach(sol => {
        // Exclude current solution
        if (sol.id !== solution?.id) {
          allSolutions.push({
            ...sol,
            planningId: planning.id,
            planningName: planning.name
          });
        }
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
            <div className="space-y-8">
              {/* SECTION A: Source & Sync Status - Only if from Planning */}
              {solution?.planningId && (
                <div className="pb-8 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Source & Sync Status</h3>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-700">📊 Source Planning:</span>
                      <span className="text-blue-700">
                        {plannings.find(p => p.id === solution.planningId)?.name || 'Unknown Planning'}
                      </span>
                    </div>

                    {solution.programId && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-700">📋 Program:</span>
                        <span className="text-gray-600">
                          {plannings.find(p => p.id === solution.planningId)?.program?.name || 'Unknown Program'}
                        </span>
                      </div>
                    )}

                    {solution.programItemId && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-700">🎯 Program Item:</span>
                        <span className="text-gray-600">
                          {programItems.find(pi => pi.id === solution.programItemId)?.name || 'Unknown Item'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-700">🔄 Last Synced:</span>
                      <span className="text-gray-600">
                        {solution.analysisLastSyncedAt
                          ? new Date(solution.analysisLastSyncedAt).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Never synced'}
                      </span>
                    </div>

                    {/* Warning banner if outdated or never synced */}
                    {(!solution.analysisLastSyncedAt ||
                      new Date() - new Date(solution.analysisLastSyncedAt) > 24 * 60 * 60 * 1000) && (
                      <div className="mt-3 pt-3 border-t border-blue-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-700">
                            <span>⚠️</span>
                            <span className="text-sm font-medium">
                              {!solution.analysisLastSyncedAt
                                ? 'Not yet synced from Planning'
                                : 'Data may be outdated'}
                            </span>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              const confirmed = window.confirm(
                                'Refresh Analysis Data\n\n' +
                                'This will update analysis data from the Planning Session.\n\n' +
                                '⚠️ Your manual edits will be REPLACED:\n' +
                                '- Business Goal\n' +
                                '- Business Case\n' +
                                '- As-Is / To-Be / Business Impact assessments\n' +
                                '- Gaps list\n\n' +
                                '✓ Execution data will be PRESERVED:\n' +
                                '- Timeline, budget, status\n' +
                                '- Actions, ownership\n' +
                                '- Custom notes\n\n' +
                                'Do you want to continue?'
                              );

                              if (confirmed && onRefresh) {
                                onRefresh(solution.id);
                                // Reload the solution data after refresh
                                handleClose();
                              }
                            }}
                          >
                            Refresh from Planning
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION B: Business Context */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Context</h3>

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

                  {solution?.planningId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        ℹ️ These fields are inherited from Planning/Program and can be edited for this specific project.
                      </p>
                    </div>
                  )}

                  {/* Components Affected - only if from planning */}
                  {solution?.planningId && getLinkedProgramItems().length > 0 && (
                    <div className="mt-4">
                      <Label>🧩 Components Affected (from Planning)</Label>
                      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {getLinkedProgramItems().map(item => {
                            const capability = (currentPlanningId && plannings.find(p => p.id === currentPlanningId)?.level0Columns || [])
                              .flatMap(col => col.components || [])
                              .find(comp => item.linkedCapabilities?.includes(comp.id));

                            return (
                              <li key={item.id}>
                                <span className="font-medium">{item.name}</span>
                                {capability && (
                                  <span className="text-gray-500"> → {capability.name}</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION C: Assessment (Existing) */}
              {/* AS-IS SECTION */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">As-Is (Current State)</h3>

                {getLinkedProgramItems().length === 0 ? (
                  <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-lg">
                    No program items linked. Go to "Classification" tab to link program items first.
                  </p>
                ) : (
                  <>
                    {/* Program Items Selection */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Label>Select Program Items to Include:</Label>
                        {formData.selectedAsIsProgramItems.length > 0 && (
                          <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                            {formData.selectedAsIsProgramItems.length} selected
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        {getLinkedProgramItems().map(item => (
                          <label
                            key={item.id}
                            className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.selectedAsIsProgramItems.includes(item.id)
                                ? 'border-teal-600 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedAsIsProgramItems.includes(item.id)}
                              onChange={() => toggleAsIsProgramItem(item.id)}
                              className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">[Program Item] {item.name}</div>
                              {(item.asIs || item.currentState) ? (
                                <p className="text-sm text-gray-600 line-clamp-3">
                                  {item.asIs || item.currentState}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400 italic">No As-Is documented</p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Components Selection */}
                    {getComponentsFromLinkedProgramItems().length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Label>Select Components to Include:</Label>
                          {formData.selectedAsIsComponents.length > 0 && (
                            <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                              {formData.selectedAsIsComponents.length} selected
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          {getComponentsFromLinkedProgramItems().map(comp => (
                            <label
                              key={comp.id}
                              className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.selectedAsIsComponents.includes(comp.id)
                                  ? 'border-teal-600 bg-teal-50'
                                  : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.selectedAsIsComponents.includes(comp.id)}
                                onChange={() => toggleAsIsComponent(comp.id)}
                                className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 mb-1">
                                  [Component] {comp.displayName || comp.name}
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                  From: {comp.sourceProgramItemName}
                                </div>
                                {(comp.asIs || comp.currentState) ? (
                                  <p className="text-sm text-gray-600 line-clamp-3">
                                    {comp.asIs || comp.currentState}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">No As-Is documented</p>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preview of Selected Sources */}
                    {(formData.selectedAsIsProgramItems.length > 0 || formData.selectedAsIsComponents.length > 0) && (
                      <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                        <Label className="mb-3 block">Selected Sources Preview:</Label>
                        <div className="space-y-3">
                          {getProgramItemsByIds(formData.selectedAsIsProgramItems).map(item => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-md p-3">
                              <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
                                <strong className="text-teal-700 text-sm">[Program Item] {item.name}</strong>
                                <button
                                  onClick={() => toggleAsIsProgramItem(item.id)}
                                  className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                                  title="Remove from selection"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                {item.asIs || item.currentState || <em className="text-gray-400">Not documented</em>}
                              </div>
                            </div>
                          ))}
                          {getComponentsByIds(formData.selectedAsIsComponents).map(comp => (
                            <div key={comp.id} className="bg-white border border-gray-200 rounded-md p-3">
                              <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
                                <strong className="text-teal-700 text-sm">[Component] {comp.displayName || comp.name}</strong>
                                <button
                                  onClick={() => toggleAsIsComponent(comp.id)}
                                  className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                                  title="Remove from selection"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                {comp.asIs || comp.currentState || <em className="text-gray-400">Not documented</em>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manual Notes */}
                    <div className="mb-4">
                      <Label className="mb-2 block">Additional As-Is Notes (Optional):</Label>
                      <Textarea
                        value={formData.asIsUserNotes}
                        onChange={(value) => updateField('asIsUserNotes', value)}
                        placeholder="Add any additional context not covered by selected sources..."
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1 italic">
                        These notes will be appended after the selected sources
                      </p>
                    </div>

                    {/* Final Combined Preview */}
                    {(formData.selectedAsIsProgramItems.length > 0 || formData.selectedAsIsComponents.length > 0 || formData.asIsUserNotes.trim()) && (
                      <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                        <Label className="mb-2 block">Final As-Is (Read-only Preview):</Label>
                        <div className="bg-white p-4 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                          {generateFinalAsIs()}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">
                          This is how the As-Is will appear in reports and to users
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* TO-BE SECTION */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">To-Be (Desired State)</h3>

                {getLinkedProgramItems().length === 0 ? (
                  <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-lg">
                    No program items linked. Go to "Classification" tab to link program items first.
                  </p>
                ) : (
                  <>
                    {/* Program Items Selection */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Label>Select Program Items to Include:</Label>
                        {formData.selectedToBeProgramItems.length > 0 && (
                          <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                            {formData.selectedToBeProgramItems.length} selected
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        {getLinkedProgramItems().map(item => (
                          <label
                            key={item.id}
                            className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.selectedToBeProgramItems.includes(item.id)
                                ? 'border-teal-600 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedToBeProgramItems.includes(item.id)}
                              onChange={() => toggleToBeProgramItem(item.id)}
                              className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">[Program Item] {item.name}</div>
                              {(item.toBe || item.desiredCapability) ? (
                                <p className="text-sm text-gray-600 line-clamp-3">
                                  {item.toBe || item.desiredCapability}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400 italic">No To-Be documented</p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Components Selection */}
                    {getComponentsFromLinkedProgramItems().length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Label>Select Components to Include:</Label>
                          {formData.selectedToBeComponents.length > 0 && (
                            <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                              {formData.selectedToBeComponents.length} selected
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          {getComponentsFromLinkedProgramItems().map(comp => (
                            <label
                              key={comp.id}
                              className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.selectedToBeComponents.includes(comp.id)
                                  ? 'border-teal-600 bg-teal-50'
                                  : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.selectedToBeComponents.includes(comp.id)}
                                onChange={() => toggleToBeComponent(comp.id)}
                                className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 mb-1">
                                  [Component] {comp.displayName || comp.name}
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                  From: {comp.sourceProgramItemName}
                                </div>
                                {(comp.toBe || comp.desiredCapability) ? (
                                  <p className="text-sm text-gray-600 line-clamp-3">
                                    {comp.toBe || comp.desiredCapability}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">No To-Be documented</p>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preview of Selected Sources */}
                    {(formData.selectedToBeProgramItems.length > 0 || formData.selectedToBeComponents.length > 0) && (
                      <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                        <Label className="mb-3 block">Selected Sources Preview:</Label>
                        <div className="space-y-3">
                          {getProgramItemsByIds(formData.selectedToBeProgramItems).map(item => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-md p-3">
                              <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
                                <strong className="text-teal-700 text-sm">[Program Item] {item.name}</strong>
                                <button
                                  onClick={() => toggleToBeProgramItem(item.id)}
                                  className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                                  title="Remove from selection"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                {item.toBe || item.desiredCapability || <em className="text-gray-400">Not documented</em>}
                              </div>
                            </div>
                          ))}
                          {getComponentsByIds(formData.selectedToBeComponents).map(comp => (
                            <div key={comp.id} className="bg-white border border-gray-200 rounded-md p-3">
                              <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
                                <strong className="text-teal-700 text-sm">[Component] {comp.displayName || comp.name}</strong>
                                <button
                                  onClick={() => toggleToBeComponent(comp.id)}
                                  className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                                  title="Remove from selection"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                {comp.toBe || comp.desiredCapability || <em className="text-gray-400">Not documented</em>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manual Notes */}
                    <div className="mb-4">
                      <Label className="mb-2 block">Additional To-Be Notes (Optional):</Label>
                      <Textarea
                        value={formData.toBeUserNotes}
                        onChange={(value) => updateField('toBeUserNotes', value)}
                        placeholder="Add any additional context not covered by selected sources..."
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1 italic">
                        These notes will be appended after the selected sources
                      </p>
                    </div>

                    {/* Final Combined Preview */}
                    {(formData.selectedToBeProgramItems.length > 0 || formData.selectedToBeComponents.length > 0 || formData.toBeUserNotes.trim()) && (
                      <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                        <Label className="mb-2 block">Final To-Be (Read-only Preview):</Label>
                        <div className="bg-white p-4 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                          {generateFinalToBe()}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">
                          This is how the To-Be will appear in reports and to users
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* GAP ANALYSIS SECTION */}
              <div className="pb-8 border-b border-gray-200">
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

              {/* BUSINESS IMPACT SECTION */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Impact</h3>

                {getLinkedProgramItems().length === 0 ? (
                  <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-lg">
                    No program items linked. Go to "Classification" tab to link program items first.
                  </p>
                ) : (
                  <>
                    {/* Program Items Selection */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Label>Select Program Items to Include:</Label>
                        {formData.selectedBusinessImpactProgramItems.length > 0 && (
                          <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                            {formData.selectedBusinessImpactProgramItems.length} selected
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        {getLinkedProgramItems()
                          .filter(item => item.businessImpact)
                          .map(item => (
                            <label
                              key={item.id}
                              className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.selectedBusinessImpactProgramItems.includes(item.id)
                                  ? 'border-teal-600 bg-teal-50'
                                  : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.selectedBusinessImpactProgramItems.includes(item.id)}
                                onChange={() => toggleBusinessImpactProgramItem(item.id)}
                                className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 mb-1">[Program Item] {item.name}</div>
                                <p className="text-sm text-gray-600 line-clamp-3">{item.businessImpact}</p>
                              </div>
                            </label>
                          ))}
                      </div>
                      {getLinkedProgramItems().filter(item => item.businessImpact).length === 0 && (
                        <p className="text-sm text-gray-500 italic">No linked program items have business impact documented.</p>
                      )}
                    </div>

                    {/* Components Selection */}
                    {getComponentsFromLinkedProgramItems().filter(comp => comp.businessImpact).length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Label>Select Components to Include:</Label>
                          {formData.selectedBusinessImpactComponents.length > 0 && (
                            <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                              {formData.selectedBusinessImpactComponents.length} selected
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          {getComponentsFromLinkedProgramItems()
                            .filter(comp => comp.businessImpact)
                            .map(comp => (
                              <label
                                key={comp.id}
                                className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  formData.selectedBusinessImpactComponents.includes(comp.id)
                                    ? 'border-teal-600 bg-teal-50'
                                    : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.selectedBusinessImpactComponents.includes(comp.id)}
                                  onChange={() => toggleBusinessImpactComponent(comp.id)}
                                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 mb-1">
                                    [Component] {comp.displayName || comp.name}
                                  </div>
                                  <div className="text-xs text-gray-500 mb-1">
                                    From: {comp.sourceProgramItemName}
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-3">{comp.businessImpact}</p>
                                </div>
                              </label>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Preview of Selected Sources */}
                    {(formData.selectedBusinessImpactProgramItems.length > 0 || formData.selectedBusinessImpactComponents.length > 0) && (
                      <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                        <Label className="mb-3 block">Selected Sources Preview:</Label>
                        <div className="space-y-3">
                          {getProgramItemsByIds(formData.selectedBusinessImpactProgramItems)
                            .filter(item => item.businessImpact)
                            .map(item => (
                              <div key={item.id} className="bg-white border border-gray-200 rounded-md p-3">
                                <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
                                  <strong className="text-teal-700 text-sm">[Program Item] {item.name}</strong>
                                  <button
                                    onClick={() => toggleBusinessImpactProgramItem(item.id)}
                                    className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                                    title="Remove from selection"
                                  >
                                    ×
                                  </button>
                                </div>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {item.businessImpact}
                                </div>
                              </div>
                            ))}
                          {getComponentsByIds(formData.selectedBusinessImpactComponents)
                            .filter(comp => comp.businessImpact)
                            .map(comp => (
                              <div key={comp.id} className="bg-white border border-gray-200 rounded-md p-3">
                                <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100">
                                  <strong className="text-teal-700 text-sm">[Component] {comp.displayName || comp.name}</strong>
                                  <button
                                    onClick={() => toggleBusinessImpactComponent(comp.id)}
                                    className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                                    title="Remove from selection"
                                  >
                                    ×
                                  </button>
                                </div>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {comp.businessImpact}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Manual Notes */}
                    <div className="mb-4">
                      <Label className="mb-2 block">Additional Business Impact Notes (Optional):</Label>
                      <Textarea
                        value={formData.businessImpactUserNotes}
                        onChange={(value) => updateField('businessImpactUserNotes', value)}
                        placeholder="Add any additional business impact not covered by selected sources..."
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1 italic">
                        These notes will be appended after the selected sources
                      </p>
                    </div>

                    {/* Final Combined Preview */}
                    {(formData.selectedBusinessImpactProgramItems.length > 0 || formData.selectedBusinessImpactComponents.length > 0 || formData.businessImpactUserNotes.trim()) && (
                      <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                        <Label className="mb-2 block">Final Business Impact (Read-only Preview):</Label>
                        <div className="bg-white p-4 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                          {generateFinalBusinessImpact()}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">
                          This is how the Business Impact will appear in reports and to users
                        </p>
                      </div>
                    )}
                  </>
                )}
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
