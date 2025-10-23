import { useState, useMemo } from 'react';
import { Plus, Trash2, DollarSign, Building2, Users, Edit2, Search, Database, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { useSettings } from '../data/settingsStore';
import { PersonTeamModal } from '../components/PersonTeamModal';
import { VendorModal } from '../components/VendorModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { seedDatabase, clearDatabase } from '../utils/seedData';

export function SettingsPage() {
  const {
    currency,
    vendors,
    people,
    setCurrency,
    addFullPerson,
    editPerson,
    removePerson,
    addFullVendor,
    editVendor,
    removeVendor
  } = useSettings();

  // People modal state
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [peopleSearch, setPeopleSearch] = useState('');

  // Vendor modal state
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [vendorSearch, setVendorSearch] = useState('');

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, id: null, name: '' });

  const currencies = [
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' }
  ];

  // Filtered people
  const filteredPeople = useMemo(() => {
    if (!peopleSearch.trim()) return people;
    const search = peopleSearch.toLowerCase();
    return people.filter(p =>
      p.name.toLowerCase().includes(search) ||
      (p.email && p.email.toLowerCase().includes(search)) ||
      (p.department && p.department.toLowerCase().includes(search))
    );
  }, [people, peopleSearch]);

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    if (!vendorSearch.trim()) return vendors;
    const search = vendorSearch.toLowerCase();
    return vendors.filter(v =>
      v.name.toLowerCase().includes(search) ||
      (v.type && v.type.toLowerCase().includes(search)) ||
      (v.contactEmail && v.contactEmail.toLowerCase().includes(search))
    );
  }, [vendors, vendorSearch]);

  // Person handlers
  const handleAddPerson = () => {
    setEditingPerson(null);
    setPersonModalOpen(true);
  };

  const handleEditPerson = (person) => {
    setEditingPerson(person);
    setPersonModalOpen(true);
  };

  const handleSavePerson = (personData) => {
    if (editingPerson) {
      editPerson(editingPerson.id, personData);
    } else {
      addFullPerson(personData);
    }
  };

  const handleDeletePerson = (person) => {
    setDeleteConfirm({
      open: true,
      type: 'person',
      id: person.id,
      name: person.name
    });
  };

  // Vendor handlers
  const handleAddVendor = () => {
    setEditingVendor(null);
    setVendorModalOpen(true);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setVendorModalOpen(true);
  };

  const handleSaveVendor = (vendorData) => {
    if (editingVendor) {
      editVendor(editingVendor.id, vendorData);
    } else {
      addFullVendor(vendorData);
    }
  };

  const handleDeleteVendor = (vendor) => {
    setDeleteConfirm({
      open: true,
      type: 'vendor',
      id: vendor.id,
      name: vendor.name
    });
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deleteConfirm.type === 'person') {
      removePerson(deleteConfirm.id);
    } else if (deleteConfirm.type === 'vendor') {
      removeVendor(deleteConfirm.id);
    }
  };

  // Developer tools handlers
  const handleSeedData = () => {
    const result = seedDatabase();
    if (result.success) {
      alert('✅ Dummy data has been loaded!\n\nPlease refresh the page to see the changes.');
      window.location.reload();
    } else {
      alert('❌ Failed to load dummy data: ' + result.message);
    }
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ This will delete ALL data (people, vendors, and transformation plannings).\n\nAre you sure you want to continue?')) {
      const result = clearDatabase();
      if (result.success) {
        alert('✅ All data has been cleared!\n\nPlease refresh the page.');
        window.location.reload();
      } else {
        alert('❌ Failed to clear data: ' + result.message);
      }
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

      <div className="max-w-6xl space-y-8">
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

        {/* People Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">People & Teams</h2>
                <p className="text-sm text-gray-600">
                  Manage business and technical owners
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleAddPerson}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Person/Team
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={peopleSearch}
                onChange={(e) => setPeopleSearch(e.target.value)}
                placeholder="Search by name, email, or department..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* People Table */}
          {people.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <Users className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="mb-2 font-medium">No people added yet</p>
              <p className="text-sm mb-4">Add your first person or team to get started</p>
              <Button variant="secondary" onClick={handleAddPerson}>
                <Plus size={16} className="inline mr-2" />
                Add Person/Team
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPeople.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">
                          No people match your search
                        </td>
                      </tr>
                    ) : (
                      filteredPeople.map((person) => (
                        <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{person.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{person.email || '—'}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              person.role === 'Team' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {person.role || 'Person'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{person.department || '—'}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditPerson(person)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePerson(person)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredPeople.length} of {people.length} {people.length === 1 ? 'person' : 'people'}
              </div>
            </>
          )}
        </div>

        {/* Vendor Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="text-purple-600" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Vendors</h2>
                <p className="text-sm text-gray-600">
                  Manage your list of vendors for solutions and projects
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleAddVendor}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Vendor
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                placeholder="Search by name, type, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Vendor Table */}
          {vendors.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <Building2 className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="mb-2 font-medium">No vendors added yet</p>
              <p className="text-sm mb-4">Add your first vendor to get started</p>
              <Button variant="secondary" onClick={handleAddVendor}>
                <Plus size={16} className="inline mr-2" />
                Add Vendor
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">
                          No vendors match your search
                        </td>
                      </tr>
                    ) : (
                      filteredVendors.map((vendor) => (
                        <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{vendor.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{vendor.type || 'Software'}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{vendor.contactEmail || '—'}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              vendor.status === 'Active' ? 'bg-green-100 text-green-800' :
                              vendor.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {vendor.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditVendor(vendor)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteVendor(vendor)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredVendors.length} of {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'}
              </div>
            </>
          )}
        </div>

        {/* Developer Tools */}
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg border-2 border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-orange-600" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Developer Tools</h2>
              <p className="text-sm text-gray-600">
                Load dummy data or clear all data for testing purposes
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-orange-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Database size={18} className="text-emerald-600" />
                  Load Dummy Data
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Populate the system with sample data:
                </p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1 ml-4">
                  <li>• 3 people (with full details)</li>
                  <li>• 3 vendors (with full details)</li>
                  <li>• 3 transformation plannings</li>
                  <li>• Multiple solutions & roadmap items</li>
                </ul>
                <Button
                  variant="primary"
                  onClick={handleSeedData}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Database size={16} />
                  Load Dummy Data
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <RefreshCw size={18} className="text-red-600" />
                  Clear All Data
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Remove all data from the system:
                </p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1 ml-4">
                  <li>• All people & teams</li>
                  <li>• All vendors</li>
                  <li>• All transformation plannings</li>
                  <li>• All solutions & roadmap items</li>
                </ul>
                <Button
                  variant="danger"
                  onClick={handleClearData}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear All Data
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-orange-50 rounded border border-orange-200">
              <p className="text-xs text-orange-800">
                <strong>⚠️ Warning:</strong> These actions will modify your localStorage data.
                The page will refresh after the operation completes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PersonTeamModal
        open={personModalOpen}
        onClose={() => setPersonModalOpen(false)}
        onSave={handleSavePerson}
        person={editingPerson}
      />

      <VendorModal
        open={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        onSave={handleSaveVendor}
        vendor={editingVendor}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: null, id: null, name: '' })}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
