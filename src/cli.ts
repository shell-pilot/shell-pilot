#!/usr/bin/env node

import "dotenv/config";
//import axios from "axios";
import { execa } from "execa";
import chalk from "chalk";
import stripAnsi from "strip-ansi";
import { runAIChat } from "./engine/aiChat";
import { readFileSync } from "fs";
import { join } from "path";

function printHelp() {
  console.log(`
${chalk.bold("shellPilot")} — AI terminal copilot

Usage:
  ${chalk.cyan("shellPilot <command> [args...]")}

Examples:
  ${chalk.cyan("shellPilot npm run build")}
  ${chalk.cyan("shellPilot npm run dev")}
  ${chalk.cyan("shellPilot node index.js")}

Notes:
  - You will be prompted for an OpenAI API key if not set
  - The key is used for this session only and never saved
`);
}

function printVersion() {
  try {
    const pkg = JSON.parse(
      readFileSync(join(__dirname, "../package.json"), "utf-8"),
    );
    console.log(pkg.version);
  } catch {
    console.log("unknown");
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v")) {
    printVersion();
    process.exit(0);
  }

  const cmd = args[0];
  const cmdArgs = args.slice(1);

  console.log(
    chalk.gray(`▶ shellPilot running: ${cmd} ${cmdArgs.join(" ")}\n`),
  );

  try {
    const subprocess = execa(cmd, cmdArgs, {
      shell: true,
      stdout: "pipe",
      stderr: "pipe",
    });

    subprocess.stdout?.pipe(process.stdout);
    subprocess.stderr?.pipe(process.stderr);

    await subprocess;

    console.log(
      chalk.green("\n✔ shellPilot: command completed successfully\n"),
    );
    process.exit(0);
  } catch (err: any) {
    const rawOutput = [err.stdout, err.stderr].filter(Boolean).join("\n");
    const output = stripAnsi(rawOutput).replace(/\r\n/g, "\n").trim();

    console.log(chalk.red("\n✖ Command failed — shellPilot\n"));
    console.log(chalk.cyan("🤖 shellPilot:\n"));

    const response = await runAIChat(`${cmd} ${cmdArgs.join(" ")}`, output);

    const lines = response.trim().split("\n");

    for (const line of lines) {
      if (
        line.startsWith("Issue:") ||
        line.startsWith("Fix:") ||
        line.startsWith("Command:")
      ) {
        console.log(chalk.yellow(line));
      } else {
        console.log(line);
      }
    }

    process.exit(1);
  }
}

main();
