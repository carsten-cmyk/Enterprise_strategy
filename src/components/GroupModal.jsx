import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input, Textarea, Label } from './ui/Input';

export function GroupModal({ open, onClose, onSave, group, people = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'IT',
    status: 'Planning',
    owner: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
        type: group.type || 'IT',
        status: group.status || 'Planning',
        owner: group.owner || ''
      });
    } else if (open) {
      setFormData({
        name: '',
        description: '',
        type: 'IT',
        status: 'Planning',
        owner: ''
      });
    }
    setErrors({});
  }, [open, group]);

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
            {group ? 'Edit Project Group' : 'Add Project Group'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div>
            <Label>
              Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g. Digital Transformation, Infrastructure"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(value) => updateField('description', value)}
              placeholder="Brief description of the group..."
              rows={3}
            />
          </div>

          <div>
            <Label>Type</Label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="IT">IT</option>
              <option value="Process">Process</option>
              <option value="People">People</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div>
            <Label>Status</Label>
            <select
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <Label>Owner</Label>
            <select
              value={formData.owner}
              onChange={(e) => updateField('owner', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select owner...</option>
              {people.map(person => (
                <option key={person.id} value={person.name}>{person.name}</option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {group ? 'Save Changes' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
