export const seedPlanningData = (planningId, transformationPlanningStore) => {
  const {
    updateBusinessGoal,
    updateProgram,
    addLevel0Column,
    addComponent,
    addProgramItem,
    addSolution
  } = transformationPlanningStore;

  // Update business goal with proper current and desired state
  updateBusinessGoal(planningId, {
    name: 'Øge omsætning via eksisterende og nye leads',
    description: 'Målsætningen er at øge omsætning med 20% på eksisterende berøringsflade gennem implementering af struktureret salgsstyring',
    currentState: 'Vi håndterer leads og kunder uden en samlet struktur. Receptionen distribuerer leads tilfældigt, vi mangler viden om antal leads, vinderrate og pipeline. Ingen systematisk opfølgning eller forecasting. Sælgere arbejder isoleret uden fælles processer.',
    desiredState: 'Komplet CRM-baseret salgsstyring med struktureret leadhåndtering, automatisk routing til rette sælgere, centraliseret registrering af alle kontakter, realtids pipeline-oversigt, systematisk opfølgning, budgetter på kunde- og sælgerniveau, samt præcis forecasting.',
    currentMaturity: 1,
    desiredMaturity: 4
  });

  // Update program information
  updateProgram(planningId, {
    name: 'Sales Excellence Program 2024',
    executiveSummary: `## Program Overview

This comprehensive transformation program aims to modernize our sales operations through a structured CRM implementation and process optimization initiative.

## Key Objectives
- Increase revenue by 20% through improved lead management
- Reduce lead response time by 60%
- Improve sales forecast accuracy to 90%+
- Implement centralized customer database`,
    businessCase: `**Investment:** DKK 2.5M over 12 months
**Expected Return:** 20% revenue increase (DKK 8M annually)
**Payback Period:** 4.5 months

### Benefits
- **Operational Excellence:** Structured processes reduce manual work by 40%
- **Revenue Growth:** Better lead management and follow-up increase win rate from 15% to 25%
- **Strategic Insight:** Real-time pipeline visibility enables data-driven decisions
- **Customer Satisfaction:** Faster response times and better service

### Risk Mitigation
- Phased rollout minimizes business disruption
- Dedicated change management ensures user adoption
- Proven technology stack reduces implementation risk`
  });

  // ====== PROCESS 1: Inbound Leads ======
  const process1Id = addLevel0Column(planningId, {
    name: 'Inbound Leads',
    description: 'Første kontakt med potentielle emner - håndtering af indkomne forespørgsler fra web, email og telemarketing'
  });

  const comp1Id = addComponent(planningId, process1Id, {
    name: 'Lead Reception & Distribution',
    description: 'Modtagelse og fordeling af indkomne leads fra forskellige kanaler',
    support: 'transform',
    priority: 'high',
    currentState: 'Indkomne mails fra web håndteres af receptionen hver morgen. Leads fordeles tilfældigt til sælgere uden hensyn til kompetencer eller kapacitet. Telemarketing-leads sendes samlet hver fredag. Reaktionstid er ukendt, og vi ved ikke hvor mange leads vi modtager eller mister.',
    desiredCapability: 'Centralt CRM system med automatisk lead-registrering, intelligent routing baseret på kompetencer og kapacitet, samt realtids notifikationer til relevante sælgere',
    businessImpact: 'Reduceret responstid fra 2-3 dage til under 2 timer vil øge win-rate med estimeret 10-15 procentpoint. Bedre routing sikrer at leads kommer til de rette sælgere med relevant erfaring.',
    gaps: [
      { id: 'gap-1-1', title: 'Lead Tracking', description: 'Mangler centralt system til at registrere og tracke alle indkomne leads' },
      { id: 'gap-1-2', title: 'Intelligent Routing', description: 'Ingen automatisk fordeling baseret på sælger-kompetencer' },
      { id: 'gap-1-3', title: 'Response Time', description: 'Manglende processer for hurtig opfølgning på leads' },
      { id: 'gap-1-4', title: 'Lead Analytics', description: 'Ingen data om lead-volumen, kilder eller konverteringsrater' }
    ]
  });

  // ====== PROCESS 2: Lead Qualification ======
  const process2Id = addLevel0Column(planningId, {
    name: 'Lead Qualification',
    description: 'Kvalificering og vurdering af leads - sælgerne modtager og bearbejder potentielle kunder'
  });

  const comp2Id = addComponent(planningId, process2Id, {
    name: 'Lead Assessment & Scoring',
    description: 'Systematisk vurdering af lead-kvalitet og potentiale',
    support: 'transform',
    priority: 'high',
    currentState: 'Sælgere vurderer leads individuelt uden fælles kriterier. Ingen struktureret kvalificeringsproces eller scoring. Information om leads gemmes i forskellige formater (emails, noter, Excel). Manglende viden om lead-status på tværs af sælgere. Ofte falder leads på gulvet hvis sælger er optaget.',
    desiredCapability: 'Standardiseret kvalificeringsproces i CRM med BANT-kriterier (Budget, Authority, Need, Timeline). Automatisk lead-scoring baseret på adfærd og firmografi. Synlig pipeline med klare stages og handlinger for hver fase.',
    businessImpact: 'Fokuseret indsats på højværdi-leads øger effektiviteten med 30%. Standardiseret proces sikrer ingen leads mistes. Real-time visibility giver ledelsen bedre forecast-grundlag.',
    gaps: [
      { id: 'gap-2-1', title: 'Qualification Framework', description: 'Mangler fælles kriterier for lead-kvalificering' },
      { id: 'gap-2-2', title: 'Lead Scoring', description: 'Ingen automatisk prioritering af leads baseret på potentiale' },
      { id: 'gap-2-3', title: 'Pipeline Visibility', description: 'Kan ikke se samlet pipeline eller lead-status' },
      { id: 'gap-2-4', title: 'Activity Tracking', description: 'Ingen systematisk registrering af kundeinteraktioner' }
    ]
  });

  // ====== PROCESS 3: Opportunity Management ======
  const process3Id = addLevel0Column(planningId, {
    name: 'Opportunity Management',
    description: 'Tilbudsgivning, forhandling og opfølgning på salgsmuligheder'
  });

  const comp3Id = addComponent(planningId, process3Id, {
    name: 'Proposal & Negotiation',
    description: 'Udarbejdelse af tilbud og styring af forhandlingsprocessen',
    support: 'enhance',
    priority: 'high',
    currentState: 'Tilbud udarbejdes i Word-skabeloner uden central registrering. Ingen tracking af tilbuds-status eller opfølgning. Sælgere holder tilbud for sig selv for at optimere eget budget. Ledelsen har ingen oversigt over samlet pipeline-værdi eller forecast. Win/loss-analyse sker ikke systematisk.',
    desiredCapability: 'CRM-integreret tilbudsstyring med version-kontrol, automatiske opfølgningspåmindelser og pipeline-rapportering. Synlig forecast for hele organisationen med konfidensniveauer. Systematisk win/loss-analyse for kontinuerlig forbedring.',
    businessImpact: 'Øget win-rate fra 15% til 25% gennem bedre opfølgning og timing. Præcis forecasting muliggør bedre ressourceplanlægning. Win/loss-analyse driver proces-forbedringer.',
    gaps: [
      { id: 'gap-3-1', title: 'Proposal Tracking', description: 'Ingen centraliseret registrering af tilbud og deres status' },
      { id: 'gap-3-2', title: 'Follow-up Process', description: 'Mangler systematisk opfølgningsproces' },
      { id: 'gap-3-3', title: 'Pipeline Forecast', description: 'Kan ikke forecaste samlet pipeline-værdi' },
      { id: 'gap-3-4', title: 'Win/Loss Analysis', description: 'Ingen struktureret læring fra vundne/tabte tilbud' }
    ]
  });

  // ====== PROCESS 4: Customer Management ======
  const process4Id = addLevel0Column(planningId, {
    name: 'Customer Management',
    description: 'Løbende håndtering af eksisterende kunder efter ordrevinding'
  });

  const comp4Id = addComponent(planningId, process4Id, {
    name: 'Account Management & Growth',
    description: 'Strategisk kundestyring med fokus på retention og growth',
    support: 'enhance',
    priority: 'medium',
    currentState: 'Sælgere har generelt godt fat i deres kunder, men ingen systematik. Mangler kundeklassificering og prioritering. Ingen budgetter eller kontaktplaner på kundeniveau. Upsell og cross-sell sker opportunistisk. Kunde-data er spredt i forskellige systemer. Account-reviews sker ikke systematisk.',
    desiredCapability: 'CRM-baseret account management med kunde-segmentering (A/B/C), strategiske account plans, budgetter og pipeline pr. kunde. Proaktive kontaktplaner baseret på kunde-værdi. Systematiske QBR (Quarterly Business Reviews) med nøglekunder. Fuld visibility i kunde-historik og touchpoints.',
    businessImpact: 'Fokuseret indsats på A-kunder øger customer lifetime value med 30%. Proaktiv account management reducerer churn fra 8% til under 5%. Systematisk upsell/cross-sell tilføjer 15% ekstra revenue.',
    gaps: [
      { id: 'gap-4-1', title: 'Customer Segmentation', description: 'Ingen systematisk klassificering og prioritering af kunder' },
      { id: 'gap-4-2', title: 'Account Plans', description: 'Mangler strategiske planer for nøglekunder' },
      { id: 'gap-4-3', title: 'Revenue Tracking', description: 'Kan ikke tracke budget og potential pr. kunde' },
      { id: 'gap-4-4', title: 'Customer Health', description: 'Ingen early warning system for churn-risiko' }
    ]
  });

  // ====== PROGRAM ITEMS ======
  const programItem1Id = addProgramItem(planningId, {
    name: 'CRM Platform Selection & Setup',
    description: 'Evaluering, valg og opsætning af CRM-platform',
    strategy: 'new-build',
    linkedCapabilities: [comp1Id, comp2Id],
    startDate: new Date().toISOString(),
    estimatedDuration: 8,
    durationUnit: 'weeks',
    businessOwner: 'person-1', // Lars Nielsen
    technicalOwner: 'person-2', // Maria Hansen
    vendor: 'vendor-1', // Salesforce
    investmentBudget: '350000',
    progressStatus: 'completed',

    // Assessment data
    selectedAsIsComponents: [comp1Id, comp2Id],
    asIsUserNotes: 'Nuværende lead-proces er helt manuel og ustruktureret. Receptionen håndterer indkomne leads uden system.',
    selectedToBeComponents: [comp1Id, comp2Id],
    toBeUserNotes: 'Salesforce Sales Cloud vil centralisere lead-management med automatisk routing og real-time notifications.',
    selectedBusinessImpactComponents: [comp1Id, comp2Id],
    businessImpactUserNotes: 'Primær påvirkning på lead-respons (hurtigere) og kvalificering (bedre). Estimeret 10-15% øget win-rate.',
    selectedGaps: ['gap-1-1', 'gap-1-2', 'gap-1-3', 'gap-1-4', 'gap-2-1', 'gap-2-2', 'gap-2-3']
  });

  const programItem2Id = addProgramItem(planningId, {
    name: 'Sales Process Redesign',
    description: 'Redesign af salgsprocesser og implementering af nye workflows',
    strategy: 'transform',
    linkedCapabilities: [comp2Id, comp3Id],
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 12,
    durationUnit: 'weeks',
    businessOwner: 'person-1',
    technicalOwner: 'person-2',
    vendor: 'TBD',
    investmentBudget: '450000',
    progressStatus: 'in-progress',

    selectedAsIsComponents: [comp2Id, comp3Id],
    asIsUserNotes: 'Sælgerne arbejder med egne metoder uden fælles struktur. Tilbud trackes ikke systematisk.',
    selectedToBeComponents: [comp2Id, comp3Id],
    toBeUserNotes: 'Standardiserede processer med klare stages, automatisk scoring og systematisk opfølgning.',
    selectedBusinessImpactComponents: [comp2Id, comp3Id],
    businessImpactUserNotes: 'Vil øge win-rate betydeligt gennem bedre kvalificering og timing. Forbedret forecast-præcision.',
    selectedGaps: ['gap-2-2', 'gap-2-3', 'gap-2-4', 'gap-3-1', 'gap-3-2', 'gap-3-3']
  });

  const programItem3Id = addProgramItem(planningId, {
    name: 'Account Management Framework',
    description: 'Implementering af struktureret account management',
    strategy: 'enhance',
    linkedCapabilities: [comp4Id],
    startDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 10,
    durationUnit: 'weeks',
    businessOwner: 'person-1',
    technicalOwner: 'person-2',
    vendor: 'vendor-1',
    investmentBudget: '280000',
    progressStatus: 'not-started',

    selectedAsIsComponents: [comp4Id],
    asIsUserNotes: 'Kundestyring foregår ad-hoc uden systematik eller prioritering.',
    selectedToBeComponents: [comp4Id],
    toBeUserNotes: 'ABC-segmentering med strategiske account plans og proaktive kontaktplaner.',
    selectedBusinessImpactComponents: [comp4Id],
    businessImpactUserNotes: 'Øget kunde-retention og lifetime value gennem fokuseret account management.',
    selectedGaps: ['gap-4-1', 'gap-4-2', 'gap-4-3', 'gap-4-4']
  });

  const programItem4Id = addProgramItem(planningId, {
    name: 'Change Management & Training',
    description: 'User adoption program og træning af salgsteam',
    strategy: 'new-build',
    linkedCapabilities: [comp1Id, comp2Id, comp3Id, comp4Id],
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 16,
    durationUnit: 'weeks',
    businessOwner: 'person-1',
    technicalOwner: 'person-3',
    vendor: 'TBD',
    investmentBudget: '180000',
    progressStatus: 'not-started',

    selectedAsIsComponents: [comp1Id, comp2Id, comp3Id, comp4Id],
    asIsUserNotes: 'Ingen formaliseret træning. Sælgere lærer gennem trial-and-error.',
    selectedToBeComponents: [comp1Id, comp2Id, comp3Id, comp4Id],
    toBeUserNotes: 'Struktureret onboarding og løbende træningsprogram. Change champions i hvert team.',
    selectedBusinessImpactComponents: [comp1Id, comp2Id, comp3Id, comp4Id],
    businessImpactUserNotes: 'Kritisk for bruger-adoption. Sikrer at investeringen realiseres gennem faktisk brug.',
    selectedGaps: []
  });

  // ====== SOLUTIONS (Projects created from Program Items) ======
  addSolution(planningId, {
    planningId: planningId,
    programId: null,
    programItemId: programItem1Id,

    name: 'Salesforce Sales Cloud Implementation',
    description: 'Implementation of Salesforce Sales Cloud as the core CRM platform',
    strategy: 'new-build',
    group: 'group-1',

    // Business Context (inherited from planning/program)
    businessGoal: 'Målsætningen er at øge omsætning med 20% på eksisterende berøringsflade gennem implementering af struktureret salgsstyring',
    businessCase: 'Investment: DKK 2.5M over 12 months. Expected Return: 20% revenue increase (DKK 8M annually). Payback Period: 4.5 months.',

    // Assessment (inherited from program item)
    selectedAsIsProgramItems: [],
    selectedAsIsComponents: [comp1Id, comp2Id],
    asIsUserNotes: 'Nuværende lead-proces er helt manuel og ustruktureret. Receptionen håndterer indkomne leads uden system.',
    selectedToBeProgramItems: [],
    selectedToBeComponents: [comp1Id, comp2Id],
    toBeUserNotes: 'Salesforce Sales Cloud vil centralisere lead-management med automatisk routing og real-time notifications.',
    selectedBusinessImpactProgramItems: [],
    selectedBusinessImpactComponents: [comp1Id, comp2Id],
    businessImpactUserNotes: 'Primær påvirkning på lead-respons (hurtigere) og kvalificering (bedre). Estimeret 10-15% øget win-rate.',

    gaps: [
      { id: 'gap-1-1', title: 'Lead Tracking', description: 'Mangler centralt system til at registrere og tracke alle indkomne leads', isInherited: true, sourceComponentId: comp1Id },
      { id: 'gap-1-2', title: 'Intelligent Routing', description: 'Ingen automatisk fordeling baseret på sælger-kompetencer', isInherited: true, sourceComponentId: comp1Id },
      { id: 'gap-1-3', title: 'Response Time', description: 'Manglende processer for hurtig opfølgning på leads', isInherited: true, sourceComponentId: comp1Id },
      { id: 'gap-1-4', title: 'Lead Analytics', description: 'Ingen data om lead-volumen, kilder eller konverteringsrater', isInherited: true, sourceComponentId: comp1Id }
    ],

    // Execution
    expectedStart: new Date().toISOString(),
    estimatedDuration: 6,
    durationUnit: 'months',
    dependencies: [],
    businessOwner: 'person-1',
    technicalOwner: 'person-2',
    vendor: 'vendor-1',
    implementationPartner: 'vendor-1',

    investmentBudget: '1200000',
    annualLicenseCost: '240000',
    annualMaintenance: '120000',
    latestReview: '',
    nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),

    actions: [
      {
        id: 'action-1-1',
        description: 'Complete technical infrastructure setup',
        owner: 'person-2',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in-progress'
      },
      {
        id: 'action-1-2',
        description: 'Configure lead routing rules',
        owner: 'person-2',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: 'action-1-3',
        description: 'Import existing customer data',
        owner: 'person-1',
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      }
    ],

    domain: 'Sales',
    projectGroup: 'group-1',
    linkedProgramItems: [],

    // Sync tracking
    analysisLastSyncedAt: new Date().toISOString()
  });

  addSolution(planningId, {
    planningId: planningId,
    programId: null,
    programItemId: programItem2Id,

    name: 'Sales Process Optimization',
    description: 'Redesign and implementation of standardized sales processes',
    strategy: 'transform',
    group: 'group-2',

    businessGoal: 'Målsætningen er at øge omsætning med 20% på eksisterende berøringsflade gennem implementering af struktureret salgsstyring',
    businessCase: 'Investment: DKK 2.5M over 12 months. Expected Return: 20% revenue increase (DKK 8M annually). Payback Period: 4.5 months.',

    selectedAsIsComponents: [comp2Id, comp3Id],
    asIsUserNotes: 'Sælgerne arbejder med egne metoder uden fælles struktur. Tilbud trackes ikke systematisk.',
    selectedToBeComponents: [comp2Id, comp3Id],
    toBeUserNotes: 'Standardiserede processer med klare stages, automatisk scoring og systematisk opfølgning.',
    selectedBusinessImpactComponents: [comp2Id, comp3Id],
    businessImpactUserNotes: 'Vil øge win-rate betydeligt gennem bedre kvalificering og timing. Forbedret forecast-præcision.',

    gaps: [
      { id: 'gap-2-2', title: 'Lead Scoring', description: 'Ingen automatisk prioritering af leads baseret på potentiale', isInherited: true, sourceComponentId: comp2Id },
      { id: 'gap-3-1', title: 'Proposal Tracking', description: 'Ingen centraliseret registrering af tilbud og deres status', isInherited: true, sourceComponentId: comp3Id },
      { id: 'gap-3-2', title: 'Follow-up Process', description: 'Mangler systematisk opfølgningsproces', isInherited: true, sourceComponentId: comp3Id }
    ],

    expectedStart: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 4,
    durationUnit: 'months',
    businessOwner: 'person-1',
    technicalOwner: 'person-2',
    vendor: 'TBD',
    implementationPartner: '',

    investmentBudget: '450000',
    annualLicenseCost: '0',
    annualMaintenance: '50000',

    actions: [
      {
        id: 'action-2-1',
        description: 'Map current sales process',
        owner: 'person-1',
        deadline: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: 'action-2-2',
        description: 'Design future state process',
        owner: 'person-1',
        deadline: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      }
    ],

    domain: 'Sales',
    projectGroup: 'group-2',

    analysisLastSyncedAt: new Date().toISOString()
  });

  console.log('✅ Comprehensive planning data with 4 processes, program items, and solutions successfully seeded!');
};

// Seed the entire database with dummy data
export const seedDatabase = () => {
  try {
    // Import stores - we'll access them via localStorage directly
    const settingsData = {
      currency: 'DKK',
      vendors: [
        {
          id: 'vendor-1',
          name: 'Salesforce',
          type: 'Software',
          contactEmail: 'contact@salesforce.com',
          contactName: 'John Smith',
          status: 'Active'
        },
        {
          id: 'vendor-2',
          name: 'Microsoft',
          type: 'Software',
          contactEmail: 'contact@microsoft.com',
          contactName: 'Jane Doe',
          status: 'Active'
        },
        {
          id: 'vendor-3',
          name: 'HubSpot',
          type: 'Software',
          contactEmail: 'contact@hubspot.com',
          contactName: 'Bob Johnson',
          status: 'Active'
        }
      ],
      people: [
        {
          id: 'person-1',
          name: 'Lars Nielsen',
          email: 'lars.nielsen@company.com',
          role: 'Person',
          department: 'Sales',
          phone: '+45 12 34 56 78'
        },
        {
          id: 'person-2',
          name: 'Maria Hansen',
          email: 'maria.hansen@company.com',
          role: 'Person',
          department: 'IT',
          phone: '+45 23 45 67 89'
        },
        {
          id: 'person-3',
          name: 'Sales Team',
          email: 'sales-team@company.com',
          role: 'Team',
          department: 'Sales',
          phone: '+45 34 56 78 90'
        }
      ],
      groups: [
        {
          id: 'group-1',
          name: 'CRM Implementation',
          description: 'Customer Relationship Management system rollout',
          type: 'IT',
          status: 'Active',
          owner: 'Maria Hansen'
        },
        {
          id: 'group-2',
          name: 'Sales Process Optimization',
          description: 'Improving sales workflows and procedures',
          type: 'Process',
          status: 'Planning',
          owner: 'Lars Nielsen'
        },
        {
          id: 'group-3',
          name: 'Customer Service Enhancement',
          description: 'Upgrading customer support capabilities',
          type: 'People',
          status: 'Active',
          owner: 'Sales Team'
        }
      ]
    };

    // Update settings storage
    localStorage.setItem('settings-storage', JSON.stringify({ state: settingsData, version: 0 }));

    console.log('✅ Settings data seeded successfully!');

    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: error.message };
  }
};

// Clear all database data
export const clearDatabase = () => {
  try {
    // Clear all relevant localStorage keys
    localStorage.removeItem('transformationPlannings');
    localStorage.removeItem('settings-storage');

    return { success: true };
  } catch (error) {
    console.error('Error clearing database:', error);
    return { success: false, message: error.message };
  }
};
