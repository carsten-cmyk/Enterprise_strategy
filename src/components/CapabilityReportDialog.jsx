import { X, Printer, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog';
import { Button } from './ui/Button';

export function CapabilityReportDialog({ open, onClose, capability, planningName }) {
  if (!capability) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement Word download
    alert('Word download coming soon');
  };

  // Calculate statistics
  const totalComponents = capability.components?.length || 0;
  const componentsWithSupport = capability.components?.reduce((acc, comp) => {
    const support = comp.support || 'not-touched';
    acc[support] = (acc[support] || 0) + 1;
    return acc;
  }, {});

  // Get support color
  const getSupportColor = (support) => {
    switch(support) {
      case 'leverage': return 'text-emerald-600';
      case 'enhance': return 'text-amber-600';
      case 'transform': return 'text-rose-600';
      case 'build': return 'text-blue-600';
      case 'not-touched': return 'text-slate-600';
      default: return 'text-slate-600';
    }
  };

  const getSupportLabel = (support) => {
    switch(support) {
      case 'leverage': return 'Leverage';
      case 'enhance': return 'Enhance';
      case 'transform': return 'Transform';
      case 'build': return 'Build';
      case 'not-touched': return 'Not Touched';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-rose-600 bg-rose-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col print:max-w-full print:h-auto">
        {/* Header - Hidden in print */}
        <DialogHeader className="print:hidden">
          <div className="flex items-center justify-between">
            <DialogTitle>Capability Detail Report</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer size={16} />
                Print
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </Button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Report Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 print:overflow-visible print:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Report Header */}
            <div className="border-b border-gray-300 pb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{capability.name}</h1>
              {capability.description && (
                <p className="text-lg text-gray-600 mb-4">{capability.description}</p>
              )}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Planning:</span> {planningName}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Executive Summary Cards */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:break-inside-avoid">
                  <div className="text-sm font-medium text-blue-900 mb-1">Total Components</div>
                  <div className="text-3xl font-bold text-blue-600">{totalComponents}</div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 print:break-inside-avoid">
                  <div className="text-sm font-medium text-emerald-900 mb-1">Leverage</div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {componentsWithSupport?.leverage || 0}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 print:break-inside-avoid">
                  <div className="text-sm font-medium text-amber-900 mb-1">Enhance</div>
                  <div className="text-3xl font-bold text-amber-600">
                    {componentsWithSupport?.enhance || 0}
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 print:break-inside-avoid">
                  <div className="text-sm font-medium text-rose-900 mb-1">Transform</div>
                  <div className="text-3xl font-bold text-rose-600">
                    {componentsWithSupport?.transform || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Components Breakdown */}
            <div className="print:break-before-page">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Components Overview</h2>
              {totalComponents === 0 ? (
                <p className="text-gray-500 italic">No components defined yet</p>
              ) : (
                <div className="space-y-4">
                  {capability.components.map((component, index) => (
                    <div
                      key={component.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white print:break-inside-avoid"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                          {component.description && (
                            <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSupportColor(component.support || 'not-touched')} bg-opacity-10`}>
                            {getSupportLabel(component.support || 'not-touched')}
                          </span>
                          {component.priority && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(component.priority)}`}>
                              {component.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {component.currentState && (
                          <div>
                            <div className="font-medium text-gray-700 mb-1">Current State</div>
                            <div className="text-gray-600">{component.currentState}</div>
                          </div>
                        )}
                        {component.desiredCapability && (
                          <div>
                            <div className="font-medium text-gray-700 mb-1">Desired Capability</div>
                            <div className="text-gray-600">{component.desiredCapability}</div>
                          </div>
                        )}
                        {component.businessImpact && (
                          <div>
                            <div className="font-medium text-gray-700 mb-1">Business Impact</div>
                            <div className="text-gray-600">{component.businessImpact}</div>
                          </div>
                        )}
                        {component.investmentEstimate && (
                          <div>
                            <div className="font-medium text-gray-700 mb-1">Investment Estimate</div>
                            <div className="text-gray-600">{component.investmentEstimate}</div>
                          </div>
                        )}
                      </div>

                      {(component.businessOwner || component.technicalOwner || component.vendor) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                            {component.businessOwner && (
                              <div>
                                <span className="font-medium">Business Owner:</span> {component.businessOwner}
                              </div>
                            )}
                            {component.technicalOwner && (
                              <div>
                                <span className="font-medium">Technical Owner:</span> {component.technicalOwner}
                              </div>
                            )}
                            {component.vendor && (
                              <div>
                                <span className="font-medium">Vendor:</span> {component.vendor}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gap Analysis */}
            <div className="print:break-before-page">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gap Analysis</h2>
              {capability.components?.filter(c => c.currentState && c.desiredCapability).length === 0 ? (
                <p className="text-gray-500 italic">No gap analysis data available</p>
              ) : (
                <div className="space-y-3">
                  {capability.components
                    ?.filter(c => c.currentState && c.desiredCapability)
                    .map(component => (
                      <div
                        key={component.id}
                        className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded print:break-inside-avoid"
                      >
                        <div className="font-semibold text-gray-900 mb-1">{component.name}</div>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>
                            <span className="font-medium">Current:</span> {component.currentState}
                          </div>
                          <div>
                            <span className="font-medium">Target:</span> {component.desiredCapability}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Action Plan */}
            <div className="print:break-before-page">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Action Plan & Timeline</h2>
              {capability.components?.filter(c => c.timeline).length === 0 ? (
                <p className="text-gray-500 italic">No action plan defined yet</p>
              ) : (
                <div className="space-y-3">
                  {capability.components
                    ?.filter(c => c.timeline)
                    .map(component => (
                      <div
                        key={component.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white print:break-inside-avoid"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-gray-900">{component.name}</div>
                          <div className="text-sm text-gray-600">{component.timeline}</div>
                        </div>
                        {component.dependencies && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Dependencies:</span> {component.dependencies}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:visible, .print\\:visible * {
            visibility: visible;
          }
          @page {
            margin: 2cm;
            size: A4;
          }
        }
      `}</style>
    </Dialog>
  );
}
