# Contributing to Socratic Sort

Thank you for your interest in contributing to Socratic Sort! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/socratic-sort/issues)
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, Node version, Python version)

### Suggesting Features

1. Check existing [Issues](https://github.com/yourusername/socratic-sort/issues) and [Discussions](https://github.com/yourusername/socratic-sort/discussions)
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/yourusername/socratic-sort.git
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** following our coding standards
5. **Test thoroughly**
6. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
7. **Push** to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request** with:
   - Clear description of changes
   - Link to related issues
   - Screenshots/videos if UI changes

## Development Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Coding Standards

### Frontend (TypeScript/React)

- **TypeScript**: Use strong typing, avoid `any`
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **File structure**: One component per file
- **Naming**: 
  - Components: PascalCase (`ChatPanel.tsx`)
  - Hooks: camelCase starting with `use` (`useSpeech.ts`)
  - Utils: camelCase (`utils.ts`)

### Backend (Python)

- **Style**: Follow PEP 8
- **Type hints**: Use type annotations
- **Docstrings**: Document all functions and classes
- **Naming**:
  - Files: snake_case (`tutor.py`)
  - Classes: PascalCase (`SocraticTutor`)
  - Functions: snake_case (`generate_response`)

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add voice selection dropdown
fix: resolve D3.js transition timing issue
docs: update API documentation
```

## Testing

### Frontend Tests

```bash
npm run test
```

### Backend Tests

```bash
cd backend
pytest
```

### Manual Testing

Before submitting a PR, test:
1. Sign in/out flow
2. Algorithm switching
3. Chat functionality
4. Visualizer updates
5. XP and badge awards
6. Mobile responsiveness

## Project Structure

```
socratic-sort/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── chat/             # Chat interface
│   ├── gamification/     # Gamification features
│   ├── layout/           # Layout components
│   ├── ui/               # shadcn/ui components
│   └── visualizer/       # D3.js visualizations
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── store/                 # Zustand stores
├── prisma/               # Database schema
├── backend/              # Python FastAPI backend
│   ├── api/             # API endpoints
│   ├── core/            # Core logic
│   └── main.py          # FastAPI app
└── public/              # Static assets
```

## Areas Needing Help

- 🎨 **UI/UX improvements**: Better animations, accessibility
- 🧠 **AI prompts**: Improving Socratic questions
- 📊 **Visualizations**: Additional algorithm visualizations
- 🧪 **Testing**: Unit and integration tests
- 📝 **Documentation**: Tutorials, API docs
- 🌐 **Internationalization**: Translations

## Review Process

1. **Automated checks**: PR must pass linting and type checks
2. **Code review**: At least one maintainer approval required
3. **Testing**: All tests must pass
4. **Documentation**: Update docs if needed

## Questions?

- Open a [Discussion](https://github.com/yourusername/socratic-sort/discussions)
- Join our [Discord](https://discord.gg/socraticsort)
- Email: contribute@socraticsort.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Socratic Sort better! 🚀**
