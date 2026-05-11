## Matzpen Repository Structure

This document outlines the organization and purpose of directories and files in the Matzpen repository.

### Directory Structure

```
Matzpen/
├── src/                          # Main TypeScript source code (95.3%)
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Page-level components
│   ├── utils/                    # Utility functions and helpers
│   ├── types/                    # TypeScript type definitions and interfaces
│   ├── styles/                   # Component-scoped styles
│   └── index.ts                  # Application entry point
│
├── styles/                       # Global styles (3% CSS)
│   ├── global.css               # Reset and base styles
│   ├── variables.css            # CSS custom properties (design tokens)
│   └── theme.css                # Theme switching styles
│
├── scripts/                      # Automation scripts (1.5% Shell)
│   ├── build.sh                 # Production build script
│   ├── deploy.sh                # Deployment script
│   └── setup.sh                 # Development environment setup
│
├── tests/                        # Test files
│   ├── unit/                    # Unit tests
│   └── integration/             # Integration tests
│
├── public/                       # Static assets
│   └── favicon.ico              # Website favicon
│
├── docs/                         # Documentation files
│   └── [documentation files]
│
├── .github/                      # GitHub-specific configurations
│   └── workflows/               # CI/CD workflow definitions
│
├── package.json                  # Node.js dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                   # Prettier code formatting configuration
├── .gitignore                    # Git ignore rules
├── README.md                     # Project overview and setup instructions
└── REPO_STRUCTURE.md             # This file
```

### Key Directories

#### `/src` - Source Code
- **components/**: Reusable, self-contained UI components
- **pages/**: Full-page components (used in routing)
- **utils/**: Helper functions, constants, and shared logic
- **types/**: TypeScript interfaces and type definitions
- **styles/**: Component-scoped or module-specific CSS files

#### `/styles` - Global Styles
- **global.css**: Universal reset, base element styles, and typography
- **variables.css**: CSS custom properties for design tokens (colors, spacing, typography)
- **theme.css**: Light/dark mode theme definitions

#### `/scripts` - Automation
- **build.sh**: Builds the project for production
- **deploy.sh**: Handles deployment to production environment
- **setup.sh**: Sets up local development environment

#### `/tests` - Testing
- **unit/**: Tests for individual functions and components
- **integration/**: Tests for feature interactions and workflows

#### `/.github/workflows` - CI/CD
- GitHub Actions workflow files for automated testing, building, and deployment

### File Conventions

#### TypeScript Files
- Use `.ts` extension for TypeScript files
- Use `.tsx` extension for React/component files
- Keep files focused and single-responsibility
- Use meaningful, descriptive file names

#### Naming Conventions
- **Components**: PascalCase (e.g., `Button.tsx`, `UserCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `calculateTotal.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `DEFAULT_TIMEOUT`)
- **Directories**: lowercase with hyphens (e.g., `ui-components`, `api-handlers`)

### Getting Started

1. **Setup Development Environment**
   ```bash
   ./scripts/setup.sh
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Build for Production**
   ```bash
   ./scripts/build.sh
   ```

### Language Composition
- **TypeScript**: 95.3% - Main application language
- **CSS**: 3% - Styling and design system
- **Shell**: 1.5% - Build and deployment automation
- **JavaScript**: 0.2% - Configuration files (kept minimal)

### Best Practices

1. **Keep components small and focused**
   - One component per file
   - Clear, single responsibility

2. **Use TypeScript strictly**
   - Type all function parameters and returns
   - Avoid `any` types
   - Use discriminated unions for complex types

3. **Organize CSS systematically**
   - Use CSS custom properties from `variables.css`
   - Keep styles scoped to components when possible
   - Follow SMACSS or similar methodology

4. **Maintain clean git history**
   - Use meaningful commit messages
   - Keep commits atomic and focused
   - Reference issues in commit messages

### Contributing

When adding new features:
1. Create appropriate directories under `/src` if needed
2. Add tests in `/tests`
3. Update documentation in `/docs` if needed
4. Follow naming conventions
5. Maintain TypeScript strict mode compliance

### Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESLint Guide](https://eslint.org/docs/rules/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
