# Vite + React + TypeScript Frontend

A modern frontend application built with Vite, React, and TypeScript.

## Project Description

This is a Vite-powered React application with TypeScript support. The project is configured to communicate with a backend API running on port 3000.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Available Scripts

### Development Server
Start the development server with hot module replacement:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Build for Production
Create an optimized production build:
```bash
npm run build
```
Build output will be in the `dist/` directory.

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

### Lint Code
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## Backend Connection

The application is configured to proxy API requests to the backend server:
- **Backend URL**: `http://localhost:3000`
- **API Prefix**: `/api`

All requests to `/api/*` will be automatically proxied to `http://localhost:3000/api/*` during development.

Make sure your backend server is running on port 3000 before starting the frontend development server.

## Project Structure

```
.
├── src/
│   ├── components/     # React components
│   ├── api/            # API integration code
│   ├── App.tsx         # Main application component
│   ├── App.css         # Application styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies and scripts
```

## Technologies Used

- **Vite** - Next generation frontend tooling
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting and quality
