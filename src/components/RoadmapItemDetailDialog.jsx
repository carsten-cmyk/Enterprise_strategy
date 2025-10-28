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
  { id: 'assessment', label: 'Assessment' },
  { id: 'timeline', label: 'Time & Schedule' },
  { id: 'classification', label: 'Classification' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'capabilities', label: 'Linked Capabilities' }
];

const STRATEGY_OPTIONS = [
  { value: 'maintain', label: 'Maintain', color: 'bg-emerald-600', textColor: 'text-white' },
  { value: 'enhance', label: 'Enhance', color: 'bg-amber-500', textColor: 'text-white' },
  { value: 'transform', label: 'Transform', color: 'bg-rose-600', textColor: 'text-white' },
  { value: 'new-build', label: 'New Build', color: 'bg-blue-600', textColor: 'text-white' },
  { value: 'retire', label: 'Retire', color: 'bg-gray-600', textColor: 'text-white' },
  { value: 'tbd', label: 'TBD', color: 'bg-slate-100', textColor: 'text-slate-700', border: 'border-2 border-slate-300' }
];

const PROGRESS_STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started', color: 'bg-gray-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'on-hold', label: 'On Hold', color: 'bg-orange-500' }
];

export function RoadmapItemDetailDialog({ open, onClose, onSave, roadmapItem, capabilities = [] }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    strategy: 'tbd',
    linkedCapabilities: [],

    // Assessment - NEW APPROACH: Selective inheritance
    selectedAsIsComponents: [],
    asIsUserNotes: '',
    selectedToBeComponents: [],
    toBeUserNotes: '',
    selectedBusinessImpactComponents: [],
    businessImpactUserNotes: '',
    gaps: [],

    // Timeline
    startDate: '',
    endDate: '',
    expectedStart: '',
    estimatedDuration: '',
    durationUnit: 'weeks',

    // Ownership
    owner: '',

    // Classification
    progressStatus: 'not-started'
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (roadmapItem && open) {
      // Map old values to new standardized values (backward compatibility)
      const mapOldStrategyToNew = (oldValue) => {
        const mapping = {
          'leverage': 'maintain',
          'enhance': 'enhance',
          'transform': 'transform',
          'build': 'new-build',
          'not-touched': 'tbd',
          'primary': 'maintain',
          'secondary': 'enhance'
        };
        return mapping[oldValue] || oldValue || 'tbd';
      };

      const mapOldStatusToNew = (oldValue) => {
        const mapping = {
          'planning': 'not-started',
          'in-progress': 'in-progress',
          'completed': 'completed',
          'on-hold': 'on-hold'
        };
        return mapping[oldValue] || oldValue || 'not-started';
      };

      // Data migration: If old asIs exists but no selectedAsIsComponents, migrate to ALL linked
      const migratedAsIsSelection = roadmapItem.selectedAsIsComponents
        ? roadmapItem.selectedAsIsComponents
        : (roadmapItem.asIs || roadmapItem.currentState)
          ? roadmapItem.linkedCapabilities || []
          : [];

      const migratedToBeSelection = roadmapItem.selectedToBeComponents
        ? roadmapItem.selectedToBeComponents
        : (roadmapItem.toBe || roadmapItem.desiredCapability)
          ? roadmapItem.linkedCapabilities || []
          : [];

      setFormData({
        name: roadmapItem.name || '',
        description: roadmapItem.description || '',
        strategy: mapOldStrategyToNew(roadmapItem.strategy || roadmapItem.scope),
        linkedCapabilities: roadmapItem.linkedCapabilities || [],

        // Assessment - NEW APPROACH with backward compatibility
        selectedAsIsComponents: migratedAsIsSelection,
        asIsUserNotes: roadmapItem.asIsUserNotes || '',
        selectedToBeComponents: migratedToBeSelection,
        toBeUserNotes: roadmapItem.toBeUserNotes || '',
        selectedBusinessImpactComponents: roadmapItem.selectedBusinessImpactComponents || [],
        businessImpactUserNotes: roadmapItem.businessImpactUserNotes || '',
        gaps: roadmapItem.gaps || [],

        // Timeline
        startDate: roadmapItem.startDate || '',
        endDate: roadmapItem.endDate || '',
        expectedStart: roadmapItem.expectedStart || '',
        estimatedDuration: roadmapItem.estimatedDuration || '',
        durationUnit: roadmapItem.durationUnit || 'weeks',

        // Ownership
        owner: roadmapItem.owner || '',

        // Classification
        progressStatus: mapOldStatusToNew(roadmapItem.progressStatus || roadmapItem.status)
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

  // Toggle component selection for As-Is
  const toggleAsIsComponent = (componentId) => {
    setFormData(prev => ({
      ...prev,
      selectedAsIsComponents: prev.selectedAsIsComponents.includes(componentId)
        ? prev.selectedAsIsComponents.filter(id => id !== componentId)
        : [...prev.selectedAsIsComponents, componentId]
    }));
  };

  // Toggle component selection for To-Be
  const toggleToBeComponent = (componentId) => {
    setFormData(prev => ({
      ...prev,
      selectedToBeComponents: prev.selectedToBeComponents.includes(componentId)
        ? prev.selectedToBeComponents.filter(id => id !== componentId)
        : [...prev.selectedToBeComponents, componentId]
    }));
  };

  // Toggle component selection for Business Impact
  const toggleBusinessImpactComponent = (componentId) => {
    setFormData(prev => ({
      ...prev,
      selectedBusinessImpactComponents: prev.selectedBusinessImpactComponents.includes(componentId)
        ? prev.selectedBusinessImpactComponents.filter(id => id !== componentId)
        : [...prev.selectedBusinessImpactComponents, componentId]
    }));
  };

  // Get selected components by IDs
  const getComponentsByIds = (componentIds) => {
    return componentIds
      .map(id => capabilities.find(cap => cap.id === id))
      .filter(Boolean);
  };

  // Get linked components
  const getLinkedComponents = () => {
    return capabilities.filter(cap =>
      formData.linkedCapabilities.includes(cap.id)
    );
  };

  // Generate final As-Is text from selected components + manual notes
  const generateFinalAsIs = () => {
    const components = getComponentsByIds(formData.selectedAsIsComponents);

    const componentSections = components
      .map(c => {
        const asIs = c.asIs || c.currentState || 'Not documented';
        return `**${c.displayName || c.name}**\n\n${asIs}`;
      })
      .join('\n\n---\n\n');

    const manualSection = formData.asIsUserNotes.trim()
      ? `\n\n---\n\n**Additional Notes**\n\n${formData.asIsUserNotes}`
      : '';

    return componentSections + manualSection;
  };

  // Generate final To-Be text
  const generateFinalToBe = () => {
    const components = getComponentsByIds(formData.selectedToBeComponents);

    const componentSections = components
      .map(c => {
        const toBe = c.toBe || c.desiredCapability || 'Not documented';
        return `**${c.displayName || c.name}**\n\n${toBe}`;
      })
      .join('\n\n---\n\n');

    const manualSection = formData.toBeUserNotes.trim()
      ? `\n\n---\n\n**Additional Notes**\n\n${formData.toBeUserNotes}`
      : '';

    return componentSections + manualSection;
  };

  // Generate final Business Impact text
  const generateFinalBusinessImpact = () => {
    const components = getComponentsByIds(formData.selectedBusinessImpactComponents);

    const componentSections = components
      .filter(c => c.businessImpact)
      .map(c => `**${c.displayName || c.name}**\n\n${c.businessImpact}`)
      .join('\n\n---\n\n');

    const manualSection = formData.businessImpactUserNotes.trim()
      ? `\n\n---\n\n**Additional Impact**\n\n${formData.businessImpactUserNotes}`
      : '';

    return componentSections + manualSection;
  };

  // Get available gaps from linked capabilities
  const getAvailableGaps = () => {
    const linkedCaps = getLinkedComponents();

    const allGaps = [];
    linkedCaps.forEach(cap => {
      if (cap.gaps && Array.isArray(cap.gaps)) {
        cap.gaps.forEach(gap => {
          allGaps.push({
            id: `${cap.id}-${gap.id || allGaps.length}`,
            componentId: cap.id,
            componentName: cap.displayName || cap.name,
            description: gap.description || gap
          });
        });
      }
    });

    return allGaps;
  };

  const handleGapToggle = (gapId) => {
    setFormData(prev => ({
      ...prev,
      gaps: prev.gaps.includes(gapId)
        ? prev.gaps.filter(id => id !== gapId)
        : [...prev.gaps, gapId]
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

          {/* Assessment Tab - NEW SELECTIVE INHERITANCE APPROACH */}
          {activeTab === 'assessment' && (
            <div className="space-y-8">
              {/* ========== AS-IS SECTION ========== */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">As-Is (Current State)</h3>

                {/* Component Selection */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Label>Select Components to Include:</Label>
                    {formData.selectedAsIsComponents.length > 0 && (
                      <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                        {formData.selectedAsIsComponents.length} selected
                      </span>
                    )}
                  </div>

                  {getLinkedComponents().length > 0 ? (
                    <div className="space-y-3">
                      {getLinkedComponents().map(component => (
                        <label
                          key={component.id}
                          className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.selectedAsIsComponents.includes(component.id)
                              ? 'border-teal-600 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedAsIsComponents.includes(component.id)}
                            onChange={() => toggleAsIsComponent(component.id)}
                            className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                              {component.displayName || component.name}
                            </div>
                            {(component.asIs || component.currentState) ? (
                              <p className="text-sm text-gray-600 line-clamp-3">
                                {component.asIs || component.currentState}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">No As-Is documented for this component</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-lg">
                      No components linked. Go to "Linked Capabilities" tab to link components first.
                    </p>
                  )}
                </div>

                {/* User's Additional Notes */}
                <div className="mb-4">
                  <Label className="mb-2 block">Your Additional Notes:</Label>
                  <Textarea
                    value={formData.asIsUserNotes}
                    onChange={(value) => updateField('asIsUserNotes', value)}
                    placeholder="Add your own notes about the current state..."
                    rows={3}
                  />
                </div>

                {/* Final Preview */}
                {(formData.selectedAsIsComponents.length > 0 || formData.asIsUserNotes.trim()) && (
                  <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                    <Label className="mb-2 block">Final As-Is - Preview:</Label>
                    <div className="bg-white p-4 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {generateFinalAsIs()}
                    </div>
                  </div>
                )}
              </div>

              {/* ========== TO-BE SECTION ========== */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">To-Be (Target State)</h3>

                {/* Component Selection */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Label>Select Components to Include:</Label>
                    {formData.selectedToBeComponents.length > 0 && (
                      <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                        {formData.selectedToBeComponents.length} selected
                      </span>
                    )}
                  </div>

                  {getLinkedComponents().length > 0 ? (
                    <div className="space-y-3">
                      {getLinkedComponents().map(component => (
                        <label
                          key={component.id}
                          className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.selectedToBeComponents.includes(component.id)
                              ? 'border-teal-600 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedToBeComponents.includes(component.id)}
                            onChange={() => toggleToBeComponent(component.id)}
                            className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                              {component.displayName || component.name}
                            </div>
                            {(component.toBe || component.desiredCapability) ? (
                              <p className="text-sm text-gray-600 line-clamp-3">
                                {component.toBe || component.desiredCapability}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">No To-Be documented for this component</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-lg">
                      No components linked. Go to "Linked Capabilities" tab to link components first.
                    </p>
                  )}
                </div>

                {/* User's Additional Notes */}
                <div className="mb-4">
                  <Label className="mb-2 block">Your Additional Notes:</Label>
                  <Textarea
                    value={formData.toBeUserNotes}
                    onChange={(value) => updateField('toBeUserNotes', value)}
                    placeholder="Add any additional target state not covered by the selected components..."
                    rows={3}
                  />
                </div>

                {/* Final Preview */}
                {(formData.selectedToBeComponents.length > 0 || formData.toBeUserNotes.trim()) && (
                  <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                    <Label className="mb-2 block">Final To-Be - Preview:</Label>
                    <div className="bg-white p-4 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {generateFinalToBe()}
                    </div>
                  </div>
                )}
              </div>

              {/* ========== GAP ANALYSIS (Keep existing) ========== */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gap Analysis</h3>
                <Label className="mb-3 block">Gaps (from linked capabilities)</Label>
                {(() => {
                  const availableGaps = getAvailableGaps();
                  return availableGaps.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {availableGaps.map(gap => (
                        <label
                          key={gap.id}
                          className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={formData.gaps.includes(gap.id)}
                            onChange={() => handleGapToggle(gap.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                          />
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 font-medium">{gap.componentName}</div>
                            <div className="text-sm text-gray-700">{gap.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                      No gaps available. Link capabilities with gaps in the "Linked Capabilities" tab.
                    </p>
                  );
                })()}
              </div>

              {/* ========== BUSINESS IMPACT ========== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Impact</h3>

                {/* Component Selection */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Label>Select Components to Include:</Label>
                    {formData.selectedBusinessImpactComponents.length > 0 && (
                      <span className="px-2 py-1 bg-teal-600 text-white rounded-full text-xs font-medium">
                        {formData.selectedBusinessImpactComponents.length} selected
                      </span>
                    )}
                  </div>

                  {getLinkedComponents().filter(c => c.businessImpact).length > 0 ? (
                    <div className="space-y-3">
                      {getLinkedComponents().filter(c => c.businessImpact).map(component => (
                        <label
                          key={component.id}
                          className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.selectedBusinessImpactComponents.includes(component.id)
                              ? 'border-teal-600 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-600 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedBusinessImpactComponents.includes(component.id)}
                            onChange={() => toggleBusinessImpactComponent(component.id)}
                            className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                              {component.displayName || component.name}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3">{component.businessImpact}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm p-4 bg-gray-50 rounded-lg">
                      No components with business impact documented.
                    </p>
                  )}
                </div>

                {/* User's Additional Notes */}
                <div className="mb-4">
                  <Label className="mb-2 block">Your Additional Notes:</Label>
                  <Textarea
                    value={formData.businessImpactUserNotes}
                    onChange={(value) => updateField('businessImpactUserNotes', value)}
                    placeholder="Add any additional business impact not covered by components..."
                    rows={3}
                  />
                </div>

                {/* Final Preview */}
                {(formData.selectedBusinessImpactComponents.length > 0 || formData.businessImpactUserNotes.trim()) && (
                  <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                    <Label className="mb-2 block">Final Business Impact - Preview:</Label>
                    <div className="bg-white p-4 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {generateFinalBusinessImpact()}
                    </div>
                  </div>
                )}
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
                <Label>Strategy</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {STRATEGY_OPTIONS.map(option => (
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

              <div>
                <Label>Progress Status</Label>
                <div className="flex gap-3 mt-2">
                  {PROGRESS_STATUS_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('progressStatus', option.value)}
                      className={`px-4 py-2 rounded font-medium text-sm text-white transition-all ${option.color} ${
                        formData.progressStatus === option.value
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
