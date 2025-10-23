import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Target, Package, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTransformationPlanning } from '../data/transformationPlanningStore';

export function DashboardPage() {
  const navigate = useNavigate();
  const { plannings } = useTransformationPlanning();

  // Calculate statistics
  const totalPlannings = plannings.length;
  const totalCapabilities = plannings.reduce((sum, p) => sum + (p.level0Columns?.length || 0), 0);
  const totalComponents = plannings.reduce((sum, p) => {
    return sum + p.level0Columns?.reduce((colSum, col) => colSum + (col.components?.length || 0), 0) || 0;
  }, 0);
  const totalRoadmapItems = plannings.reduce((sum, p) => sum + (p.roadmapItems?.length || 0), 0);
  const totalSolutions = plannings.reduce((sum, p) => sum + (p.solutions?.length || 0), 0);

  // Calculate support type distribution across components
  const supportTypeDistribution = plannings.reduce((dist, p) => {
    p.level0Columns?.forEach(col => {
      col.components?.forEach(comp => {
        const support = comp.support || 'not-touched';
        dist[support] = (dist[support] || 0) + 1;
      });
    });
    return dist;
  }, {});

  // Calculate roadmap item status distribution
  const statusDistribution = plannings.reduce((dist, p) => {
    p.roadmapItems?.forEach(item => {
      const status = item.status || 'planning';
      dist[status] = (dist[status] || 0) + 1;
    });
    return dist;
  }, {});

  // Get recent plannings (last 5)
  const recentPlannings = [...plannings]
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    .slice(0, 5);

  // Support type config
  const supportTypes = [
    { key: 'leverage', label: 'Leverage', color: 'bg-emerald-600', lightBg: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { key: 'enhance', label: 'Enhance', color: 'bg-amber-500', lightBg: 'bg-amber-50', textColor: 'text-amber-700' },
    { key: 'transform', label: 'Transform', color: 'bg-rose-600', lightBg: 'bg-rose-50', textColor: 'text-rose-700' },
    { key: 'build', label: 'Build', color: 'bg-blue-600', lightBg: 'bg-blue-50', textColor: 'text-blue-700' },
    { key: 'not-touched', label: 'Not Touched', color: 'bg-slate-300', lightBg: 'bg-slate-50', textColor: 'text-slate-700' }
  ];

  // Status config
  const statuses = [
    { key: 'planning', label: 'Planning', color: 'bg-gray-500' },
    { key: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
    { key: 'completed', label: 'Completed', color: 'bg-green-500' },
    { key: 'on-hold', label: 'On Hold', color: 'bg-orange-500' }
  ];

  const totalSupportItems = Object.values(supportTypeDistribution).reduce((sum, val) => sum + val, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your transformation initiatives</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Plannings</span>
            <BarChart3 className="text-blue-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalPlannings}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Capabilities</span>
            <Target className="text-emerald-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalCapabilities}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Components</span>
            <Package className="text-amber-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalComponents}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Roadmap Items</span>
            <Calendar className="text-rose-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalRoadmapItems}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Solutions</span>
            <TrendingUp className="text-purple-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalSolutions}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Support Type Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Support Type Distribution</h2>
          {totalSupportItems === 0 ? (
            <p className="text-gray-500 text-center py-8">No components yet</p>
          ) : (
            <div className="space-y-3">
              {supportTypes.map(type => {
                const count = supportTypeDistribution[type.key] || 0;
                const percentage = totalSupportItems > 0 ? (count / totalSupportItems * 100).toFixed(1) : 0;

                return (
                  <div key={type.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${type.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Roadmap Status Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Roadmap Item Status</h2>
          {totalRoadmapItems === 0 ? (
            <p className="text-gray-500 text-center py-8">No roadmap items yet</p>
          ) : (
            <div className="space-y-3">
              {statuses.map(status => {
                const count = statusDistribution[status.key] || 0;
                const percentage = totalRoadmapItems > 0 ? (count / totalRoadmapItems * 100).toFixed(1) : 0;

                return (
                  <div key={status.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{status.label}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${status.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Plannings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Plannings</h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/transformation-planning')}
          >
            View All
          </Button>
        </div>

        {recentPlannings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No plannings created yet</p>
            <Button
              variant="secondary"
              onClick={() => navigate('/transformation-planning')}
            >
              Create Your First Planning
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPlannings.map(planning => {
              const capCount = planning.level0Columns?.length || 0;
              const roadmapCount = planning.roadmapItems?.length || 0;
              const solutionCount = planning.solutions?.length || 0;

              return (
                <div
                  key={planning.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/transformation-planning/${planning.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{planning.name}</h3>
                      {planning.businessGoal?.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {planning.businessGoal.description}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      {new Date(planning.lastModified).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>{capCount} capabilities</span>
                    <span>•</span>
                    <span>{roadmapCount} roadmap items</span>
                    <span>•</span>
                    <span>{solutionCount} solutions</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
