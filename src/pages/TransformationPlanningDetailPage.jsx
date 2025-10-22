import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AddLevel0ColumnDialog } from '../components/AddLevel0ColumnDialog';
import { AddComponentDialog } from '../components/AddComponentDialog';
import { CreatePlanningDialog } from '../components/CreatePlanningDialog';
import { useTransformationPlanning } from '../data/transformationPlanningStore';

export function TransformationPlanningDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
  const [showAddComponentDialog, setShowAddComponentDialog] = useState(false);
  const [showEditBusinessGoalDialog, setShowEditBusinessGoalDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const {
    getPlanning,
    addLevel0Column,
    deleteLevel0Column,
    addComponent,
    deleteComponent,
    updateBusinessGoal
  } = useTransformationPlanning();

  const planning = getPlanning(id);

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
    setShowAddComponentDialog(true);
  };

  const handleAddComponent = (component) => {
    if (selectedColumn) {
      addComponent(id, selectedColumn.id, component);
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
          Tilbage
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{planning.name}</h1>
          <Button
            variant="secondary"
            onClick={() => setShowEditBusinessGoalDialog(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Edit size={16} />
            Rediger Business Goal
          </Button>
        </div>
      </div>

      {/* Current & Desired State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Current State
          </h2>
          <p className="text-gray-800 whitespace-pre-wrap mb-4">
            {planning.businessGoal?.currentState || 'Ikke defineret'}
          </p>

          {/* Current Maturity Progress */}
          <div className="pt-4 border-t">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Current Maturity: Level {planning.businessGoal?.currentMaturity || 1}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => {
                const currentMaturity = planning.businessGoal?.currentMaturity || 1;
                const isActive = level <= currentMaturity;
                const getColor = () => {
                  if (!isActive) return 'bg-gray-200';
                  if (level <= 2) return 'bg-red-400';
                  if (level === 3) return 'bg-yellow-400';
                  return 'bg-green-400';
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
          <p className="text-gray-800 whitespace-pre-wrap mb-4">
            {planning.businessGoal?.desiredState || 'Ikke defineret'}
          </p>

          {/* Desired Maturity Progress */}
          <div className="pt-4 border-t">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Target Maturity: Level {planning.businessGoal?.desiredMaturity || 5}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => {
                const desiredMaturity = planning.businessGoal?.desiredMaturity || 5;
                const isActive = level <= desiredMaturity;
                const getColor = () => {
                  if (!isActive) return 'bg-gray-200';
                  if (level <= 2) return 'bg-red-400';
                  if (level === 3) return 'bg-yellow-400';
                  return 'bg-green-400';
                };
                return (
                  <div key={level} className={`w-4 h-4 rounded ${getColor()}`} />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Level 0 Columns Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Level 0 Capabilities</h2>
          <Button
            variant="primary"
            onClick={() => setShowAddColumnDialog(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus size={18} />
            Tilføj Level 0 Capability
          </Button>
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
          <div className="space-y-4">
            {planning.level0Columns.map(column => (
              <div
                key={column.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{column.name}</h3>
                    <span className="text-sm text-gray-500">
                      {column.components?.length || 0} components
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddComponentClick(column)}
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Component
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteColumn(column.id, column.name)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>

                {column.components?.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    {column.components.map(comp => (
                      <div
                        key={comp.id}
                        className="bg-white rounded p-3 text-sm border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{comp.name}</div>
                            {comp.description && (
                              <div className="text-gray-600 mt-1">{comp.description}</div>
                            )}
                            <div className="mt-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                comp.scope === 'primary' ? 'bg-cyan-100 text-cyan-800' :
                                comp.scope === 'secondary' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-200 text-gray-700'
                              }`}>
                                {comp.scope === 'primary' ? 'Primary' :
                                 comp.scope === 'secondary' ? 'Secondary' :
                                 'Not Touched'}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteComponent(column.id, comp.id, comp.name)}
                            className="text-gray-400 hover:text-red-600 -mt-1 -mr-1"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic mt-2 text-center py-4">
                    Ingen components endnu - klik "Component" for at tilføje
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roadmap Items Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Roadmap Items</h2>
          <span className="text-sm text-gray-500">
            {planning.roadmapItems?.length || 0} items
          </span>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Roadmap items UI kommer snart...</p>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Solutions & Projects</h2>
          <span className="text-sm text-gray-500">
            {planning.solutions?.length || 0} solutions
          </span>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Solutions & Projects UI kommer snart...</p>
        </div>
      </div>

      {/* Dialogs */}
      <AddLevel0ColumnDialog
        open={showAddColumnDialog}
        onClose={() => setShowAddColumnDialog(false)}
        onAdd={handleAddColumn}
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
    </div>
  );
}
