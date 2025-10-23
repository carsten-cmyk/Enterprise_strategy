import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input, Label } from './ui/Input';

export function VendorModal({ open, onClose, onSave, vendor }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Software',
    contactEmail: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && vendor) {
      setFormData({
        name: vendor.name || '',
        type: vendor.type || 'Software',
        contactEmail: vendor.contactEmail || '',
        status: vendor.status || 'Active'
      });
    } else if (open) {
      setFormData({
        name: '',
        type: 'Software',
        contactEmail: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [open, vendor]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader onClose={onClose}>
          <DialogTitle>
            {vendor ? 'Edit Vendor' : 'Add Vendor'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div>
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g. Salesforce, Microsoft, SAP"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label>Type</Label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Cloud">Cloud</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(value) => updateField('contactEmail', value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g. contact@vendor.com"
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {vendor ? 'Save Changes' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
