# Email Confirmation Development Guide

## Commands
- `npm run dev` - Start local development server on port 8888
- `npm run build` - Build the project
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix linting issues automatically
- `npm run typecheck` - Run TypeScript type checking

## Code Style
- **TypeScript**: Use strict typing; avoid `any` types when possible
- **Formatting**: Prettier with 2-space indentation
- **Naming**: camelCase for variables/functions, PascalCase for React components
- **Imports**: Group in order: React, external libraries, internal modules
- **Error Handling**: Always use try/catch with proper error logging
- **React Components**: Functional components with typed props interface
- **State Management**: Use React hooks for component state
- **Async Functions**: Use async/await pattern with proper error handling

## Environment
- Node.js v20+ required
- Set required environment variables in `.env` file
