# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm start` or `ng serve` - Start development server on http://localhost:4200/
- `npm run build` - Build the application for production
- `npm run watch` - Build in watch mode for development
- `npm test` - Run unit tests with Karma
- `npm run serve:ssr:sebania-web` - Serve the SSR application

### Angular CLI
- `ng generate component component-name` - Generate new component
- `ng generate service service-name` - Generate new service
- `ng generate guard guard-name` - Generate new guard

## Project Architecture

### Application Structure
This is an Angular 19 application with Server-Side Rendering (SSR) support. The application is structured around a French agricultural management system (Sebania).

### Key Technologies
- **Angular 19** with standalone components
- **PrimeNG** for UI components with custom preset (`MyPreset`)
- **TailwindCSS** with PrimeUI integration
- **Chart.js** for data visualization
- **Bootstrap Icons** for iconography
- **Moment.js** for date manipulation
- **JWT authentication** with automatic token refresh
- **French localization** (PrimeLocale)

### Routing Structure
The application uses two main layouts:
- **MainLayoutComponent**: Protected routes requiring authentication
- **AuthLayoutComponent**: Authentication-related pages

Main feature areas:
- `/activites` - Activity management (accueil, calendrier, saisie)
- `/tableau-bord` - Dashboard views (vue-ensemble, cultures, parcelles, temps-travail, comparaison)
- `/parametres` - Settings and configuration
- `/auth` - Authentication (connexion, inscription, mot-de-passe-oublie)

### Core Services

#### HttpService (`src/app/services/http.service.ts`)
- Centralized HTTP client with automatic JWT token handling
- Base API URL: `http://localhost:8000/api/` (dev) / `https://api.sebania.fr/api/` (prod)
- All API calls prefixed with `v1/`
- Automatic token refresh on 401 errors
- Error handling with PrimeNG message service
- Configurable retry logic and authentication requirements

#### Key Service Patterns
- **CacheService**: Token storage and cache management
- **VocalService**: Voice interaction support
- **ConfigurationService**: Application configuration
- Services follow naming convention: `*.service.ts`

### Authentication System
- JWT-based authentication with access and refresh tokens
- **AuthGuard** protects main application routes
- Automatic token refresh using refresh token
- Logout redirects to `/auth/connexion` with return URL

### Component Organization
- Components use standalone imports (Angular 19 feature)
- Lazy-loaded routes for performance optimization
- Consistent French naming convention throughout
- Separate CSS files for component styles
- Dialog components in subdirectories (e.g., `employe-dialog`, `parcelle-dialog`)

### Models and Data
- TypeScript models in `src/app/models/` directory
- Request/response models organized by feature
- Error handling with custom error codes
- Support for agricultural domain models (ferme, parcelle, culture, activite)

### Development Notes
- Environment configuration in `src/environments/`
- Custom PrimeNG theme preset in `src/app/preset.ts`
- SSR support with server entry point in `src/server.ts`
- French language application with localized components
- Agricultural/farming domain focus

### Build Configuration
- Production build optimizations enabled
- File replacement for environment configs
- Bundle budgets: 2MB warning, 5MB error for initial bundle
- Component styles limited to 4kB warning, 8kB error