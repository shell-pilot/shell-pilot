# Shellpilot

Shellpilot is an **AI terminal copilot**.

It runs your command, and **only if the command fails**, it explains what went wrong and tells you what to do next.

Shellpilot stays completely silent when things work.

---

## What Shellpilot is

- An AI assistant for failed terminal commands
- A wrapper around commands like `npm run build`, `npm run dev`, `pnpm install`, etc.
- Opinionated, concise, and terminal‑native
- Advisory only — it never auto‑runs fixes or modifies files

## What Shellpilot is NOT

- Not a compiler
- Not a linter
- Not a dev server
- Not a debugger
- Not a live log watcher
- Not an IDE replacement

**Mental model:**
> Shellpilot is the senior developer who looks at your terminal *after something crashes* and tells you what to do next.

---

## Installation

### Global install (recommended)

```bash
npm install -g shellpilot
```

After installation:

```bash
shellpilot --version
sp --version
```

(`sp` is a short alias for `shellpilot`.)

---

## Requirements

Shellpilot **requires an OpenAI API key**.

There is no non‑AI mode.

### Set your API key

#### macOS / Linux

```bash
export SHELLPILOT_OPENAI_KEY=sk-xxxxxxxx
```

#### Windows (PowerShell)

```powershell
setx SHELLPILOT_OPENAI_KEY "sk-xxxxxxxx"
```

Restart your terminal after setting the variable.

If the key is missing, Shellpilot will refuse to run.

---

## Usage

Shellpilot always wraps another command:

```bash
shellpilot <command> [args...]
```

Examples:

```bash
shellpilot npm run build
shellpilot npm run dev
shellpilot pnpm install
shellpilot node index.js
```

What happens:
1. Shellpilot runs the command normally
2. Output is streamed as‑is
3. If the command succeeds → Shellpilot stays quiet
4. If the command fails → Shellpilot explains the failure

---

## Example

```bash
shellpilot npm run build
```

```text
▶ shellPilot running: npm run build

> shellpilot@1.0.0 build
> tsc

src/cli.ts(2,20): error TS2307: Cannot find module 'open-ai' or its corresponding type declarations.

✖ Command failed — shellPilot

🤖 shellPilot:

Issue:
The module name 'open-ai' is incorrect; it should be 'openai'.

Fix:
Change the import statement in your code from 'open-ai' to 'openai'.

Command:
No command needed
```

Shellpilot:
- does not auto‑run commands
- does not modify files
- does not guess blindly

You stay in control.

---

## Using Shellpilot with React / Next.js

Shellpilot helps **only when a command fails or crashes**.

### When Shellpilot helps

- `npm run build` fails
- `npm run dev` fails to start
- Missing dependencies
- Invalid configuration
- Missing environment variables
- TypeScript compile errors that exit the process

Example:

```bash
shellpilot npm run build
```

### When Shellpilot does NOT help (by design)

Shellpilot does not intervene when a dev server is already running.

This includes:
- React error overlays
- Runtime browser errors
- Hot‑reload warnings
- Client‑side exceptions

These errors do not crash the process, so Shellpilot stays silent.

---

## Data & Privacy

Shellpilot sends **only the failed command output** to OpenAI.

It does NOT:
- scan your repository
- read files
- upload source code (unless it appears in the error output)
- execute commands on your behalf

If you are not comfortable sending terminal error output to OpenAI, do not use Shellpilot.

---

## Development

### Local development

```bash
git clone https://github.com/<your-username>/shellpilot
cd shellpilot
npm install
npm run build
npm install -g .
```

Run locally:

```bash
shellpilot npm run build
```

---

## Contributing

Shellpilot is early‑stage and intentionally minimal.

Contributions are welcome, especially:
- Prompt improvements
- Better issue summarisation
- UX refinements
- Documentation fixes
- Real‑world failure examples

### Please note

- There is no strict roadmap yet
- There are no tests yet
- Breaking changes may happen
- This tool is still rough

If something feels wrong, open an issue — feedback is valuable.

---

## Philosophy

Shellpilot is deliberately restrained.

It speaks **only when a command fails**.

That restraint is the feature.

---

## License

MIT

