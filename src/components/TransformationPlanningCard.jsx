import { Calendar, BarChart3, Route, CheckCircle, X, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';

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
      className={`w-4 h-4 rounded ${
        isActive ? colors[level] : 'bg-gray-200'
      }`}
    />
  );
}

function MaturityProgress({ capabilities }) {
  if (capabilities.length === 0) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(level => (
          <MaturityIndicator key={level} level={level} isActive={false} />
        ))}
      </div>
    );
  }

  // Calculate average current maturity
  const avgMaturity = Math.round(
    capabilities.reduce((sum, cap) => sum + cap.currentMaturity, 0) / capabilities.length
  );

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(level => (
        <MaturityIndicator key={level} level={level} isActive={level <= avgMaturity} />
      ))}
    </div>
  );
}

export function TransformationPlanningCard({ planning, onClick, onDelete }) {
  const formatDate = (dateString) => {
    // dateString is now in format YYYY-MM-DD
    if (!dateString) return 'Unknown';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Er du sikker på at du vil slette "${planning.name}"?`)) {
      onDelete(planning.id);
    }
  };

  // Count all components across all Level 0 columns
  const totalComponents = planning.level0Columns?.reduce((sum, col) =>
    sum + (col.components?.length || 0), 0
  ) || 0;

  // Use business goal maturity for the progress indicator
  const currentMaturity = planning.businessGoal?.currentMaturity || 0;

  return (
    <Card onClick={onClick} className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="text-lg">{planning.name}</CardTitle>
            {/* Beskrivelse */}
            {planning.businessGoal?.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {planning.businessGoal.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-red-600 -mt-1 -mr-1 flex-shrink-0"
          >
            <X size={18} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Dato */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Oprettet {formatDate(planning.createdDate)}</span>
        </div>

        {/* Statistik */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <BarChart3 size={16} />
            <span>{totalComponents} capabilities</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Route size={16} />
            <span>{planning.roadmapItems?.length || 0} roadmap items</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle size={16} />
            <span>{planning.solutions?.length || 0} solutions</span>
          </div>
        </div>

        {/* Maturity Transformation */}
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-1">
            Maturity Transformation
          </div>
          <div className="flex items-center gap-2">
            {/* Current */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <MaturityIndicator key={level} level={level} isActive={level <= currentMaturity} />
              ))}
            </div>
            {/* Arrow */}
            <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
            {/* Desired */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <MaturityIndicator
                  key={level}
                  level={level}
                  isActive={level <= (planning.businessGoal?.desiredMaturity || 5)}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
