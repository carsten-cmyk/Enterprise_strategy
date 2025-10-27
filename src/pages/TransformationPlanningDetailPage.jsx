import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Calendar, User, FileText, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AddLevel0ColumnDialog } from '../components/AddLevel0ColumnDialog';
import { AddComponentDialog } from '../components/AddComponentDialog';
import { ComponentDetailDialog } from '../components/ComponentDetailDialog';
import { CreatePlanningDialog } from '../components/CreatePlanningDialog';
import { AddRoadmapItemDialog } from '../components/AddRoadmapItemDialog';
import { RoadmapItemDetailDialog } from '../components/RoadmapItemDetailDialog';
import { AddSolutionDialog } from '../components/AddSolutionDialog';
import { SolutionDetailDialog } from '../components/SolutionDetailDialog';
import { CapabilityReportDialog } from '../components/CapabilityReportDialog';
import { useTransformationPlanning } from '../data/transformationPlanningStore';

export function TransformationPlanningDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
  const [showEditColumnDialog, setShowEditColumnDialog] = useState(false);
  const [showAddComponentDialog, setShowAddComponentDialog] = useState(false);
  const [showComponentDetailDialog, setShowComponentDetailDialog] = useState(false);
  const [showEditBusinessGoalDialog, setShowEditBusinessGoalDialog] = useState(false);
  const [showAddRoadmapItemDialog, setShowAddRoadmapItemDialog] = useState(false);
  const [showRoadmapItemDetailDialog, setShowRoadmapItemDetailDialog] = useState(false);
  const [showAddSolutionDialog, setShowAddSolutionDialog] = useState(false);
  const [showSolutionDetailDialog, setShowSolutionDetailDialog] = useState(false);
  const [showCapabilityReportDialog, setShowCapabilityReportDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedComponentPath, setSelectedComponentPath] = useState([]);
  const [selectedRoadmapItem, setSelectedRoadmapItem] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedCapabilityForReport, setSelectedCapabilityForReport] = useState(null);
  const [expandedComponents, setExpandedComponents] = useState({}); // Track which components are expanded

  const {
    getPlanning,
    addLevel0Column,
    updateLevel0Column,
    deleteLevel0Column,
    addComponent,
    deleteComponent,
    updateComponent,
    addSubcomponent,
    deleteSubcomponent,
    updateSubcomponent,
    updateBusinessGoal,
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    addSolution,
    updateSolution,
    deleteSolution
  } = useTransformationPlanning();

  const planning = getPlanning(id);

  // Helper function to collect all components from all level0 columns (including nested subcomponents)
  const getAllComponents = () => {
    if (!planning || !planning.level0Columns) return [];

    const collectComponentsRecursively = (component, columnName) => {
      const result = [{
        ...component,
        columnName,
        displayName: `${columnName} > ${component.name}`
      }];

      if (component.subcomponents && component.subcomponents.length > 0) {
        component.subcomponents.forEach(subcomp => {
          result.push(...collectComponentsRecursively(subcomp, columnName));
        });
      }

      return result;
    };

    const allComponents = [];
    planning.level0Columns.forEach(column => {
      if (column.components && column.components.length > 0) {
        column.components.forEach(comp => {
          allComponents.push(...collectComponentsRecursively(comp, column.name));
        });
      }
    });

    return allComponents;
  };

  // Helper function to toggle component expansion
  const toggleComponentExpansion = (componentId) => {
    setExpandedComponents(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  };

  // Download structured text report
  const downloadTextReport = () => {
    if (!planning) return;

    const strategyLabels = {
      'primary': 'Primary',
      'secondary': 'Secondary',
      'not-touched': 'Not Touched',
      'leverage': 'Maintain',
      'enhance': 'Uplift',
      'transform': 'Transform',
      'build': 'New build'
    };

    const priorityLabels = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };

    // Recursive function to format components and subcomponents
    const formatComponent = (component, indent = '    ') => {
      let text = '';
      text += `${indent}Component Name: ${component.name || 'N/A'}\n`;
      text += `${indent}Description: ${component.description || 'N/A'}\n`;
      text += `${indent}Strategy: ${strategyLabels[component.support || component.scope] || 'N/A'}\n`;
      text += `${indent}Priority: ${priorityLabels[component.priority] || 'N/A'}\n`;
      text += `${indent}Assessment Current State (As-Is): ${component.currentState || 'N/A'}\n`;
      text += `${indent}Desired Capability (To-Be): ${component.desiredState || 'N/A'}\n`;

      // Gap Analysis
      if (component.gaps && component.gaps.length > 0) {
        text += `${indent}Gap Analysis:\n`;
        component.gaps.forEach((gap, idx) => {
          text += `${indent}  ${idx + 1}. ${gap.description || 'N/A'}\n`;
        });
      } else {
        text += `${indent}Gap Analysis: N/A\n`;
      }

      text += `${indent}Business Impact: ${component.businessImpact || 'N/A'}\n`;

      // Subcomponents
      if (component.subcomponents && component.subcomponents.length > 0) {
        text += `${indent}Subcomponents:\n`;
        component.subcomponents.forEach((subcomp, idx) => {
          text += `${indent}  ${idx + 1}.\n`;
          text += formatComponent(subcomp, indent + '    ');
        });
      }

      return text;
    };

    let content = '';

    // Header
    content += '=====================================\n';
    content += `TRANSFORMATION PLANNING REPORT\n`;
    content += `${planning.name}\n`;
    content += '=====================================\n\n';

    // Business Goal
    content += '1. BUSINESS GOAL\n';
    content += '-----------------------------------\n';
    content += `${planning.businessGoal || 'No business goal defined'}\n\n`;

    // Current State
    content += '2. CURRENT STATE\n';
    content += '-----------------------------------\n';
    content += `${planning.currentState || 'No current state defined'}\n\n`;

    // Desired State
    content += '3. DESIRED STATE\n';
    content += '-----------------------------------\n';
    content += `${planning.desiredState || 'No desired state defined'}\n\n`;

    // Process Deep Dive 2
    content += '4. PROCESS DEEP DIVE 2\n';
    content += '-----------------------------------\n\n';

    if (planning.level0Columns && planning.level0Columns.length > 0) {
      planning.level0Columns.forEach((column, colIdx) => {
        content += `${colIdx + 1}. Level 0 Capability: ${column.name}\n`;
        content += `   Description: ${column.description || 'N/A'}\n\n`;

        if (column.components && column.components.length > 0) {
          content += `   Components:\n\n`;
          column.components.forEach((component, compIdx) => {
            content += `   ${compIdx + 1}.\n`;
            content += formatComponent(component);
            content += '\n';
          });
        } else {
          content += `   No components\n\n`;
        }
      });
    } else {
      content += 'No Level 0 capabilities defined\n';
    }

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${planning.name.replace(/[^a-z0-9]/gi, '_')}_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Recursive Component Renderer
  const ComponentCard = ({ component, column, path = [], level = 0 }) => {
    const support = component.support || component.scope || 'leverage';
    const priority = component.priority || 'medium';
    const hasSubcomponents = component.subcomponents && component.subcomponents.length > 0;
    const isExpanded = expandedComponents[component.id];
    const currentPath = [...path, component.id];

    // Map support to colors
    const getSupportColor = () => {
      switch(support) {
        case 'primary': return { bg: 'bg-teal-600', border: 'border-teal-700', text: 'text-white', textLight: 'text-teal-50' };
        case 'secondary': return { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-900', textLight: 'text-teal-800' };
        case 'not-touched': return { bg: 'bg-gray-200', border: 'border-gray-300', text: 'text-gray-700', textLight: 'text-gray-600' };
        // Legacy support for old values
        case 'leverage': return { bg: 'bg-teal-600', border: 'border-teal-700', text: 'text-white', textLight: 'text-teal-50' };
        case 'enhance': return { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-900', textLight: 'text-teal-800' };
        case 'transform': return { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-900', textLight: 'text-teal-800' };
        case 'build': return { bg: 'bg-teal-600', border: 'border-teal-700', text: 'text-white', textLight: 'text-teal-50' };
        default: return { bg: 'bg-teal-600', border: 'border-teal-700', text: 'text-white', textLight: 'text-teal-50' };
      }
    };

    const colors = getSupportColor();

    return (
      <div className="space-y-2">
        <div
          className={`rounded p-2 text-xs border hover:shadow-sm transition-all ${colors.bg} ${colors.border}`}
          style={{ marginLeft: `${level * 12}px` }}
        >
          {/* Header with expand/collapse and title */}
          <div className="flex items-start gap-2 mb-2">
            {/* Expand/Collapse button */}
            {hasSubcomponents ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComponentExpansion(component.id);
                }}
                className={`flex-shrink-0 mt-0.5 ${colors.text} hover:opacity-80`}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <div className="w-3.5 flex-shrink-0" />
            )}

            {/* Component title */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => {
                setSelectedColumn(column);
                setSelectedComponent(component);
                setSelectedComponentPath(currentPath);
                setShowComponentDetailDialog(true);
              }}
            >
              <div className={`font-medium ${colors.text}`}>
                {component.name}
              </div>
            </div>
          </div>

          {/* Component content */}
          <div
            className="cursor-pointer"
            onClick={() => {
              setSelectedColumn(column);
              setSelectedComponent(component);
              setSelectedComponentPath(currentPath);
              setShowComponentDetailDialog(true);
            }}
          >
            {component.description && (
              <div className={`mb-2 line-clamp-2 text-xs ${colors.textLight}`}>
                {component.description}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2 items-center">
                {priority && (
                  <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-white bg-opacity-90 text-gray-900">
                    {priority === 'high' ? 'High' : priority === 'medium' ? 'Medium' : 'Low'}
                  </span>
                )}
                {hasSubcomponents && (
                  <span className={`text-xs ${colors.textLight}`}>
                    {component.subcomponents.length} subcomponent{component.subcomponents.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {level < 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColumn(column);
                      setSelectedComponent(component);
                      setSelectedComponentPath(currentPath);
                      setShowAddComponentDialog(true);
                    }}
                    className={`${colors.textLight} hover:text-white`}
                    title="Add subcomponent"
                  >
                    <Plus size={14} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Er du sikker på at du vil slette "${component.name}"?`)) {
                      if (path.length === 0) {
                        deleteComponent(id, column.id, component.id);
                      } else {
                        deleteSubcomponent(id, column.id, currentPath);
                      }
                    }
                  }}
                  className={`${colors.textLight} hover:text-white`}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* Add subcomponent button - shown when expanded and level < 3 */}
          {isExpanded && level < 2 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColumn(column);
                setSelectedComponent(component);
                setSelectedComponentPath(currentPath);
                setShowAddComponentDialog(true);
              }}
              className={`mt-2 w-full text-xs py-1 px-2 rounded border border-dashed ${colors.textLight} hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors flex items-center justify-center gap-1`}
            >
              <Plus size={12} />
              Add subcomponent
            </button>
          )}
        </div>

        {/* Render subcomponents recursively */}
        {isExpanded && hasSubcomponents && (
          <div className="space-y-2">
            {component.subcomponents.map(subComp => (
              <ComponentCard
                key={subComp.id}
                component={subComp}
                column={column}
                path={currentPath}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!planning) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Planning ikke fundet
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/transformation-planning')}
          className="mt-4"
        >
          Tilbage til oversigt
        </Button>
      </div>
    );
  }

  const handleAddColumn = (name) => {
    addLevel0Column(id, name);
  };

  const handleDeleteColumn = (columnId, columnName) => {
    if (window.confirm(`Er du sikker på at du vil slette "${columnName}" og alle dens components?`)) {
      deleteLevel0Column(id, columnId);
    }
  };

  const handleAddComponentClick = (column) => {
    setSelectedColumn(column);
    setSelectedComponent(null);
    setSelectedComponentPath([]);
    setShowAddComponentDialog(true);
  };

  const handleAddComponent = (component) => {
    if (selectedColumn) {
      if (selectedComponentPath.length === 0) {
        // Adding a root-level component
        addComponent(id, selectedColumn.id, component);
      } else {
        // Adding a subcomponent
        addSubcomponent(id, selectedColumn.id, selectedComponentPath, component);
      }
    }
  };

  const handleDeleteComponent = (columnId, componentId, componentName) => {
    if (window.confirm(`Er du sikker på at du vil slette "${componentName}"?`)) {
      deleteComponent(id, columnId, componentId);
    }
  };

  const handleEditBusinessGoal = (updates) => {
    updateBusinessGoal(id, updates);
  };

  const handleComponentClick = (column, component) => {
    setSelectedColumn(column);
    setSelectedComponent(component);
    setShowComponentDetailDialog(true);
  };

  const handleUpdateComponent = (updates) => {
    if (selectedColumn && selectedComponent) {
      if (selectedComponentPath.length === 0 || selectedComponentPath.length === 1) {
        // Root level component
        updateComponent(id, selectedColumn.id, selectedComponent.id, updates);
      } else {
        // Nested subcomponent
        updateSubcomponent(id, selectedColumn.id, selectedComponentPath, updates);
      }
    }
  };

  const handleEditColumnClick = (column) => {
    setSelectedColumn(column);
    setShowEditColumnDialog(true);
  };

  const handleUpdateColumn = (updates) => {
    if (selectedColumn) {
      updateLevel0Column(id, selectedColumn.id, updates);
    }
  };

  // Roadmap Item handlers
  const handleAddRoadmapItem = (roadmapItem) => {
    addRoadmapItem(id, roadmapItem);
  };

  const handleRoadmapItemClick = (item) => {
    setSelectedRoadmapItem(item);
    setShowRoadmapItemDetailDialog(true);
  };

  const handleUpdateRoadmapItem = (updates) => {
    if (selectedRoadmapItem) {
      updateRoadmapItem(id, selectedRoadmapItem.id, updates);
    }
  };

  const handleDeleteRoadmapItem = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      deleteRoadmapItem(id, itemId);
    }
  };

  // Solution handlers
  const handleAddSolution = (solution) => {
    addSolution(id, solution);
  };

  const handleSolutionClick = (solution) => {
    setSelectedSolution(solution);
    setShowSolutionDetailDialog(true);
  };

  const handleUpdateSolution = (updates) => {
    if (selectedSolution) {
      updateSolution(id, selectedSolution.id, updates);
    }
  };

  const handleDeleteSolution = (solutionId, solutionName) => {
    if (window.confirm(`Are you sure you want to delete "${solutionName}"?`)) {
      deleteSolution(id, solutionId);
    }
  };

  // Capability Report handler
  const handleViewCapabilityReport = (column) => {
    setSelectedCapabilityForReport(column);
    setShowCapabilityReportDialog(true);
  };

  return (
    <div className="p-8">
      {/* Header with back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/transformation-planning')}
          className="mb-4 -ml-2 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h1 className="text-3xl font-bold text-gray-900">{planning.name}</h1>
            {planning.businessGoal?.description && (
              <p className="text-gray-600 mt-2 text-base">
                {planning.businessGoal.description}
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowEditBusinessGoalDialog(true)}
            className="flex items-center gap-2 flex-shrink-0"
            size="sm"
          >
            <Edit size={16} />
            Edit business goal
          </Button>
        </div>
      </div>

      {/* Current & Desired State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Current State
          </h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">
            {planning.businessGoal?.currentState || 'Ikke defineret'}
          </p>

          {/* Current Maturity Progress */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Current Maturity
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => {
                const currentMaturity = planning.businessGoal?.currentMaturity || 1;
                const isActive = level <= currentMaturity;
                const getColor = () => {
                  if (!isActive) return 'bg-gray-200';
                  if (level <= 2) return 'bg-rose-600';
                  if (level === 3) return 'bg-amber-500';
                  return 'bg-emerald-600';
                };
                return (
                  <div key={level} className={`w-4 h-4 rounded ${getColor()}`} />
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Desired State
          </h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">
            {planning.businessGoal?.desiredState || 'Ikke defineret'}
          </p>

          {/* Desired Maturity Progress */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Target Maturity
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => {
                const desiredMaturity = planning.businessGoal?.desiredMaturity || 5;
                const isActive = level <= desiredMaturity;
                const getColor = () => {
                  if (!isActive) return 'bg-gray-200';
                  if (level <= 2) return 'bg-rose-600';
                  if (level === 3) return 'bg-amber-500';
                  return 'bg-emerald-600';
                };
                return (
                  <div key={level} className={`w-4 h-4 rounded ${getColor()}`} />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Process Deep Dive Section - Horizontal Swimlanes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Process deep dive 2</h2>
            <p className="text-sm text-gray-600 mt-1">Processes affected by business goals</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={downloadTextReport}
              className="flex items-center gap-2"
              size="sm"
            >
              <Download size={18} />
              Download
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowAddColumnDialog(true)}
              className="flex items-center gap-2"
              size="sm"
            >
              <Plus size={18} />
              Add new
            </Button>
          </div>
        </div>

        {planning.level0Columns?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Ingen Level 0 capabilities tilføjet endnu</p>
            <Button
              variant="secondary"
              onClick={() => setShowAddColumnDialog(true)}
              className="inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Tilføj Din Første Level 0 Capability
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
              {planning.level0Columns.map(column => (
                <div
                  key={column.id}
                  className="w-[240px] flex-shrink-0 border border-gray-200 rounded-lg bg-gray-50"
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-gray-200 bg-white rounded-t-lg">
                    {/* Title section */}
                    <div className="mb-2">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {column.name}
                      </h3>
                      {column.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {column.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom section with component count and actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {column.components?.length || 0} components
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewCapabilityReport(column)}
                          className="text-gray-400 hover:text-blue-600"
                          title="View Detail Report"
                        >
                          <FileText size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditColumnClick(column)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteColumn(column.id, column.name)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Column Content - Components stacked vertically */}
                  <div className="p-3 space-y-2 min-h-[200px] max-h-[600px] overflow-y-auto">
                    {column.components?.length > 0 ? (
                      column.components.map(comp => (
                        <ComponentCard
                          key={comp.id}
                          component={comp}
                          column={column}
                          path={[]}
                          level={0}
                        />
                      ))
                    ) : (
                      <div className="text-xs text-gray-500 italic text-center py-8">
                        No components
                      </div>
                    )}

                    {/* Add Component Button at bottom of column */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddComponentClick(column)}
                      className="w-full flex items-center justify-center gap-1 text-xs"
                    >
                      <Plus size={14} />
                      Add component
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Roadmap Items Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Roadmap Items</h2>
          <Button
            variant="primary"
            onClick={() => setShowAddRoadmapItemDialog(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus size={18} />
            Add Roadmap Item
          </Button>
        </div>

        {planning.roadmapItems?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No roadmap items yet</p>
            <Button
              variant="secondary"
              onClick={() => setShowAddRoadmapItemDialog(true)}
              className="inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Roadmap Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planning.roadmapItems.map(item => {
              const scope = item.scope || 'not-touched';

              // Map scope to colors
              const getScopeColor = () => {
                switch(scope) {
                  case 'leverage': return { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50' };
                  case 'enhance': return { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50' };
                  case 'transform': return { bg: 'bg-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50' };
                  case 'build': return { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50' };
                  case 'not-touched': return { bg: 'bg-slate-300', text: 'text-slate-600', lightBg: 'bg-slate-50' };
                  default: return { bg: 'bg-slate-300', text: 'text-slate-600', lightBg: 'bg-slate-50' };
                }
              };

              const getStatusColor = () => {
                switch(item.status) {
                  case 'planning': return 'bg-gray-500';
                  case 'in-progress': return 'bg-blue-500';
                  case 'completed': return 'bg-green-500';
                  case 'on-hold': return 'bg-orange-500';
                  default: return 'bg-gray-400';
                }
              };

              const getStatusLabel = () => {
                switch(item.status) {
                  case 'planning': return 'Planning';
                  case 'in-progress': return 'In Progress';
                  case 'completed': return 'Completed';
                  case 'on-hold': return 'On Hold';
                  default: return 'Unknown';
                }
              };

              const colors = getScopeColor();
              const linkedCapabilitiesCount = item.linkedCapabilities?.length || 0;

              return (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                  onClick={() => handleRoadmapItemClick(item)}
                >
                  {/* Color indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg ${colors.bg}`} />

                  {/* Header */}
                  <div className="flex items-start justify-between mt-2 mb-3">
                    <h3 className="font-semibold text-gray-900 flex-1 pr-2">{item.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoadmapItem(item.id, item.name);
                      }}
                      className="text-gray-400 hover:text-red-600 -mt-1 -mr-1"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor()}`}>
                      {getStatusLabel()}
                    </span>
                  </div>

                  {/* Dates */}
                  {(item.startDate || item.endDate) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar size={14} />
                      <span>
                        {item.startDate && new Date(item.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {item.startDate && item.endDate && ' - '}
                        {item.endDate && new Date(item.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {/* Owner */}
                  {item.owner && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <User size={14} />
                      <span>{item.owner}</span>
                    </div>
                  )}

                  {/* Linked Capabilities Count */}
                  {linkedCapabilitiesCount > 0 && (
                    <div className={`text-xs font-medium ${colors.text} ${colors.lightBg} px-2 py-1 rounded inline-block`}>
                      {linkedCapabilitiesCount} linked {linkedCapabilitiesCount === 1 ? 'capability' : 'capabilities'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Solutions Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Solutions & Projects</h2>
          <Button
            variant="primary"
            onClick={() => setShowAddSolutionDialog(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus size={18} />
            Add Solution
          </Button>
        </div>

        {planning.solutions?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No solutions or projects yet</p>
            <Button
              variant="secondary"
              onClick={() => setShowAddSolutionDialog(true)}
              className="inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Solution
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planning.solutions.map(solution => {
              const scope = solution.scope || 'not-touched';

              // Map scope to colors
              const getScopeColor = () => {
                switch(scope) {
                  case 'leverage': return { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50' };
                  case 'enhance': return { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50' };
                  case 'transform': return { bg: 'bg-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50' };
                  case 'build': return { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50' };
                  case 'not-touched': return { bg: 'bg-slate-300', text: 'text-slate-600', lightBg: 'bg-slate-50' };
                  default: return { bg: 'bg-slate-300', text: 'text-slate-600', lightBg: 'bg-slate-50' };
                }
              };

              const colors = getScopeColor();
              const linkedRoadmapItemsCount = solution.linkedRoadmapItems?.length || 0;

              return (
                <div
                  key={solution.id}
                  className="bg-slate-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                  onClick={() => handleSolutionClick(solution)}
                >
                  {/* Color indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg ${colors.bg}`} />

                  {/* Header */}
                  <div className="flex items-start justify-between mt-2 mb-3">
                    <h3 className="font-semibold text-gray-900 flex-1 pr-2">{solution.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSolution(solution.id, solution.name);
                      }}
                      className="text-gray-400 hover:text-red-600 -mt-1 -mr-1"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Description */}
                  {solution.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {solution.description}
                    </p>
                  )}

                  {/* Budget */}
                  {solution.budget && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Budget: {solution.budget}
                      </span>
                    </div>
                  )}

                  {/* Vendor & Partner */}
                  <div className="space-y-1 mb-3">
                    {solution.vendor && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Vendor:</span> {solution.vendor}
                      </div>
                    )}
                    {solution.implementationPartner && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Partner:</span> {solution.implementationPartner}
                      </div>
                    )}
                  </div>

                  {/* Go-Live Date */}
                  {solution.expectedGoLive && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar size={14} />
                      <span>
                        Go-Live: {new Date(solution.expectedGoLive).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {/* Linked Roadmap Items Count */}
                  {linkedRoadmapItemsCount > 0 && (
                    <div className={`text-xs font-medium ${colors.text} ${colors.lightBg} px-2 py-1 rounded inline-block`}>
                      {linkedRoadmapItemsCount} linked {linkedRoadmapItemsCount === 1 ? 'roadmap item' : 'roadmap items'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddLevel0ColumnDialog
        open={showAddColumnDialog}
        onClose={() => setShowAddColumnDialog(false)}
        onAdd={handleAddColumn}
      />

      <AddLevel0ColumnDialog
        open={showEditColumnDialog}
        onClose={() => {
          setShowEditColumnDialog(false);
          setSelectedColumn(null);
        }}
        onAdd={handleUpdateColumn}
        initialData={selectedColumn}
      />

      <AddComponentDialog
        open={showAddComponentDialog}
        onClose={() => {
          setShowAddComponentDialog(false);
          setSelectedColumn(null);
        }}
        onAdd={handleAddComponent}
        columnName={selectedColumn?.name}
      />

      <CreatePlanningDialog
        open={showEditBusinessGoalDialog}
        onClose={() => setShowEditBusinessGoalDialog(false)}
        onCreate={handleEditBusinessGoal}
        initialData={planning.businessGoal}
      />

      <ComponentDetailDialog
        open={showComponentDetailDialog}
        onClose={() => {
          setShowComponentDetailDialog(false);
          setSelectedComponent(null);
          setSelectedColumn(null);
        }}
        onSave={handleUpdateComponent}
        component={selectedComponent}
        columnName={selectedColumn?.name}
      />

      <AddRoadmapItemDialog
        open={showAddRoadmapItemDialog}
        onClose={() => setShowAddRoadmapItemDialog(false)}
        onAdd={handleAddRoadmapItem}
        capabilities={getAllComponents()}
      />

      <RoadmapItemDetailDialog
        open={showRoadmapItemDetailDialog}
        onClose={() => {
          setShowRoadmapItemDetailDialog(false);
          setSelectedRoadmapItem(null);
        }}
        onSave={handleUpdateRoadmapItem}
        roadmapItem={selectedRoadmapItem}
        capabilities={getAllComponents()}
      />

      <AddSolutionDialog
        open={showAddSolutionDialog}
        onClose={() => setShowAddSolutionDialog(false)}
        onAdd={handleAddSolution}
        roadmapItems={planning.roadmapItems || []}
      />

      <SolutionDetailDialog
        open={showSolutionDetailDialog}
        onClose={() => {
          setShowSolutionDetailDialog(false);
          setSelectedSolution(null);
        }}
        onSave={handleUpdateSolution}
        solution={selectedSolution}
        roadmapItems={planning.roadmapItems || []}
      />

      <CapabilityReportDialog
        open={showCapabilityReportDialog}
        onClose={() => {
          setShowCapabilityReportDialog(false);
          setSelectedCapabilityForReport(null);
        }}
        capability={selectedCapabilityForReport}
        planningName={planning.name}
      />
    </div>
  );
}
