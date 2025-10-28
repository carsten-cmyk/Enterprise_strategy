import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TransformationPlanningCard } from '../components/TransformationPlanningCard';
import { CreatePlanningDialog } from '../components/CreatePlanningDialog';
import { useTransformationPlanning } from '../data/transformationPlanningStore';

export function TransformationPlanningPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { plannings, createPlanning, deletePlanning } = useTransformationPlanning();
  const navigate = useNavigate();

  const handleCreatePlanning = ({ name, description, currentState, desiredState, currentMaturity, desiredMaturity }) => {
    const newPlanning = createPlanning(name, currentState, desiredState, currentMaturity, desiredMaturity, description);
    navigate(`/transformation-planning/${newPlanning.id}`);
  };

  const handlePlanningClick = (planningId) => {
    navigate(`/transformation-planning/${planningId}`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transformation Planning</h1>
          <p className="text-gray-600 mt-2">
            Strategic planning and programs
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Opret Business Transformation Flow
        </Button>
      </div>

      {/* Planning Cards Grid */}
      {plannings.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <p className="text-gray-500 mb-4">
            Ingen transformation plannings endnu
          </p>
          <Button
            variant="primary"
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Opret Din Første Business Transformation Flow
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plannings.map(planning => (
            <TransformationPlanningCard
              key={planning.id}
              planning={planning}
              onClick={() => handlePlanningClick(planning.id)}
              onDelete={deletePlanning}
            />
          ))}
        </div>
      )}

      {/* Create Planning Dialog */}
      <CreatePlanningDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreatePlanning}
      />
    </div>
  );
}
