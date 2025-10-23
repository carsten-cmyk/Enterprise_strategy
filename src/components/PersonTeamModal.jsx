import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input, Label } from './ui/Input';

export function PersonTeamModal({ open, onClose, onSave, person }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Person',
    department: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && person) {
      setFormData({
        name: person.name || '',
        email: person.email || '',
        role: person.role || 'Person',
        department: person.department || ''
      });
    } else if (open) {
      setFormData({
        name: '',
        email: '',
        role: 'Person',
        department: ''
      });
    }
    setErrors({});
  }, [open, person]);

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
            {person ? 'Edit Person/Team' : 'Add Person/Team'}
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
              placeholder="E.g. John Doe, Marketing Team"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g. john.doe@example.com"
            />
          </div>

          <div>
            <Label>Role</Label>
            <select
              value={formData.role}
              onChange={(e) => updateField('role', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Person">Person</option>
              <option value="Team">Team</option>
            </select>
          </div>

          <div>
            <Label>Department</Label>
            <Input
              value={formData.department}
              onChange={(value) => updateField('department', value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g. IT, Marketing, Finance"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {person ? 'Save Changes' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
