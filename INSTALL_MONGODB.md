# Install MongoDB Package

The MongoDB package is required for the portfolio to work. Please install it by running:

## Installation

Open your terminal in the project directory and run:

```bash
cd C:\Users\EC\Desktop\project\portfolio-nextjs
npm install mongodb
```

Or if you're using yarn:

```bash
yarn add mongodb
```

Or if you're using pnpm:

```bash
pnpm add mongodb
```

## If PowerShell Execution Policy Blocks npm

If you get a PowerShell execution policy error, you can:

1. **Run in Command Prompt (cmd) instead:**
   - Open Command Prompt (not PowerShell)
   - Navigate to the project: `cd C:\Users\EC\Desktop\project\portfolio-nextjs`
   - Run: `npm install mongodb`

2. **Or temporarily bypass PowerShell policy:**
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   npm install mongodb
   ```

3. **Or use npx:**
   ```powershell
   npx --yes npm install mongodb
   ```

## After Installation

Once installed, the build error should be resolved. The MongoDB package is already listed in `package.json`, so it just needs to be installed in `node_modules`.

## Note

- In **development**, the app will use the file system database if MongoDB is not configured
- In **production (Vercel)**, MongoDB is required and must be configured via `MONGODB_URI` environment variable

