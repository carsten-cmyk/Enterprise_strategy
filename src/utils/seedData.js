// Seed data for development and testing
export function seedPeopleVendorsAndGroups() {
  const people = [
    {
      id: Date.now() + 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Person',
      department: 'IT'
    },
    {
      id: Date.now() + 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Person',
      department: 'Finance'
    },
    {
      id: Date.now() + 3,
      name: 'Digital Transformation Team',
      email: 'dt-team@company.com',
      role: 'Team',
      department: 'IT'
    }
  ];

  const vendors = [
    {
      id: Date.now() + 4,
      name: 'Salesforce',
      type: 'Software',
      contactEmail: 'enterprise@salesforce.com',
      status: 'Active'
    },
    {
      id: Date.now() + 5,
      name: 'Microsoft',
      type: 'Cloud',
      contactEmail: 'azure-sales@microsoft.com',
      status: 'Active'
    },
    {
      id: Date.now() + 6,
      name: 'Accenture',
      type: 'Consulting',
      contactEmail: 'consulting@accenture.com',
      status: 'Under Review'
    }
  ];

  const groups = [
    {
      id: Date.now() + 7,
      name: 'Digital Transformation',
      description: 'Strategic initiatives to digitalize customer-facing processes and improve digital capabilities',
      type: 'IT',
      status: 'Active',
      owner: 'Digital Transformation Team'
    },
    {
      id: Date.now() + 8,
      name: 'ERP Transformation',
      description: 'Modernization of core financial and operational systems',
      type: 'Business',
      status: 'Planning',
      owner: 'Michael Chen'
    },
    {
      id: Date.now() + 9,
      name: 'Operations Excellence',
      description: 'Continuous improvement initiatives for operational efficiency',
      type: 'Process',
      status: 'Active',
      owner: 'Sarah Johnson'
    }
  ];

  return { people, vendors, groups };
}

export function seedTransformationPlannings() {
  const baseTime = Date.now();
  const now = new Date().toISOString();
  const today = now.split('T')[0];

  const plannings = [
    {
      id: (baseTime + 1000).toString(),
      name: 'Customer Experience Digital Transformation',
      createdDate: '2025-01-15',
      lastModified: now,
      businessGoal: {
        name: 'Customer Experience Digital Transformation',
        description: 'Transform customer touchpoints and create seamless omnichannel experience',
        currentState: 'Siloed customer data across multiple systems with limited integration',
        desiredState: 'Unified customer view with real-time data access and personalized interactions',
        currentMaturity: 2,
        desiredMaturity: 4
      },
      level0Columns: [
        {
          id: (baseTime + 1001).toString(),
          name: 'Customer Data Platform',
          description: 'Unified platform for customer data management',
          order: 0,
          components: [
            {
              id: (baseTime + 1002).toString(),
              name: 'CRM System',
              description: 'Salesforce implementation for sales and marketing',
              support: 'enhance',
              priority: 'high',
              currentState: 'Legacy CRM with limited features',
              desiredCapability: 'Cloud-based CRM with AI capabilities',
              businessImpact: 'Increase sales conversion by 25%',
              investmentEstimate: '500000',
              timeline: '12 months',
              dependencies: 'Data migration, user training',
              lifecycleStatus: 'In Progress',
              businessOwner: 'Sarah Johnson',
              technicalOwner: 'Michael Chen',
              businessProcess: 'Sales & Marketing',
              vendor: 'Salesforce',
              technologyStack: 'Salesforce Cloud, APIs',
              integrationPoints: 'ERP, Marketing Automation'
            }
          ]
        },
        {
          id: (baseTime + 1003).toString(),
          name: 'Digital Channels',
          description: 'Web and mobile customer touchpoints',
          order: 1,
          components: [
            {
              id: (baseTime + 1004).toString(),
              name: 'Mobile App',
              description: 'Native mobile application for iOS and Android',
              support: 'build',
              priority: 'high',
              currentState: 'No mobile app',
              desiredCapability: 'Full-featured mobile app with personalization',
              businessImpact: 'Reach 2M mobile users',
              investmentEstimate: '800000',
              timeline: '18 months',
              dependencies: 'API gateway, backend services',
              lifecycleStatus: 'Planning',
              businessOwner: 'Digital Transformation Team',
              technicalOwner: 'Michael Chen',
              businessProcess: 'Customer Engagement',
              vendor: 'TBD',
              technologyStack: 'React Native, Node.js',
              integrationPoints: 'CRM, Payment Gateway'
            }
          ]
        }
      ],
      roadmapItems: [
        {
          id: (baseTime + 1005).toString(),
          name: 'CRM Implementation Phase 1',
          description: 'Core CRM functionality deployment',
          scope: 'enhance',
          linkedCapabilities: [(baseTime + 1002).toString()],
          startDate: '2025-03-01',
          endDate: '2025-09-30',
          owner: 'Sarah Johnson',
          status: 'in-progress'
        },
        {
          id: (baseTime + 1006).toString(),
          name: 'Mobile App Development',
          description: 'Design and build mobile application',
          scope: 'build',
          linkedCapabilities: [(baseTime + 1004).toString()],
          startDate: '2025-06-01',
          endDate: '2025-12-31',
          owner: 'Digital Transformation Team',
          status: 'planning'
        }
      ],
      solutions: [
        {
          id: (baseTime + 1007).toString(),
          name: 'Salesforce CRM Implementation',
          description: 'Full Salesforce Sales Cloud and Marketing Cloud implementation',
          scope: 'enhance',
          linkedRoadmapItems: [(baseTime + 1005).toString()],
          investmentBudget: '500000',
          annualLicenseCost: '120000',
          annualMaintenance: '50000',
          vendor: 'Salesforce',
          businessOwner: 'Sarah Johnson',
          technicalOwner: 'Michael Chen',
          expectedGoLive: '2025-09-30',
          latestReview: '2025-10-15',
          nextReview: '2025-11-15',
          currentState: 'Legacy CRM with limited integration',
          desiredState: 'Unified cloud CRM with AI-driven insights',
          gapAnalysis: [
            { gap: 'No marketing automation', id: Date.now() + 100 },
            { gap: 'Limited reporting capabilities', id: Date.now() + 101 }
          ],
          businessImpact: 'Increase sales productivity by 30% and improve customer satisfaction',
          startDate: '2025-03-01',
          endDate: '2025-09-30',
          dependencies: 'Data migration from legacy system',
          actionPlan: [
            { action: 'Complete data migration', owner: 'Michael Chen', deadline: '2025-04-30', id: Date.now() + 102 },
            { action: 'Conduct user training', owner: 'Sarah Johnson', deadline: '2025-08-31', id: Date.now() + 103 }
          ],
          domain: 'Customer Management',
          projectGroup: 'Digital Transformation'
        }
      ]
    },
    {
      id: (baseTime + 2000).toString(),
      name: 'Financial Systems Modernization',
      createdDate: '2025-02-01',
      lastModified: now,
      businessGoal: {
        name: 'Financial Systems Modernization',
        description: 'Modernize financial systems and improve financial reporting capabilities',
        currentState: 'Manual processes and legacy ERP system',
        desiredState: 'Automated financial processes with real-time reporting',
        currentMaturity: 1,
        desiredMaturity: 4
      },
      level0Columns: [
        {
          id: (baseTime + 2001).toString(),
          name: 'ERP System',
          description: 'Core financial management system',
          order: 0,
          components: [
            {
              id: (baseTime + 2002).toString(),
              name: 'Cloud ERP',
              description: 'Microsoft Dynamics 365 Finance',
              support: 'transform',
              priority: 'high',
              currentState: 'On-premise legacy ERP',
              desiredCapability: 'Cloud-based ERP with AI analytics',
              businessImpact: 'Reduce financial close time by 50%',
              investmentEstimate: '1200000',
              timeline: '24 months',
              dependencies: 'Data migration, process reengineering',
              lifecycleStatus: 'Planning',
              businessOwner: 'Michael Chen',
              technicalOwner: 'Digital Transformation Team',
              businessProcess: 'Finance & Accounting',
              vendor: 'Microsoft',
              technologyStack: 'Dynamics 365, Azure',
              integrationPoints: 'Banking, Payroll, Tax systems'
            }
          ]
        }
      ],
      roadmapItems: [
        {
          id: (baseTime + 2003).toString(),
          name: 'ERP Selection and Planning',
          description: 'Vendor selection and implementation planning',
          scope: 'transform',
          linkedCapabilities: [(baseTime + 2002).toString()],
          startDate: '2025-03-01',
          endDate: '2025-06-30',
          owner: 'Michael Chen',
          status: 'planning'
        }
      ],
      solutions: [
        {
          id: (baseTime + 2004).toString(),
          name: 'Microsoft Dynamics 365 Finance Implementation',
          description: 'Cloud ERP implementation with financial management modules',
          scope: 'transform',
          linkedRoadmapItems: [(baseTime + 2003).toString()],
          investmentBudget: '1200000',
          annualLicenseCost: '180000',
          annualMaintenance: '90000',
          vendor: 'Microsoft',
          businessOwner: 'Michael Chen',
          technicalOwner: 'Digital Transformation Team',
          expectedGoLive: '2026-12-31',
          latestReview: '2025-10-10',
          nextReview: '2025-11-10',
          currentState: 'Legacy on-premise ERP with manual processes',
          desiredState: 'Cloud-based ERP with automation and real-time analytics',
          gapAnalysis: [
            { gap: 'No cloud infrastructure', id: Date.now() + 200 },
            { gap: 'Manual reconciliation processes', id: Date.now() + 201 }
          ],
          businessImpact: 'Accelerate financial close by 50% and improve compliance',
          startDate: '2025-07-01',
          endDate: '2026-12-31',
          dependencies: 'Azure infrastructure setup, change management',
          actionPlan: [
            { action: 'Complete vendor selection', owner: 'Michael Chen', deadline: '2025-04-30', id: Date.now() + 202 },
            { action: 'Design future state processes', owner: 'Digital Transformation Team', deadline: '2025-06-30', id: Date.now() + 203 }
          ],
          domain: 'Finance',
          projectGroup: 'ERP Transformation'
        }
      ]
    },
    {
      id: (baseTime + 3000).toString(),
      name: 'Supply Chain Optimization',
      createdDate: '2025-01-20',
      lastModified: now,
      businessGoal: {
        name: 'Supply Chain Optimization',
        description: 'Optimize supply chain operations and improve visibility',
        currentState: 'Limited supply chain visibility and manual forecasting',
        desiredState: 'Real-time supply chain visibility with AI-driven forecasting',
        currentMaturity: 2,
        desiredMaturity: 4
      },
      level0Columns: [
        {
          id: (baseTime + 3001).toString(),
          name: 'Supply Chain Management',
          description: 'End-to-end supply chain operations',
          order: 0,
          components: [
            {
              id: (baseTime + 3002).toString(),
              name: 'Warehouse Management System',
              description: 'WMS for inventory and warehouse operations',
              support: 'leverage',
              priority: 'medium',
              currentState: 'Basic WMS with limited automation',
              desiredCapability: 'Advanced WMS with robotics integration',
              businessImpact: 'Reduce inventory costs by 20%',
              investmentEstimate: '400000',
              timeline: '15 months',
              dependencies: 'Robotics procurement, warehouse layout redesign',
              lifecycleStatus: 'Planned',
              businessOwner: 'Sarah Johnson',
              technicalOwner: 'Michael Chen',
              businessProcess: 'Warehouse Operations',
              vendor: 'TBD',
              technologyStack: 'WMS Software, IoT sensors',
              integrationPoints: 'ERP, Transportation Management'
            }
          ]
        }
      ],
      roadmapItems: [
        {
          id: (baseTime + 3003).toString(),
          name: 'WMS Enhancement Project',
          description: 'Upgrade warehouse management capabilities',
          scope: 'leverage',
          linkedCapabilities: [(baseTime + 3002).toString()],
          startDate: '2025-04-01',
          endDate: '2025-09-30',
          owner: 'Sarah Johnson',
          status: 'planning'
        }
      ],
      solutions: [
        {
          id: (baseTime + 3004).toString(),
          name: 'Advanced WMS Implementation',
          description: 'Upgrade to advanced warehouse management with automation',
          scope: 'leverage',
          linkedRoadmapItems: [(baseTime + 3003).toString()],
          investmentBudget: '400000',
          annualLicenseCost: '60000',
          annualMaintenance: '30000',
          vendor: 'TBD',
          businessOwner: 'Sarah Johnson',
          technicalOwner: 'Michael Chen',
          expectedGoLive: '2025-09-30',
          latestReview: '2025-10-12',
          nextReview: '2025-11-12',
          currentState: 'Basic WMS with manual processes',
          desiredState: 'Automated WMS with real-time inventory tracking',
          gapAnalysis: [
            { gap: 'No automation capabilities', id: Date.now() + 300 },
            { gap: 'Limited real-time visibility', id: Date.now() + 301 }
          ],
          businessImpact: 'Reduce inventory carrying costs and improve order fulfillment speed',
          startDate: '2025-04-01',
          endDate: '2025-09-30',
          dependencies: 'Warehouse infrastructure upgrades',
          actionPlan: [
            { action: 'Complete vendor evaluation', owner: 'Sarah Johnson', deadline: '2025-05-15', id: Date.now() + 302 },
            { action: 'Deploy automation equipment', owner: 'Michael Chen', deadline: '2025-08-31', id: Date.now() + 303 }
          ],
          domain: 'Supply Chain',
          projectGroup: 'Operations Excellence'
        }
      ]
    }
  ];

  return plannings;
}

// Function to populate localStorage with seed data
export function seedDatabase() {
  try {
    // Seed people, vendors, and groups in settings
    const { people, vendors, groups } = seedPeopleVendorsAndGroups();
    const settingsData = {
      state: {
        currency: 'DKK',
        vendors,
        people,
        groups
      },
      version: 0
    };
    localStorage.setItem('settings-storage', JSON.stringify(settingsData));

    // Seed transformation plannings
    const plannings = seedTransformationPlannings();
    localStorage.setItem('transformationPlannings', JSON.stringify(plannings));

    console.log('✅ Database seeded successfully!');
    console.log(`   - ${people.length} people added`);
    console.log(`   - ${vendors.length} vendors added`);
    console.log(`   - ${groups.length} project groups added`);
    console.log(`   - ${plannings.length} transformation plannings added`);

    return {
      success: true,
      message: 'Database seeded successfully',
      data: { people, vendors, groups, plannings }
    };
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    return {
      success: false,
      message: 'Failed to seed database',
      error: error.message
    };
  }
}

// Function to clear all data
export function clearDatabase() {
  try {
    localStorage.removeItem('settings-storage');
    localStorage.removeItem('transformationPlannings');
    console.log('✅ Database cleared successfully!');
    return { success: true, message: 'Database cleared successfully' };
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    return { success: false, message: 'Failed to clear database', error: error.message };
  }
}
