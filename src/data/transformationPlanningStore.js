import { useState, useEffect } from 'react';

const STORAGE_KEY = 'transformationPlannings';

// Helper functions for localStorage
function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load data:', error);
    return [];
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

// Custom hook for managing transformation planning data
export function useTransformationPlanning() {
  const [plannings, setPlannings] = useState(loadFromStorage);

  // Save to localStorage whenever plannings change
  useEffect(() => {
    if (plannings.length >= 0) {
      saveToStorage(plannings);
    }
  }, [plannings]);

  const createPlanning = (name, currentState, desiredState, currentMaturity = 1, desiredMaturity = 3, description = '') => {
    const now = new Date().toISOString();
    const planningId = Date.now().toString();
    const programId = `prog-${planningId}`;

    const newPlanning = {
      id: planningId,
      name,
      createdDate: now.split('T')[0], // YYYY-MM-DD
      lastModified: now,
      businessGoal: {
        name,
        description,
        currentState,
        desiredState,
        currentMaturity,
        desiredMaturity
      },
      // Auto-created Program
      programId,
      program: {
        id: programId,
        planningId,
        name: `${name} Program`,
        executiveSummary: '',
        businessCase: '',
        createdAt: now,
        updatedAt: now
      },
      level0Columns: [],
      programItems: [],
      solutions: []
    };
    setPlannings([...plannings, newPlanning]);
    return newPlanning;
  };

  const deletePlanning = (id) => {
    setPlannings(plannings.filter(p => p.id !== id));
  };

  const getPlanning = (id) => {
    return plannings.find(p => p.id === id);
  };

  const updatePlanning = (id, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const updateBusinessGoal = (planningId, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          name: updates.name || p.name, // Update top-level name if provided
          businessGoal: { ...p.businessGoal, ...updates },
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Level 0 Column operations
  const addLevel0Column = (planningId, columnData) => {
    const newId = Date.now().toString();
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        const newColumn = {
          id: newId,
          name: typeof columnData === 'string' ? columnData : columnData.name,
          description: typeof columnData === 'object' ? (columnData.description || '') : '',
          order: p.level0Columns.length,
          components: []
        };
        return {
          ...p,
          level0Columns: [...p.level0Columns, newColumn],
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
    return newId;
  };

  const updateLevel0Column = (planningId, columnId, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.map(col =>
            col.id === columnId ? { ...col, ...updates } : col
          ),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const deleteLevel0Column = (planningId, columnId) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.filter(col => col.id !== columnId),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Component operations
  const addComponent = (planningId, columnId, component) => {
    const newId = Date.now().toString();
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.map(col => {
            if (col.id === columnId) {
              const newComponent = {
                id: newId,
                name: component.name,
                description: component.description || '',
                support: component.support || 'primary',
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
                integrationPoints: component.integrationPoints || '',
                gaps: component.gaps || [],
                subcomponents: [] // Support for nested components
              };
              return {
                ...col,
                components: [...col.components, newComponent]
              };
            }
            return col;
          }),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
    return newId;
  };

  const updateComponent = (planningId, columnId, componentId, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.map(col => {
            if (col.id === columnId) {
              return {
                ...col,
                components: col.components.map(comp =>
                  comp.id === componentId ? { ...comp, ...updates } : comp
                )
              };
            }
            return col;
          }),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const deleteComponent = (planningId, columnId, componentId) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.map(col => {
            if (col.id === columnId) {
              return {
                ...col,
                components: col.components.filter(comp => comp.id !== componentId)
              };
            }
            return col;
          }),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Solution operations
  const addSolution = (planningId, solution) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        const newSolution = {
          id: Date.now().toString(),
          name: solution.name,
          description: solution.description || '',
          scope: solution.scope || 'not-touched',
          linkedProgramItems: solution.linkedProgramItems || [],
          budget: solution.budget || '',
          vendor: solution.vendor || '',
          implementationPartner: solution.implementationPartner || '',
          expectedGoLive: solution.expectedGoLive || ''
        };
        return {
          ...p,
          solutions: [...p.solutions, newSolution],
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const updateSolution = (planningId, solutionId, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          solutions: p.solutions.map(sol =>
            sol.id === solutionId ? { ...sol, ...updates } : sol
          ),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const deleteSolution = (planningId, solutionId) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          solutions: p.solutions.filter(sol => sol.id !== solutionId),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Program operations
  const updateProgram = (planningId, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          program: {
            ...p.program,
            ...updates,
            updatedAt: new Date().toISOString()
          },
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Program Item operations
  const addProgramItem = (planningId, programItem) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        const now = new Date().toISOString();
        const newItem = {
          id: `pi-${Date.now()}`,
          planningId,
          programId: p.programId,
          name: programItem.name,
          description: programItem.description || '',
          strategy: programItem.strategy || 'tbd',
          progressStatus: programItem.progressStatus || 'not-started',
          progress: programItem.progress || 0,

          // Timeline
          startDate: programItem.startDate || '',
          estimatedDuration: programItem.estimatedDuration || '',
          durationUnit: programItem.durationUnit || 'weeks',

          // Budget
          estimatedBudget: programItem.estimatedBudget || 0,
          currency: programItem.currency || 'DKK',

          // Links
          linkedCapabilities: programItem.linkedCapabilities || programItem.linkedComponents || [],

          // Assessment (selective inheritance structure)
          selectedAsIsComponents: programItem.selectedAsIsComponents || [],
          asIsUserNotes: programItem.asIsUserNotes || '',
          selectedToBeComponents: programItem.selectedToBeComponents || [],
          toBeUserNotes: programItem.toBeUserNotes || '',
          selectedBusinessImpactComponents: programItem.selectedBusinessImpactComponents || [],
          businessImpactUserNotes: programItem.businessImpactUserNotes || '',

          // Gaps
          selectedGaps: programItem.selectedGaps || [],
          customGaps: programItem.customGaps || [],

          // Dependencies
          dependsOn: programItem.dependsOn || [],

          // Ownership
          businessOwnerId: programItem.businessOwnerId || '',
          technicalOwnerId: programItem.technicalOwnerId || '',
          vendorId: programItem.vendorId || '',

          // Project link
          projectId: programItem.projectId || null,

          createdAt: now,
          updatedAt: now
        };

        const updatedPlanning = {
          ...p,
          programItems: [...p.programItems, newItem],
          lastModified: now
        };

        // Recalculate program metrics after adding item
        return recalculateProgramMetrics(updatedPlanning);
      }
      return p;
    }));
  };

  const updateProgramItem = (planningId, itemId, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        const now = new Date().toISOString();
        const updatedPlanning = {
          ...p,
          programItems: p.programItems.map(item =>
            item.id === itemId ? { ...item, ...updates, updatedAt: now } : item
          ),
          lastModified: now
        };

        // Recalculate program metrics after updating item
        return recalculateProgramMetrics(updatedPlanning);
      }
      return p;
    }));
  };

  const deleteProgramItem = (planningId, itemId) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        const updatedPlanning = {
          ...p,
          programItems: p.programItems.filter(item => item.id !== itemId),
          lastModified: new Date().toISOString()
        };

        // Recalculate program metrics after deleting item
        return recalculateProgramMetrics(updatedPlanning);
      }
      return p;
    }));
  };

  // Helper function to calculate program metrics from program items
  const recalculateProgramMetrics = (planning) => {
    const items = planning.programItems || [];

    if (items.length === 0) {
      return {
        ...planning,
        program: {
          ...planning.program,
          totalBudget: 0,
          overallProgress: 0,
          startDate: null,
          endDate: null,
          gapsAddressed: 0,
          updatedAt: new Date().toISOString()
        }
      };
    }

    // Calculate total budget
    const totalBudget = items.reduce((sum, item) => sum + (item.estimatedBudget || 0), 0);

    // Calculate average progress
    const overallProgress = Math.round(
      items.reduce((sum, item) => sum + (item.progress || 0), 0) / items.length
    );

    // Find earliest start date
    const startDates = items.map(i => i.startDate).filter(Boolean);
    const startDate = startDates.length > 0 ? startDates.sort()[0] : null;

    // Calculate end dates and find latest
    const endDates = items.map(item => {
      if (!item.startDate || !item.estimatedDuration) return null;
      const start = new Date(item.startDate);
      const duration = item.estimatedDuration || 0;
      const unit = item.durationUnit || 'weeks';

      let daysToAdd = 0;
      if (unit === 'hours') daysToAdd = Math.ceil(duration / 8); // 8 hours per day
      else if (unit === 'days') daysToAdd = duration;
      else if (unit === 'weeks') daysToAdd = duration * 7;
      else if (unit === 'months') daysToAdd = duration * 30;

      const end = new Date(start);
      end.setDate(end.getDate() + daysToAdd);
      return end.toISOString().split('T')[0];
    }).filter(Boolean);

    const endDate = endDates.length > 0 ? endDates.sort().reverse()[0] : null;

    // Count total gaps from all components
    const allComponents = [];
    (planning.level0Columns || []).forEach(col => {
      (col.components || []).forEach(comp => {
        allComponents.push(comp);
        // Include subcomponents
        if (comp.subcomponents) {
          allComponents.push(...comp.subcomponents);
        }
      });
    });

    const totalGaps = allComponents.reduce((sum, comp) => {
      return sum + ((comp.gaps || []).length || 0);
    }, 0);

    // Count addressed gaps (unique gaps selected in program items)
    const addressedGaps = new Set();
    items.forEach(item => {
      (item.selectedGaps || []).forEach(gapId => addressedGaps.add(gapId));
    });
    const gapsAddressed = addressedGaps.size;

    return {
      ...planning,
      program: {
        ...planning.program,
        totalBudget,
        overallProgress,
        startDate,
        endDate,
        totalGaps,
        gapsAddressed,
        updatedAt: new Date().toISOString()
      }
    };
  };

  // Subcomponent operations - Recursive helper to find and update component at any level
  const findAndUpdateComponent = (components, componentPath, updateFn) => {
    if (componentPath.length === 0) return components;

    const [currentId, ...restPath] = componentPath;

    return components.map(comp => {
      if (comp.id === currentId) {
        if (restPath.length === 0) {
          // This is the target component
          return updateFn(comp);
        } else {
          // Continue searching in subcomponents
          return {
            ...comp,
            subcomponents: findAndUpdateComponent(comp.subcomponents || [], restPath, updateFn)
          };
        }
      }
      return comp;
    });
  };

  const addSubcomponent = (planningId, columnId, componentPath, subcomponent) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.map(col => {
            if (col.id === columnId) {
              const newSubcomponent = {
                id: Date.now().toString(),
                name: subcomponent.name,
                description: subcomponent.description || '',
                support: subcomponent.support || 'primary',
                priority: subcomponent.priority || 'medium',
                currentState: subcomponent.currentState || '',
                desiredCapability: subcomponent.desiredCapability || '',
                businessImpact: subcomponent.businessImpact || '',
                investmentEstimate: subcomponent.investmentEstimate || '',
                timeline: subcomponent.timeline || '',
                dependencies: subcomponent.dependencies || '',
                lifecycleStatus: subcomponent.lifecycleStatus || '',
                businessOwner: subcomponent.businessOwner || '',
                technicalOwner: subcomponent.technicalOwner || '',
                businessProcess: subcomponent.businessProcess || '',
                vendor: subcomponent.vendor || '',
                technologyStack: subcomponent.technologyStack || '',
                integrationPoints: subcomponent.integrationPoints || '',
                subcomponents: []
              };

              return {
                ...col,
                components: findAndUpdateComponent(col.components, componentPath, (comp) => ({
                  ...comp,
                  subcomponents: [...(comp.subcomponents || []), newSubcomponent]
                }))
              };
            }
            return col;
          }),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const updateSubcomponent = (planningId, columnId, componentPath, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.map(col => {
            if (col.id === columnId) {
              return {
                ...col,
                components: findAndUpdateComponent(col.components, componentPath, (comp) => ({
                  ...comp,
                  ...updates
                }))
              };
            }
            return col;
          }),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const deleteSubcomponent = (planningId, columnId, componentPath) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.map(col => {
            if (col.id === columnId) {
              // For delete, we need to remove from parent's subcomponents array
              const parentPath = componentPath.slice(0, -1);
              const targetId = componentPath[componentPath.length - 1];

              if (parentPath.length === 0) {
                // Delete from root level
                return {
                  ...col,
                  components: col.components.filter(comp => comp.id !== targetId)
                };
              } else {
                // Delete from nested level
                return {
                  ...col,
                  components: findAndUpdateComponent(col.components, parentPath, (comp) => ({
                    ...comp,
                    subcomponents: (comp.subcomponents || []).filter(sub => sub.id !== targetId)
                  }))
                };
              }
            }
            return col;
          }),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Calculate Program metrics on-demand
  const calculateProgramMetrics = (planning) => {
    const items = planning?.programItems || [];

    // Total budget
    const totalBudget = items.reduce((sum, item) => sum + (parseFloat(item.estimatedBudget) || 0), 0);

    // Start date (earliest)
    const startDates = items.map(i => i.startDate).filter(Boolean);
    const startDate = startDates.length > 0 ? startDates.sort()[0] : null;

    // End date (latest calculated from start + duration)
    const endDates = items.map(item => {
      if (!item.startDate || !item.estimatedDuration) return null;
      const start = new Date(item.startDate);
      const duration = parseFloat(item.estimatedDuration) || 0;
      const unit = item.durationUnit || 'weeks';

      let daysToAdd = 0;
      if (unit === 'hours') daysToAdd = Math.ceil(duration / 8);
      else if (unit === 'days') daysToAdd = duration;
      else if (unit === 'weeks') daysToAdd = duration * 7;
      else if (unit === 'months') daysToAdd = duration * 30;

      const end = new Date(start);
      end.setDate(end.getDate() + daysToAdd);
      return end.toISOString().split('T')[0];
    }).filter(Boolean);

    const endDate = endDates.length > 0 ? endDates.sort().reverse()[0] : null;

    // Item count by status
    const itemCountByStatus = items.reduce((counts, item) => {
      const status = item.progressStatus || 'not-started';
      counts[status] = (counts[status] || 0) + 1;
      counts.total = (counts.total || 0) + 1;
      return counts;
    }, { planning: 0, 'in-progress': 0, 'on-hold': 0, completed: 0, 'not-started': 0, total: 0 });

    // Gaps addressed
    const allGaps = new Set();
    (planning?.level0Columns || []).forEach(col => {
      (col.components || []).forEach(comp => {
        (comp.gaps || []).forEach(gap => allGaps.add(gap.id || gap));
        (comp.subcomponents || []).forEach(sub => {
          (sub.gaps || []).forEach(gap => allGaps.add(gap.id || gap));
        });
      });
    });

    const addressedGaps = new Set();
    items.forEach(item => {
      (item.selectedGaps || []).forEach(gapId => addressedGaps.add(gapId));
    });

    return {
      totalBudget,
      startDate,
      endDate,
      itemCountByStatus,
      gapsAddressed: {
        addressed: addressedGaps.size,
        total: allGaps.size
      }
    };
  };

  return {
    plannings,
    createPlanning,
    deletePlanning,
    getPlanning,
    updatePlanning,
    updateBusinessGoal,
    addLevel0Column,
    updateLevel0Column,
    deleteLevel0Column,
    addComponent,
    updateComponent,
    deleteComponent,
    addSubcomponent,
    updateSubcomponent,
    deleteSubcomponent,
    // Program operations
    updateProgram,
    calculateProgramMetrics,
    addProgramItem,
    updateProgramItem,
    deleteProgramItem,
    // Program Item operations (legacy - keep for backward compatibility)
    addProgramItem,
    updateProgramItem,
    deleteProgramItem,
    addSolution,
    updateSolution,
    deleteSolution
  };
}
