# Customer Data Processing Tool

## Overview

This is a full-stack web application built to process and manage customer rental data. The application parses tabular customer data (typically pasted from spreadsheets) and generates personalized messages for each customer based on their financial status and activity. It's designed to streamline communication with rental customers by automating message generation based on their payment history and current balance.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

- **Frontend**: React-based SPA using Vite for build tooling
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM (currently using in-memory storage as fallback)
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Deployment**: Replit with autoscale deployment target

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** for server state management and API caching
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with CSS custom properties for theming

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** for database operations with PostgreSQL support
- **Zod** for runtime type validation and schema generation
- **In-memory storage** as fallback when database is not available
- Custom logging middleware for API request tracking

### Data Models
Currently defines a simple user schema:
- Users table with id, username, and password fields
- Extensible storage interface for CRUD operations

### UI Components
Comprehensive component library including:
- Form controls (Input, Textarea, Select, Checkbox, etc.)
- Layout components (Card, Sheet, Dialog, Tabs)
- Data display (Table, Toast notifications)
- Interactive elements (Button variants, Tooltips, Dropdown menus)

## Data Flow

1. **Data Input**: Users paste customer data in tabular format (tab-separated values)
2. **Data Parsing**: Client-side parsing extracts customer information including:
   - Name
   - Previous outstanding balance
   - Uber earnings
   - Daily fees
   - Current balance
   - Miles driven (user input)
3. **Message Generation**: System generates personalized messages based on customer balance status
4. **Data Management**: Parsed data is displayed in tables for review and editing
5. **Message Output**: Generated messages can be copied to clipboard for communication

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database connector for PostgreSQL
- **drizzle-orm**: Type-safe ORM with excellent TypeScript support
- **@tanstack/react-query**: Powerful data synchronization for React
- **react-hook-form**: Performant forms with minimal re-renders

### UI Dependencies
- **@radix-ui/react-***: Comprehensive set of low-level UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: For building type-safe component variants
- **lucide-react**: Modern icon library

### Development Tools
- **tsx**: TypeScript execution environment for development
- **esbuild**: Fast JavaScript bundler for production builds
- **vite**: Modern frontend build tool with HMR

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- Node.js 20 runtime
- PostgreSQL 16 database
- Hot module replacement via Vite
- Development server runs on port 5000

### Production Build
- Vite builds the client-side React application
- esbuild bundles the server-side Express application
- Static assets served from `/dist/public/`
- Production server runs the bundled Express app

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection (development/production)
- Drizzle migrations stored in `/migrations/` directory

## Recent Changes

- **June 20, 2025**: Enhanced payment information system
  - Added dynamic payment configuration (Zelle, Venmo, Cash App, PayPal)
  - Updated message templates with emoji icons (🔹 for payment methods, 📸 for screenshots)
  - Fixed miles display to show "N/A" when not provided instead of zero
  - Added customer count badges in parsed data and generated messages sections
  - Improved UI with payment information input fields in blue-tinted section

- **June 21, 2025**: Advanced editing features
  - Added global date configuration section for setting yesterday/current dates
  - Implemented inline message editor allowing direct text modification
  - Enhanced message generation to apply global date settings
  - Added real-time message editing with copy functionality preserving edits

## Changelog

```
Changelog:
- June 20, 2025. Initial setup with customer data processing
- June 20, 2025. Added dynamic payment info and enhanced UI
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```