# CVForge 🚀

Professional CV Builder & ATS Checker for job seekers.

## Tech Stack

**Frontend:** Vue 3, Vite, Tailwind CSS, Pinia, Vue Router, Axios, Lucide Vue
**Backend:** Node.js, Express, JWT, bcrypt, JSON File Storage

## Quick Start

### Backend

```bash
cd backend
npm install
npm run seed    # Seed demo data
npm run dev     # Start on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # Start on port 5173
```

## Demo Accounts

All passwords: `password123`

| Name | Email | Role |
|------|-------|------|
| Admin CVForge | admin@cvforge.com | admin |
| Digo Ardestilano | digo@demo.com | user |
| Sarah Chen | sarah@demo.com | user |
| Ahmad Rizky | ahmad@demo.com | user |

## Development Phases

- **Phase 1** ✅ - Auth, Profile, Layout, Dashboard (Current)
- **Phase 2** - CV Builder, CRUD, Live Preview
- **Phase 3** - Templates, PDF Generation
- **Phase 4** - ATS Checker, Keyword Analyzer, Job Matcher
- **Phase 5** - AI Assistant, Cover Letter
- **Phase 6** ✅ - Job Portal, Applications
- **Phase 7** ✅ - Interview Prep, Public CV (Current)

## Project Structure

```
cvforge/
├── frontend/          # Vue 3 + Vite
│   └── src/
│       ├── pages/     # Route pages
│       ├── layouts/   # Dashboard layout
│       ├── stores/    # Pinia stores
│       ├── services/  # Axios services
│       └── router/    # Vue Router
│
└── backend/           # Node.js + Express
    ├── data/          # JSON file storage
    ├── uploads/       # Uploaded files
    └── src/
        ├── controllers/
        ├── routes/
        ├── services/
        └── middlewares/
```

## License

MIT
