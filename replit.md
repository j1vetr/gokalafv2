# Gokalaf - Online Fitness & Coaching Platform

## Overview

Gokalaf is a premium Turkish-language online fitness and bodybuilding coaching platform. The application serves as both a corporate website and a user management system for selling and managing coaching packages. It features a modern, performance-oriented design focused on discipline and professional coaching services.

The platform enables users to:
- Browse and purchase coaching packages (8, 12, 16, or 24-week programs)
- Access personalized fitness tools and calculators
- Track their progress through a user dashboard
- Communicate with the coach via integrated WhatsApp

Administrators can:
- Manage users and orders
- Track package sales
- Monitor client progress

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management
- Framer Motion for animations and transitions

**UI Component System:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library (New York style variant)
- Tailwind CSS v4 for styling with custom design tokens
- Custom theme with dark background (#050505) and neon accent colors (primary: #ccff00)

**Design Philosophy:**
The application uses a "performance, power, discipline" aesthetic with:
- Dark backgrounds with high-contrast accent colors
- Bold typography (Oswald for headings, Inter for body text)
- Micro-animations and smooth transitions
- Mobile-first responsive design
- Premium, spacious layouts with ample whitespace

**Page Structure:**
- Public pages: Home, About, Tools (calculators), Packages, Login, Register
- Protected pages: User Dashboard, Checkout
- Admin pages: Admin Login, Admin Dashboard (at /gokadmin)
- Calculator tools: BMI, Calorie, TDEE, Macro calculators

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js REST API
- TypeScript for type safety across the stack
- ESBuild for production bundling with selective dependency bundling

**Session Management:**
- Express-session with connect-pg-simple for PostgreSQL-backed sessions
- Session data includes userId and userRole
- Cookie-based authentication (30-day expiration)
- Separate middleware for user authentication and admin authorization

**API Design:**
- RESTful endpoints under `/api` namespace
- Session-based authentication (no JWT)
- Role-based access control (user/admin roles)
- Request/response logging with timestamps

**Code Organization:**
- `server/index.ts` - Express server setup and middleware
- `server/routes.ts` - API route definitions and handlers
- `server/storage.ts` - Database abstraction layer
- `server/static.ts` - Static file serving with SPA fallback
- `server/vite.ts` - Development-mode Vite integration

### Data Storage

**Database System:**
- PostgreSQL (via Neon serverless)
- Drizzle ORM for type-safe database queries
- Schema defined in `shared/schema.ts` for frontend/backend sharing

**Database Schema:**

1. **Users Table:**
   - Fields: id (UUID), email, password (bcrypt hashed), fullName, phone, role (user/admin), createdAt
   - Authentication via bcrypt for password hashing

2. **Packages Table:**
   - Fields: id, name, weeks (8/12/16/24), price, features (array), isActive, createdAt
   - Represents coaching packages available for purchase

3. **Orders Table:**
   - Fields: id, userId, packageId, totalPrice, status (pending/paid/active/completed/cancelled), startDate, endDate, createdAt
   - Links users to purchased packages

4. **User Progress Tables:**
   - UserProgress: Weekly check-ins with weight, photos, notes
   - DailyHabits: Water intake, workout completion, sleep hours
   - BodyMeasurements: Detailed body measurements (weight, chest, waist, hips, arms, legs)
   - CalculatorResults: Saved results from fitness calculators

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Migration files stored in `/migrations`
- Database credentials from `DATABASE_URL` environment variable

### External Dependencies

**Database & Storage:**
- `@neondatabase/serverless` - Serverless PostgreSQL connection pooling
- `drizzle-orm` - Type-safe ORM for PostgreSQL
- `connect-pg-simple` - PostgreSQL session store for Express

**Authentication & Security:**
- `bcryptjs` - Password hashing
- `express-session` - Session management
- Session secret configured via `SESSION_SECRET` environment variable

**UI Component Libraries:**
- `@radix-ui/*` - Accessible UI primitives (accordion, dialog, dropdown, etc.)
- `class-variance-authority` - Type-safe variant-based styling
- `cmdk` - Command menu component
- `lucide-react` - Icon library

**Development Tools:**
- `@replit/vite-plugin-runtime-error-modal` - Development error overlay
- `@replit/vite-plugin-cartographer` - Replit-specific development tools
- Custom `vite-plugin-meta-images.ts` - Auto-updates OpenGraph meta tags for Replit deployments

**Build Process:**
- Production: Vite builds client to `dist/public`, ESBuild bundles server to `dist/index.cjs`
- Development: Concurrent Vite dev server (port 5000) and Express server with HMR
- Selective dependency bundling to reduce cold start times (allows specific deps while externalizing others)

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV` - Environment mode (development/production)
- `REPL_ID` - Replit deployment identifier (optional, for dev tools)

**Asset Management:**
- Static assets in `client/public`
- Generated videos in `attached_assets/generated_videos`
- Transformation images in `attached_assets/transformations`
- Custom fonts: Google Fonts (Inter, Oswald)