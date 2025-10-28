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
  { id: 'planning', label: 'Planning' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'technical', label: 'Technical' }
];

const SUPPORT_OPTIONS = [
  { value: 'leverage', label: 'Maintain', color: 'bg-emerald-600', textColor: 'text-white' },
  { value: 'enhance', label: 'Uplift', color: 'bg-amber-500', textColor: 'text-white' },
  { value: 'transform', label: 'Transform', color: 'bg-rose-600', textColor: 'text-white' },
  { value: 'build', label: 'New build', color: 'bg-blue-600', textColor: 'text-white' },
  { value: 'not-touched', label: 'TBD', color: 'bg-slate-100', textColor: 'text-slate-700', border: 'border-2 border-slate-300' }
];

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

export function ComponentDetailDialog({ open, onClose, onSave, component, columnName }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    support: 'leverage',
    priority: 'medium',
    currentState: '',
    desiredCapability: '',
    businessImpact: '',
    investmentEstimate: '',
    timeline: '',
    dependencies: '',
    lifecycleStatus: '',
    businessOwner: '',
    technicalOwner: '',
    businessProcess: '',
    vendor: '',
    technologyStack: '',
    integrationPoints: ''
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (component && open) {
      setFormData({
        name: component.name || '',
        description: component.description || '',
        support: component.support || component.scope || 'leverage',
        priority: component.priority || 'medium',
        currentState: component.currentState || '',
        desiredCapability: component.desiredCapability || '',
        businessImpact: component.businessImpact || '',
        investmentEstimate: component.investmentEstimate || '',
        timeline: component.timeline || '',
        dependencies: component.dependencies || '',
        lifecycleStatus: component.lifecycleStatus || '',
        businessOwner: component.businessOwner || '',
        technicalOwner: component.technicalOwner || '',
        businessProcess: component.businessProcess || '',
        vendor: component.vendor || '',
        technologyStack: component.technologyStack || '',
        integrationPoints: component.integrationPoints || ''
      });
      setActiveTab('basic');
    }
  }, [component, open]);

  const handleClose = () => {
    if (!component) {
      // Reset form if creating new
      setFormData({
        name: '',
        description: '',
        support: 'leverage',
        priority: 'medium',
        currentState: '',
        desiredCapability: '',
        businessImpact: '',
        investmentEstimate: '',
        timeline: '',
        dependencies: '',
        lifecycleStatus: '',
        businessOwner: '',
        technicalOwner: '',
        businessProcess: '',
        vendor: '',
        technologyStack: '',
        integrationPoints: ''
      });
    }
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

  const isValid = formData.name.trim();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {component ? 'Edit Component' : 'New Component'}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6 overflow-x-auto">
          <nav className="flex gap-2 -mb-px min-w-max">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              <div>
                <Label>
                  Component Navn <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoFocus
                  value={formData.name}
                  onChange={(value) => updateField('name', value)}
                  placeholder="F.eks. CRM System"
                />
              </div>

              <div>
                <Label>Beskrivelse</Label>
                <Textarea
                  value={formData.description}
                  onChange={(value) => updateField('description', value)}
                  placeholder="Kort beskrivelse af komponenten..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Support of new business goal</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {SUPPORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('support', option.value)}
                      className={`px-4 py-2 rounded font-medium text-sm transition-all ${option.color} ${option.textColor} ${option.border || ''} ${
                        formData.support === option.value
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
                <Label>Priority</Label>
                <div className="flex gap-3 mt-2">
                  {PRIORITY_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('priority', option.value)}
                      className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                        formData.priority === option.value
                          ? 'bg-gray-800 text-white ring-2 ring-offset-2 ring-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-4">
              <div>
                <Label>Current State</Label>
                <Textarea
                  value={formData.currentState}
                  onChange={(value) => updateField('currentState', value)}
                  placeholder="Beskriv nuværende tilstand, udfordringer og begrænsninger..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Desired Capability</Label>
                <Textarea
                  value={formData.desiredCapability}
                  onChange={(value) => updateField('desiredCapability', value)}
                  placeholder="Beskriv ønsket fremtidig capability og forbedringer..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Lifecycle Status</Label>
                <Input
                  value={formData.lifecycleStatus}
                  onChange={(value) => updateField('lifecycleStatus', value)}
                  placeholder="F.eks. Active, Sunset, Planned"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Angiv hvor i livscyklussen denne komponent befinder sig
                </p>
              </div>
            </div>
          )}

          {/* Planning Tab */}
          {activeTab === 'planning' && (
            <div className="space-y-4">
              <div>
                <Label>Business Impact</Label>
                <Textarea
                  value={formData.businessImpact}
                  onChange={(value) => updateField('businessImpact', value)}
                  placeholder="Beskriv forventet forretningsværdi og impact..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Investment Estimate</Label>
                <Input
                  value={formData.investmentEstimate}
                  onChange={(value) => updateField('investmentEstimate', value)}
                  placeholder="F.eks. 500.000 DKK eller Low/Medium/High"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Estimeret investering for at opnå desired capability
                </p>
              </div>

              <div>
                <Label>Timeline</Label>
                <Input
                  value={formData.timeline}
                  onChange={(value) => updateField('timeline', value)}
                  placeholder="F.eks. Q2 2024 - Q4 2024"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Forventet tidsramme for implementering
                </p>
              </div>

              <div>
                <Label>Dependencies</Label>
                <Textarea
                  value={formData.dependencies}
                  onChange={(value) => updateField('dependencies', value)}
                  placeholder="Liste afhængigheder til andre komponenter, systemer eller projekter..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Ownership Tab */}
          {activeTab === 'ownership' && (
            <div className="space-y-4">
              <div>
                <Label>Business Owner</Label>
                <Input
                  value={formData.businessOwner}
                  onChange={(value) => updateField('businessOwner', value)}
                  placeholder="F.eks. Head of Sales"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hvem er forretningsejeren?
                </p>
              </div>

              <div>
                <Label>Technical Owner</Label>
                <Input
                  value={formData.technicalOwner}
                  onChange={(value) => updateField('technicalOwner', value)}
                  placeholder="F.eks. IT Architecture Team"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hvem er teknisk ansvarlig?
                </p>
              </div>

              <div>
                <Label>Business Process</Label>
                <Textarea
                  value={formData.businessProcess}
                  onChange={(value) => updateField('businessProcess', value)}
                  placeholder="Beskriv hvilke forretningsprocesser denne komponent understøtter..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Technical Tab */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              <div>
                <Label>Vendor</Label>
                <Input
                  value={formData.vendor}
                  onChange={(value) => updateField('vendor', value)}
                  placeholder="F.eks. Salesforce, Microsoft, Custom built"
                />
              </div>

              <div>
                <Label>Technology Stack</Label>
                <Textarea
                  value={formData.technologyStack}
                  onChange={(value) => updateField('technologyStack', value)}
                  placeholder="Liste teknologier, platforme og frameworks..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Integration Points</Label>
                <Textarea
                  value={formData.integrationPoints}
                  onChange={(value) => updateField('integrationPoints', value)}
                  placeholder="Beskriv integrationer til andre systemer og komponenter..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Annuller
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isValid}
          >
            {component ? 'Gem Ændringer' : 'Tilføj Component'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
