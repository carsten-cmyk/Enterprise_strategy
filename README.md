# Enterprise Strategy - Transformation Planning

Enterprise platform til capability og transformation management.

## Features

### Transformation Planning
- Opret og administrer transformation plannings
- Definer Current State og Desired State
- Tilføj og track capabilities med maturity levels
- Visualiser maturity progress
- Moderne dialog-baserede workflows (INGEN browser prompts)

### UI Components
- Moderne Tailwind CSS design
- Responsiv sidebar navigation med ikoner og beskrivelser
- Kort-baseret layout med hover effects
- Dialog system til user inputs
- Smooth transitions og animations

## Teknologi Stack

- **React** - UI framework
- **Vite** - Build tool og dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **LocalStorage** - Data persistence

## Installation

```bash
# Installer dependencies
npm install

# Start development server
npm run dev

# Build til produktion
npm run build

# Preview production build
npm run preview
```

## Projekt Struktur

```
src/
├── components/
│   ├── ui/              # Genanvendelige UI komponenter
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Dialog.jsx
│   │   └── Input.jsx
│   ├── layout/          # Layout komponenter
│   │   ├── Layout.jsx
│   │   └── Sidebar.jsx
│   ├── AddCapabilityDialog.jsx
│   ├── CreatePlanningDialog.jsx
│   └── TransformationPlanningCard.jsx
├── pages/               # Side komponenter
│   ├── SolutionsProjectsPage.jsx
│   ├── SettingsPage.jsx
│   ├── TransformationPlanningPage.jsx
│   └── TransformationPlanningDetailPage.jsx
├── data/                # Data management
│   └── transformationPlanningStore.js
├── App.jsx              # Main app med routing
└── index.css            # Global styles
```

## Brug

1. **Start serveren**: `npm run dev`
2. **Åbn browseren**: Naviger til `http://localhost:5173`
3. **Opret ny planning**: Klik "Opret Ny Planning" og følg 3-trins dialogen
4. **Tilføj capabilities**: Klik ind på en planning og tilføj capabilities
5. **Track progress**: Se maturity progress på kort-oversigten

## Data Persistence

Data gemmes i browser's LocalStorage, så dine plannings er persistente mellem sessions.

## Navigation

- **Transformation Planning**: Oversigt over alle plannings
- **Solutions & Projects**: (Coming soon)
- **Settings**: (Coming soon)

## Design Features

✅ Moderne modal dialogs (ikke browser prompts)
✅ Sidebar med subtekst og active states
✅ Detaljerede projekt kort med statistik og ikoner
✅ Teal/cyan color scheme
✅ Smooth hover states og transitions
✅ Responsive design
