import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BarChart3, Edit, Calendar, TrendingUp } from 'lucide-react';
import { Button } from './ui/Button';
import ReactMarkdown from 'react-markdown';
import { useSettings } from '../data/settingsStore';

export function ProgramOverview({ planning, metrics, onEdit }) {
  const { currency } = useSettings();

  // Get default expanded state
  const hasContent = planning?.program?.executiveSummary || planning?.program?.businessCase;
  const defaultExpanded = hasContent;

  // Load from localStorage with fallback to default
  const storageKey = `programOverview_${planning?.id}_expanded`;
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored !== null ? stored === 'true' : defaultExpanded;
  });

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem(storageKey, isExpanded.toString());
  }, [isExpanded, storageKey]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Status configuration
  const statusConfig = {
    'planning': { color: 'text-blue-600', icon: '🔵', label: 'Planning' },
    'in-progress': { color: 'text-yellow-600', icon: '🟡', label: 'In Progress' },
    'on-hold': { color: 'text-gray-600', icon: '⚪', label: 'On Hold' },
    'completed': { color: 'text-green-600', icon: '✅', label: 'Completed' },
    'not-started': { color: 'text-gray-500', icon: '⚫', label: 'Not Started' }
  };

  // Format date range
  const formatDateRange = () => {
    if (!metrics.startDate && !metrics.endDate) return 'No timeline set';
    if (!metrics.endDate) return `Starts ${metrics.startDate}`;
    if (!metrics.startDate) return `Ends ${metrics.endDate}`;

    const start = new Date(metrics.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    const end = new Date(metrics.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    return `${start} - ${end}`;
  };

  // Format budget
  const formatBudget = (amount) => {
    if (!amount || amount === 0) return `0 ${currency}`;
    return `${amount.toLocaleString()} ${currency}`;
  };

  // Get status summary text
  const getStatusSummary = () => {
    const counts = metrics.itemCountByStatus;
    const parts = [];
    if (counts.planning > 0) parts.push(`${counts.planning} Planning`);
    if (counts['in-progress'] > 0) parts.push(`${counts['in-progress']} In Progress`);
    if (counts['on-hold'] > 0) parts.push(`${counts['on-hold']} On Hold`);
    if (counts.completed > 0) parts.push(`${counts.completed} Completed`);
    if (counts['not-started'] > 0) parts.push(`${counts['not-started']} Not Started`);

    if (parts.length === 0) return 'No items yet';
    return `Items: ${counts.total} (${parts.join(', ')})`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={toggleExpanded}>
          {isExpanded ? (
            <ChevronDown size={24} className="text-gray-600 flex-shrink-0" />
          ) : (
            <ChevronRight size={24} className="text-gray-600 flex-shrink-0" />
          )}
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{planning?.program?.name || 'Program Overview'}</h2>
          </div>
        </div>
      </div>

      {/* Collapsed View - Always visible */}
      <div className="space-y-2 ml-9">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <span className="font-medium">Budget:</span> {formatBudget(metrics.totalBudget)}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />
            <span>{formatDateRange()}</span>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {getStatusSummary()}
        </div>

        <div className="text-sm text-gray-600">
          Gaps: {metrics.gapsAddressed.addressed} / {metrics.gapsAddressed.total} addressed
          {metrics.gapsAddressed.total > 0 && (
            <span className="ml-2 text-gray-500">
              ({Math.round((metrics.gapsAddressed.addressed / metrics.gapsAddressed.total) * 100)}%)
            </span>
          )}
        </div>

        {/* Content indicator */}
        {!isExpanded && (
          <div className="mt-4">
            {hasContent ? (
              <div className="text-sm text-blue-600 flex items-center gap-2">
                ℹ️ Executive summary and business case added
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                Add Executive Summary & Business Case
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="ml-9 mt-6 space-y-6">
          {/* Detailed Status Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Items: {metrics.itemCountByStatus.total} total</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(statusConfig).map(([key, config]) => {
                const count = metrics.itemCountByStatus[key] || 0;
                if (count === 0) return null;
                return (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span>{config.icon}</span>
                    <span className={config.color}>{config.label}: {count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6"></div>

          {/* Executive Summary */}
          {planning?.program?.executiveSummary ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Executive Summary</h3>
              <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 border border-gray-200">
                <ReactMarkdown>{planning.program.executiveSummary}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Executive Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-500 italic">
                No executive summary yet
              </div>
            </div>
          )}

          {/* Business Case */}
          {planning?.program?.businessCase ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Business Case</h3>
              <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 border border-gray-200">
                <ReactMarkdown>{planning.program.businessCase}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Business Case</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-500 italic">
                No business case yet
              </div>
            </div>
          )}

          {/* Edit Button */}
          <div className="pt-4">
            <Button
              variant="secondary"
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Program Overview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
