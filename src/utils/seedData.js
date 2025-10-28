export const seedPlanningData = (planningId, transformationPlanningStore) => {
  const {
    updateBusinessGoal,
    addLevel0Column,
    addComponent,
    addSubcomponent,
    getPlanning
  } = transformationPlanningStore;

  // Update business goal with proper current and desired state
  updateBusinessGoal(planningId, {
    name: 'Øge omsætning via eksisterende og nye leads',
    description: 'Målsætningen er at øge omsætning med 20% på eksisterende berøringsflade',
    currentState: 'Vi håndterer leads og kunder uden en samlet struktur. Receptionen distribuerer leads tilfældigt, vi mangler viden om antal leads, vinderrate og pipeline. Ingen systematisk opfølgning eller forecasting. Sælgere arbejder isoleret uden fælles processer.',
    desiredState: 'Komplet CRM-baseret salgsstyring med struktureret leadhåndtering, automatisk routing til rette sælgere, centraliseret registrering af alle kontakter, realtids pipeline-oversigt, systematisk opfølgning, budgetter på kunde- og sælgerniveau, samt præcis forecasting.',
    currentMaturity: 1,
    desiredMaturity: 4
  });

  // Level 0 Capability 1: Inbound leads
  const column1Id = addLevel0Column(planningId, {
    name: 'Inbound leads',
    description: 'Første kontakt med potentielle emner'
  });

  // Component 1.1: Inbound mails
  addComponent(planningId, column1Id, {
    name: 'Inbound mails',
    description: 'Indkomne mails er fra web eller sendt direkte til sælgere.',
    support: 'primary',
    priority: 'high',
    currentState: 'Indkomne mails fra web som håndteres af receptionen. De ser på det hver morgen til vores forskellige sælgere. Det er tilfældigt hvem der får hvad. Der indkommer også et mindre antal forespørgsler fra eksisterende kunde og leads via netværk. De skriver direkte til sælgerne. Vi kender ikke reaktionstiden eller hvor mange. Vi kender selvfølgelig dem som bliver til ordre.',
    desiredCapability: 'Centralt CRM system der automatisk registrerer alle indkomne leads med routing baseret på kompetencer og kapacitet',
    businessImpact: 'Vi tror at vi kan vinde væsentligt flere opgaver ved at indføre en struktur. Vi vil kunne forecaste og følge op på budgetter',
    gaps: [
      { id: Date.now() + '-1', description: 'Have styr på alle indkomne leads' },
      { id: Date.now() + '-2', description: 'Route forespørgsler/leads til de sælgere som har erfaring' },
      { id: Date.now() + '-3', description: 'Ensartet flow' },
      { id: Date.now() + '-4', description: 'Bedre erfaringsudveksling ved diskussion af leads' },
      { id: Date.now() + '-5', description: 'Bedre budgetter til sælgerne' },
      { id: Date.now() + '-6', description: 'Viden om antallet af inkomne leads, vundne leads, tabte' },
      { id: Date.now() + '-7', description: 'Forecasting' }
    ]
  });

  // Component 1.2: Telemarketing
  addComponent(planningId, column1Id, {
    name: 'Telemarketing',
    description: 'Emner der kommer fra telemarketing',
    support: 'secondary',
    priority: 'low',
    currentState: 'Alle emner sendes idag til receptionen som videreformidler dem til sælgerne hver fredag. Der er ingen struktur for hvem der får dem.',
    desiredCapability: 'Telemarketing opretter leads direkte i CRM systemet',
    businessImpact: 'Vi tror at emner er mere "varme" i dagene efter at telemarketing har talt med dem og derfor er mere motiveret for møder med os. Altså flere leads længere nede i salgstrakten',
    gaps: [
      { id: Date.now() + '-8', description: 'Telemarketing skal oprette leads i centralt system så vi hurtigere kan se emnerne' }
    ]
  });

  // Level 0 Capability 2: Salgskontakt
  const column2Id = addLevel0Column(planningId, {
    name: 'Salgskontakt',
    description: 'Sælgerne modtager lead og behandler dem'
  });

  // Component 2.1: Kvalificering af lead
  const component2_1Id = addComponent(planningId, column2Id, {
    name: 'Kvalificering af lead',
    description: 'Kvalificering af leads sker af sælgerne',
    support: 'primary',
    priority: 'high',
    currentState: 'Sælgerne modtager mails fra receptionen og tager kontakt til dem på baggrund af den information der følger med i mails. De mails hvor kunden skriver direkte til sælgeren er proceduren den samme.',
    desiredCapability: 'Struktureret kvalificeringsproces i CRM med standard kriterier og routing baseret på kompetencer',
    businessImpact: 'Vi kan lukke væsentligt flere kunder ved at have en proces hvor vi registrerer alt fra lead til kunde. Vi tror der falder for mange leads på gulvet ved at sælgerne ikke lige har tid til at kontakte lead. Vi vil bedre kunne route leads mellem sælgere så vi bliver mere effektive. Sælgere har oftest en motivation til at holde på emner fordi det potentielt kommer under deres omsætningsbudget',
    gaps: [
      { id: Date.now() + '-9', description: 'Vi mangler en struktur for hele processen fra lead til kunde' },
      { id: Date.now() + '-10', description: 'Viden om hvor mange leads sælgeren arbejder på' },
      { id: Date.now() + '-11', description: 'Viden om hvor meget økonomi der er i de indkomne leads' },
      { id: Date.now() + '-12', description: 'Routing af leads til de sælgere der har erfaring med området' }
    ]
  });

  // Add subcomponents to "Kvalificering af lead"
  addSubcomponent(planningId, column2Id, [component2_1Id], {
    name: 'Registrer at vi har ringet til kunden',
    description: 'Ring',
    support: 'primary',
    priority: 'high',
    currentState: 'Ingen systematisk registrering',
    desiredCapability: 'Automatisk logging af alle kundekontakter',
    businessImpact: 'Bedre sporbarhed og opfølgning'
  });

  addSubcomponent(planningId, column2Id, [component2_1Id], {
    name: 'Skriv mail til kunden',
    description: 'Mailkommunikation med leads',
    support: 'secondary',
    priority: 'high',
    currentState: 'Emails sendes uden centraliseret registrering',
    desiredCapability: 'Integration mellem mailsystem og CRM',
    businessImpact: 'Komplet kommunikationshistorik tilgængelig for alle sælgere'
  });

  // Level 0 Capability 3: Tilbudsgivning og opfølgning
  const column3Id = addLevel0Column(planningId, {
    name: 'Tilbudsgivning og opfølgning',
    description: 'Afgivelse af tilbud, tilpasninger og opfølgning'
  });

  // Component 3.1: Tilbud
  addComponent(planningId, column3Id, {
    name: 'Tilbud',
    description: 'Tilbud til potentielle kunder eller eksisterende kunder',
    support: 'primary',
    priority: 'high',
    currentState: 'Ligesom med leads har vi ikke registreret hvilke tilbud vi har ude. Det giver udfordringer ift. om der bliver fulgt op på dem. Vi kan ikke estimere vores pipeline. Vi ved ikke hvor mange vi taber eller vinder. Sælgerene holder på leads/tilbud for at optimere deres salgsbudget. Vi kender ikke om vi samlet set som organisation er foran eller bagud ift. budget. Tilbud afgives med vores tilbudsskabeloner så her er struktur.',
    desiredCapability: 'Tilbud registreres i CRM med status tracking, automatiske påmindelser og pipeline oversigt',
    businessImpact: 'Vi får en ide om hvor forretningen er på vej hen og hvor vi skal sætte ind.',
    gaps: [
      { id: Date.now() + '-13', description: 'Viden om hvor meget vi vinder og taber' },
      { id: Date.now() + '-14', description: 'Forecast til hele forretningen' },
      { id: Date.now() + '-15', description: 'Route leads til sælgere som ikke har travlt for at skabe bedre vinderchancer' }
    ]
  });

  // Level 0 Capability 4: Kundehåndtering
  const column4Id = addLevel0Column(planningId, {
    name: 'Kundehåndtering',
    description: 'Tilbud bliver til ordre og sælgerne får ansvaret for en kunde'
  });

  // Component 4.1: Kunder
  addComponent(planningId, column4Id, {
    name: 'Kunder',
    description: 'Håndtering af vores kunder',
    support: 'primary',
    priority: 'medium',
    currentState: 'Sælgerne har generelt godt fat i alle vores kunder. Kunderne er tilfredse, men vi har ikke en struktur som gør at sælgere kan prioritere hvilke kunder der er væsentlige for virksomheden. Det er op til den enkelte sælger. Vi har ikke budgetter på de enkelte kunder og ingen planer for hvornår de kontaktes.',
    desiredCapability: 'Komplet kundedatabase med segmentering, budgetter, kontaktplaner og historik',
    businessImpact: 'En struktur for kunderne vil betyde mere fokus på dem der er væsentlige for virksomheden. Vi skal have budgetter så vi kan se både hvor mange projekter hver kunde har men også kunne forecaste for hele virksomheden',
    gaps: [
      { id: Date.now() + '-16', description: 'Budgetter på kunderne' },
      { id: Date.now() + '-17', description: 'Plan for kontakt af kunder' },
      { id: Date.now() + '-18', description: 'Styr på stamdata' },
      { id: Date.now() + '-19', description: 'Struktur så kunderne kan segmenteres og prioriteres' },
      { id: Date.now() + '-20', description: 'Mulighed for at se virksomhedens potentiale på tværs af kunder ift omsætning' }
    ]
  });

  console.log('✅ Data successfully seeded!');
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

    // Create transformation plannings
    const plannings = [
      {
        id: `planning-${Date.now()}-1`,
        name: 'CRM Transformation 2024',
        businessGoal: {
          name: 'Implement CRM System',
          description: 'Roll out Salesforce CRM to increase sales by 20%',
          currentState: 'No centralized CRM system',
          desiredState: 'Fully integrated Salesforce CRM with automated workflows',
          currentMaturity: 1,
          desiredMaturity: 4
        },
        level0Columns: [],
        programItems: [
          {
            id: `program-${Date.now()}-1`,
            name: 'CRM Platform Selection',
            linkedCapabilities: [],
            status: 'completed',
            expectedStart: new Date().toISOString(),
            estimatedDuration: 2,
            durationUnit: 'months',
            owner: 'Maria Hansen',
            scope: 'leverage'
          },
          {
            id: `program-${Date.now()}-2`,
            name: 'CRM Implementation',
            linkedCapabilities: [],
            status: 'in-progress',
            expectedStart: new Date().toISOString(),
            estimatedDuration: 6,
            durationUnit: 'months',
            owner: 'Maria Hansen',
            scope: 'transform'
          }
        ],
        solutions: [
          {
            id: `solution-${Date.now()}-1`,
            name: 'Salesforce Sales Cloud',
            description: 'CRM platform for sales team',
            scope: 'transform',
            currentState: 'Using spreadsheets',
            desiredState: 'Fully integrated CRM',
            gaps: [
              { id: 'gap-1', description: 'No centralized customer database' },
              { id: 'gap-2', description: 'Manual reporting processes' }
            ],
            businessImpact: 'Increase sales efficiency by 30%',
            expectedStart: new Date().toISOString(),
            estimatedDuration: 6,
            durationUnit: 'months',
            businessOwner: 'Lars Nielsen',
            technicalOwner: 'Maria Hansen',
            implementationPartner: 'Salesforce',
            vendor: 'Salesforce',
            investmentBudget: '500000',
            annualLicenseCost: '120000',
            annualMaintenance: '50000',
            actionItems: [],
            domain: 'Sales',
            projectGroup: 'CRM Implementation',
            linkedProgramItems: []
          }
        ],
        lastModified: new Date().toISOString()
      },
      {
        id: `planning-${Date.now()}-2`,
        name: 'Digital Marketing Platform',
        businessGoal: {
          name: 'Modernize Marketing',
          description: 'Implement modern marketing automation platform',
          currentState: 'Manual marketing processes',
          desiredState: 'Automated marketing with analytics',
          currentMaturity: 2,
          desiredMaturity: 4
        },
        level0Columns: [],
        programItems: [],
        solutions: [
          {
            id: `solution-${Date.now()}-2`,
            name: 'HubSpot Marketing Hub',
            description: 'Marketing automation platform',
            scope: 'build',
            currentState: 'No marketing automation',
            desiredState: 'Full marketing automation with lead scoring',
            gaps: [
              { id: 'gap-3', description: 'No email automation' },
              { id: 'gap-4', description: 'No lead scoring' }
            ],
            businessImpact: 'Generate 50% more qualified leads',
            expectedStart: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedDuration: 4,
            durationUnit: 'months',
            businessOwner: 'Lars Nielsen',
            technicalOwner: 'Maria Hansen',
            implementationPartner: 'HubSpot',
            vendor: 'HubSpot',
            investmentBudget: '300000',
            annualLicenseCost: '80000',
            annualMaintenance: '30000',
            actionItems: [],
            domain: 'Marketing',
            projectGroup: 'Customer Service Enhancement',
            linkedProgramItems: []
          }
        ],
        lastModified: new Date().toISOString()
      },
      {
        id: `planning-${Date.now()}-3`,
        name: 'Process Automation Initiative',
        businessGoal: {
          name: 'Automate Manual Processes',
          description: 'Reduce manual work by 40% through automation',
          currentState: 'Many manual, time-consuming processes',
          desiredState: 'Automated workflows with minimal manual intervention',
          currentMaturity: 2,
          desiredMaturity: 5
        },
        level0Columns: [],
        programItems: [],
        solutions: [],
        lastModified: new Date().toISOString()
      }
    ];

    localStorage.setItem('transformationPlannings', JSON.stringify(plannings));

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
