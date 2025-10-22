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

function MaturitySelector({ value, onChange, label }) {
  return (
    <div className="mt-2">
      <Label>{label}</Label>
      <div className="flex gap-2 mt-1">
        {[1, 2, 3, 4, 5].map(level => (
          <button
            key={level}
            type="button"
            className={`w-10 h-10 rounded font-semibold text-sm transition-colors ${
              value >= level
                ? level <= 2
                  ? 'bg-red-400 text-white'
                  : level === 3
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-green-400 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => onChange(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CreatePlanningDialog({ open, onClose, onCreate, initialData = null }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [desiredState, setDesiredState] = useState('');
  const [currentMaturity, setCurrentMaturity] = useState(1);
  const [desiredMaturity, setDesiredMaturity] = useState(3);

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData && open) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setCurrentState(initialData.currentState || '');
      setDesiredState(initialData.desiredState || '');
      setCurrentMaturity(initialData.currentMaturity || 1);
      setDesiredMaturity(initialData.desiredMaturity || 3);
    }
  }, [initialData, open]);

  const handleClose = () => {
    if (!initialData) {
      setName('');
      setDescription('');
      setCurrentState('');
      setDesiredState('');
      setCurrentMaturity(1);
      setDesiredMaturity(3);
    }
    onClose();
  };

  const handleSave = () => {
    if (!name.trim() || !currentState.trim() || !desiredState.trim()) return;

    onCreate({
      name: name.trim(),
      description: description.trim(),
      currentState: currentState.trim(),
      desiredState: desiredState.trim(),
      currentMaturity,
      desiredMaturity
    });
    handleClose();
  };

  const isValid = name.trim() && currentState.trim() && desiredState.trim();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Business Transformation Flow</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Definer forretningsmål og ønsket transformation
          </p>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          {/* Sektion 1: Forretningsmål */}
          <div>
            <Label>
              Forretningsmål <span className="text-red-500">*</span>
            </Label>
            <Input
              autoFocus
              value={name}
              onChange={setName}
              placeholder="F.eks. Forbedre kundehåndtering"
            />
            <p className="text-xs text-gray-500 mt-1">
              Giv planningen et beskrivende navn der reflekterer forretningsmålet
            </p>
          </div>

          {/* Sektion 2: Beskrivelse (optional) */}
          <div>
            <Label>Beskrivelse</Label>
            <Textarea
              value={description}
              onChange={setDescription}
              placeholder="Uddybende beskrivelse af forretningsmålet..."
              rows={2}
            />
          </div>

          {/* Sektion 3: Current State */}
          <div>
            <Label>
              Current State <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={currentState}
              onChange={setCurrentState}
              placeholder="Beskriv nuværende situation, udfordringer og pain points..."
              rows={4}
            />
            <MaturitySelector
              value={currentMaturity}
              onChange={setCurrentMaturity}
              label="Nuværende Maturity Level"
            />
          </div>

          {/* Sektion 3: Desired State */}
          <div>
            <Label>
              Desired State <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={desiredState}
              onChange={setDesiredState}
              placeholder="Beskriv ønsket fremtidstilstand, mål og forventede fordele..."
              rows={4}
            />
            <MaturitySelector
              value={desiredMaturity}
              onChange={setDesiredMaturity}
              label="Ønsket Maturity Level"
            />
          </div>
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
            {initialData ? 'Gem Ændringer' : 'Opret Planning'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
