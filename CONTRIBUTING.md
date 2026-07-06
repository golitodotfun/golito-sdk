# Contributing to @golitodotfun/sdk

Thank you for your interest in contributing to the official Golito TypeScript SDK! We welcome pull requests, bug reports, and suggestions.

---

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please create a GitHub Issue. Be sure to include:
- A clear description of the problem.
- Steps to reproduce the issue.
- Details about your environment (Node.js version, `@solana/web3.js` version, etc.).

### Suggesting Enhancements
We welcome feature requests! Open a GitHub Issue explaining:
- The use case for the feature.
- Proposed implementation details if any.

### Pull Requests
1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/golito-sdk.git
   cd golito-sdk
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your edits:
   ```bash
   git checkout -b feat/your-feature-name
   ```
5. **Make your changes** and verify compiling:
   ```bash
   npm run build
   ```
6. **Commit your changes** following semantic commit style (e.g. `feat: add ...` or `fix: resolve ...`).
7. **Push to your fork** and open a **Pull Request** against the `main` branch.

---

## Development Guidelines

- **TypeScript**: All source files must be written in TypeScript inside the `src/` directory.
- **Strict Mode**: Code must build without compiler errors under the configuration specified in `tsconfig.json`.
- **Formatting**: Keep code clean, readable, and well-commented where necessary.
