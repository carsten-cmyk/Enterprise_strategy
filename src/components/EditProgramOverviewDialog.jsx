import { useState, useRef, useMemo } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

export function EditProgramOverviewDialog({ open, onClose, program, onSave }) {
  const [executiveSummary, setExecutiveSummary] = useState(program?.executiveSummary || '');
  const [businessCase, setBusinessCase] = useState(program?.businessCase || '');
  const [isSaving, setIsSaving] = useState(false);

  // SimpleMDE options
  const editorOptions = useMemo(() => ({
    spellChecker: false,
    toolbar: [
      'bold',
      'italic',
      'heading-1',
      'heading-2',
      '|',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      '|',
      'preview',
      'side-by-side',
      '|',
      'guide'
    ],
    placeholder: 'Write your content in Markdown format...',
    hideIcons: ['fullscreen'],
    sideBySideFullscreen: false,
    status: ['lines', 'words'],
    minHeight: '200px'
  }), []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        executiveSummary,
        businessCase
      });
      onClose();
    } catch (error) {
      console.error('Failed to save program overview:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setExecutiveSummary(program?.executiveSummary || '');
    setBusinessCase(program?.businessCase || '');
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Program Overview</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Executive Summary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Executive Summary
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Provide a high-level overview of the program objectives, scope, and expected outcomes.
                  You can use Markdown formatting (headings, lists, bold, italic, etc.).
                </p>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <SimpleMDE
                    value={executiveSummary}
                    onChange={setExecutiveSummary}
                    options={{
                      ...editorOptions,
                      placeholder: 'e.g., ## Program Overview\n\nThis program aims to...\n\n## Key Objectives\n- Objective 1\n- Objective 2'
                    }}
                  />
                </div>
              </div>

              {/* Business Case */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Case
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Outline the business justification, investment details, expected benefits, and ROI.
                  You can use Markdown formatting (headings, lists, bold, italic, etc.).
                </p>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <SimpleMDE
                    value={businessCase}
                    onChange={setBusinessCase}
                    options={{
                      ...editorOptions,
                      placeholder: '**Investment:** DKK 3.2M\n**Expected Return:** 30% efficiency gain\n**Payback Period:** 18 months\n\n### Benefits\n- Benefit 1\n- Benefit 2'
                    }}
                  />
                </div>
              </div>

              {/* Markdown Help */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Markdown Quick Reference</h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <div><code># Heading 1</code> or <code>## Heading 2</code> for headings</div>
                  <div><code>**bold text**</code> for bold, <code>*italic text*</code> for italic</div>
                  <div><code>- Item</code> for bullet lists, <code>1. Item</code> for numbered lists</div>
                  <div><code>[Link text](url)</code> for hyperlinks</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
