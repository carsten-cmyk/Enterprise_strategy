import { useState } from 'react';
import { Plus, Trash2, DollarSign, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { useSettings } from '../data/settingsStore';

export function SettingsPage() {
  const { currency, vendors, setCurrency, addVendor, removeVendor } = useSettings();
  const [newVendor, setNewVendor] = useState('');

  const currencies = [
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' }
  ];

  const handleAddVendor = () => {
    if (newVendor.trim()) {
      addVendor(newVendor.trim());
      setNewVendor('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddVendor();
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage master data and system preferences
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Currency Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Currency</h2>
              <p className="text-sm text-gray-600">
                Select your default currency for budget and cost fields
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  currency === curr.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">{curr.code}</span>
                  <span className="text-2xl text-gray-600">{curr.symbol}</span>
                </div>
                <div className="text-xs text-gray-600">{curr.name}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Current selection:</span> {currency} (
              {currencies.find((c) => c.code === currency)?.name || 'Unknown'})
            </p>
          </div>
        </div>

        {/* Vendor Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="text-purple-600" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Vendors</h2>
              <p className="text-sm text-gray-600">
                Manage your list of vendors for solutions and projects
              </p>
            </div>
          </div>

          {/* Add Vendor */}
          <div className="mb-4">
            <Label>Add New Vendor</Label>
            <div className="flex gap-2">
              <Input
                value={newVendor}
                onChange={setNewVendor}
                onKeyPress={handleKeyPress}
                placeholder="E.g. Salesforce, Microsoft, SAP"
              />
              <Button
                variant="primary"
                onClick={handleAddVendor}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
          </div>

          {/* Vendor List */}
          {vendors.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <Building2 className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="mb-2">No vendors added yet</p>
              <p className="text-sm">Add your first vendor above</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'}
              </p>
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-900">{vendor.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVendor(vendor.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
