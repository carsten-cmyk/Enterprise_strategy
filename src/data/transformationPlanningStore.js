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
    const newPlanning = {
      id: Date.now().toString(),
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
      level0Columns: [],
      roadmapItems: [],
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
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        const newColumn = {
          id: Date.now().toString(),
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
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          level0Columns: p.level0Columns.map(col => {
            if (col.id === columnId) {
              const newComponent = {
                id: Date.now().toString(),
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

  // Roadmap Item operations
  const addRoadmapItem = (planningId, roadmapItem) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        const newItem = {
          id: Date.now().toString(),
          name: roadmapItem.name,
          description: roadmapItem.description || '',
          scope: roadmapItem.scope || 'not-touched',
          linkedCapabilities: roadmapItem.linkedCapabilities || [],
          startDate: roadmapItem.startDate || '',
          endDate: roadmapItem.endDate || '',
          owner: roadmapItem.owner || '',
          status: roadmapItem.status || ''
        };
        return {
          ...p,
          roadmapItems: [...p.roadmapItems, newItem],
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const updateRoadmapItem = (planningId, itemId, updates) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          roadmapItems: p.roadmapItems.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const deleteRoadmapItem = (planningId, itemId) => {
    setPlannings(plannings.map(p => {
      if (p.id === planningId) {
        return {
          ...p,
          roadmapItems: p.roadmapItems.filter(item => item.id !== itemId),
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
          linkedRoadmapItems: solution.linkedRoadmapItems || [],
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
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    addSolution,
    updateSolution,
    deleteSolution
  };
}
