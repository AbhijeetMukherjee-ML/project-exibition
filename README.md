# Project

Full-stack web application — initial scaffold.

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React + Vite            |
| Backend    | Node.js + Express       |
| AI / ML    | Python (isolated layer) |
| Database   | TBD                     |

## Project Structure

```
project-root/
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express API
├── ai/                # Python-based AI/ML layer (isolated)
├── data/              # Shared data placeholder
├── config/            # Future shared configuration
├── .env.example       # Environment variable template
└── README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### AI Layer

See [`ai/README.md`](./ai/README.md) for setup instructions.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values before running any service.
