import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, User, Trash2, Package, TrendingUp, Building2, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AddSolutionDialog } from '../components/AddSolutionDialog';
import { SolutionDetailDialog } from '../components/SolutionDetailDialog';
import { useTransformationPlanning } from '../data/transformationPlanningStore';

// Maturity Indicator component (same as TransformationPlanningCard)
function MaturityIndicator({ level, isActive }) {
  const colors = {
    1: 'bg-red-400',
    2: 'bg-orange-400',
    3: 'bg-yellow-400',
    4: 'bg-green-400',
    5: 'bg-green-500'
  };

  return (
    <div
      className={`w-3 h-3 rounded ${
        isActive ? colors[level] : 'bg-gray-200'
      }`}
    />
  );
}

export function SolutionsProjectsPage() {
  const navigate = useNavigate();
  const { plannings, addSolution, updateSolution, deleteSolution } = useTransformationPlanning();
  const [showAddSolutionDialog, setShowAddSolutionDialog] = useState(false);
  const [showSolutionDetailDialog, setShowSolutionDetailDialog] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedPlanningId, setSelectedPlanningId] = useState(null);

  // Collect all solutions from all plannings with maturity data
  const allSolutions = plannings.flatMap(planning =>
    (planning.solutions || []).map(solution => ({
      ...solution,
      planningId: planning.id,
      planningName: planning.name,
      currentMaturity: planning.businessGoal?.currentMaturity || 0,
      desiredMaturity: planning.businessGoal?.desiredMaturity || 0
    }))
  );

  // Calculate statistics
  const totalSolutions = allSolutions.length;

  const supportTypeDistribution = allSolutions.reduce((dist, solution) => {
    const support = solution.scope || 'not-touched';
    dist[support] = (dist[support] || 0) + 1;
    return dist;
  }, {});

  const uniqueVendors = [...new Set(allSolutions.filter(s => s.vendor).map(s => s.vendor))].length;

  const solutionsWithBudget = allSolutions.filter(s => s.budget).length;

  const handleAddSolution = (solution) => {
    if (selectedPlanningId) {
      addSolution(selectedPlanningId, solution);
    }
  };

  const handleSolutionClick = (solution) => {
    setSelectedSolution(solution);
    setSelectedPlanningId(solution.planningId);
    setShowSolutionDetailDialog(true);
  };

  const handleUpdateSolution = (updates) => {
    if (selectedSolution && selectedPlanningId) {
      updateSolution(selectedPlanningId, selectedSolution.id, updates);
    }
  };

  const handleDeleteSolution = (solution) => {
    if (window.confirm(`Are you sure you want to delete "${solution.name}"?`)) {
      deleteSolution(solution.planningId, solution.id);
    }
  };

  const handleAddClick = () => {
    if (plannings.length === 0) {
      alert('Please create a Transformation Planning first');
      navigate('/transformation-planning');
      return;
    }
    // Default to first planning if none selected
    setSelectedPlanningId(plannings[0].id);
    setShowAddSolutionDialog(true);
  };

  const getScopeColor = (scope) => {
    switch(scope) {
      case 'leverage': return { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50' };
      case 'enhance': return { bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50' };
      case 'transform': return { bg: 'bg-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50' };
      case 'build': return { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50' };
      case 'not-touched': return { bg: 'bg-slate-300', text: 'text-slate-600', lightBg: 'bg-slate-50' };
      default: return { bg: 'bg-slate-300', text: 'text-slate-600', lightBg: 'bg-slate-50' };
    }
  };

  const getScopeLabel = (scope) => {
    switch(scope) {
      case 'leverage': return 'Maintain';
      case 'enhance': return 'Uplift';
      case 'transform': return 'Transform';
      case 'build': return 'New build';
      case 'not-touched': return 'TBD';
      default: return 'TBD';
    }
  };

  // Get roadmap items for selected planning
  const getRoadmapItemsForPlanning = (planningId) => {
    const planning = plannings.find(p => p.id === planningId);
    return planning?.roadmapItems || [];
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Solutions & Projects</h1>
            <p className="text-gray-600 mt-2">
              Manage all organizational solutions and projects
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            New Solution
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Solutions</span>
            <Package className="text-blue-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalSolutions}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">With Budget</span>
            <DollarSign className="text-green-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{solutionsWithBudget}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Unique Vendors</span>
            <Building2 className="text-purple-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{uniqueVendors}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Transform</span>
            <TrendingUp className="text-rose-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{supportTypeDistribution['transform'] || 0}</div>
        </div>
      </div>

      {/* Solutions Grid */}
      {allSolutions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No solutions yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first solution or project to get started
          </p>
          <Button
            variant="primary"
            onClick={handleAddClick}
            className="inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Solution
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSolutions.map(solution => {
            const scope = solution.scope || 'not-touched';
            const colors = getScopeColor(scope);
            const linkedRoadmapItemsCount = solution.linkedRoadmapItems?.length || 0;

            return (
              <div
                key={`${solution.planningId}-${solution.id}`}
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
                      handleDeleteSolution(solution);
                    }}
                    className="text-gray-400 hover:text-red-600 -mt-1 -mr-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Planning Badge */}
                <div className="mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/transformation-planning/${solution.planningId}`);
                    }}
                    className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    {solution.planningName}
                  </button>
                </div>

                {/* Strategy */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-600 mb-1">Strategy</div>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.bg} ${scope === 'not-touched' ? 'text-slate-700 border border-slate-300' : 'text-white'}`}>
                    {getScopeLabel(scope)}
                  </div>
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

                {/* Expected Start Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar size={14} />
                  {scope === 'leverage' ? (
                    <span>ongoing</span>
                  ) : (
                    <span>
                      Expected Start: {solution.expectedStart ? new Date(solution.expectedStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set'}
                    </span>
                  )}
                </div>

                {/* Maturity Transformation */}
                {solution.currentMaturity > 0 && solution.desiredMaturity > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Maturity Transformation
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Current */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(level => (
                          <MaturityIndicator key={`current-${level}`} level={level} isActive={level <= solution.currentMaturity} />
                        ))}
                      </div>
                      {/* Arrow */}
                      <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      {/* Desired */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(level => (
                          <MaturityIndicator key={`desired-${level}`} level={level} isActive={level <= solution.desiredMaturity} />
                        ))}
                      </div>
                    </div>
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

      {/* Dialogs */}
      <AddSolutionDialog
        open={showAddSolutionDialog}
        onClose={() => {
          setShowAddSolutionDialog(false);
          setSelectedPlanningId(null);
        }}
        onAdd={handleAddSolution}
        roadmapItems={selectedPlanningId ? getRoadmapItemsForPlanning(selectedPlanningId) : []}
        plannings={plannings}
        currentPlanningId={selectedPlanningId}
      />

      <SolutionDetailDialog
        open={showSolutionDetailDialog}
        onClose={() => {
          setShowSolutionDetailDialog(false);
          setSelectedSolution(null);
          setSelectedPlanningId(null);
        }}
        onSave={handleUpdateSolution}
        solution={selectedSolution}
        roadmapItems={selectedPlanningId ? getRoadmapItemsForPlanning(selectedPlanningId) : []}
        plannings={plannings}
        currentPlanningId={selectedPlanningId}
      />
    </div>
  );
}
