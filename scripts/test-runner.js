#!/usr/bin/env node

/**
 * Test Runner Script
 * Sets up test environment and runs comprehensive tests
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.cyan}[${step}]${colors.reset} ${message}`);
}

function logSuccess(message) {
  log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "pipe",
      shell: true,
      env: { ...process.env, NODE_ENV: "test" },
      ...options,
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject({ stdout, stderr, code });
      }
    });

    child.on("error", (error) => {
      reject({ error, stdout, stderr, code: -1 });
    });
  });
}

async function setupTestEnvironment() {
  logStep("1", "Setting up test environment...");

  try {
    // Check if test database exists, remove it for fresh start
    const testDbPath = path.join(__dirname, "prisma", "test.db");
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
      log("Removed existing test database");
    }

    // Set up test database
    logStep("1a", "Setting up test database...");
    await runCommand("npx", ["prisma", "db", "push", "--accept-data-loss"], {
      env: { ...process.env, NODE_ENV: "test", DATABASE_URL: "file:./test.db" },
    });
    logSuccess("Test database setup complete");

    // Generate Prisma client
    logStep("1b", "Generating Prisma client...");
    await runCommand("npx", ["prisma", "generate"]);
    logSuccess("Prisma client generated");

    logSuccess("Test environment setup complete");
  } catch (error) {
    logError("Failed to setup test environment:");
    console.error(error.stderr || error.error || error);
    process.exit(1);
  }
}

async function runTests(type = "all") {
  logStep("2", `Running ${type} tests...`);

  try {
    let testCommand = ["jest"];
    let testArgs = ["--verbose", "--coverage"];

    if (type === "api") {
      testArgs.push("--testMatch=**/tests/api/**/*.test.js");
    } else if (type === "client") {
      testArgs.push("--testMatch=**/tests/client/**/*.test.js");
    } else if (type === "watch") {
      testArgs = ["--watch", "--verbose"];
    }

    const result = await runCommand("npx", [...testCommand, ...testArgs], {
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "test" },
    });

    logSuccess(`${type} tests completed successfully`);
    return result;
  } catch (error) {
    logError(`${type} tests failed:`);
    if (error.stderr) {
      console.error(error.stderr);
    }
    throw error;
  }
}

async function cleanup() {
  logStep("3", "Cleaning up test environment...");

  try {
    // Remove test database
    const testDbPath = path.join(__dirname, "prisma", "test.db");
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
      log("Removed test database");
    }

    logSuccess("Cleanup complete");
  } catch (error) {
    logWarning("Cleanup failed, but this is not critical");
    console.warn(error);
  }
}

function showHelp() {
  log(`
${colors.cyan}LinkHub Test Runner${colors.reset}

Usage: node scripts/test-runner.js [command]

Commands:
  setup     Set up test environment only
  api       Run API tests only
  client    Run client tests only
  watch     Run tests in watch mode
  clean     Clean up test environment
  help      Show this help message

Default: Runs full test suite with setup and cleanup

Examples:
  node scripts/test-runner.js           # Full test suite
  node scripts/test-runner.js api       # API tests only
  node scripts/test-runner.js watch     # Watch mode
  node scripts/test-runner.js clean     # Clean up only
`);
}

async function main() {
  const command = process.argv[2] || "all";

  log(`${colors.magenta}🚀 LinkHub Test Runner${colors.reset}`);
  log(`${colors.magenta}======================${colors.reset}`);

  try {
    switch (command) {
      case "help":
      case "--help":
      case "-h":
        showHelp();
        break;

      case "setup":
        await setupTestEnvironment();
        break;

      case "clean":
        await cleanup();
        break;

      case "api":
        await setupTestEnvironment();
        await runTests("api");
        await cleanup();
        break;

      case "client":
        await setupTestEnvironment();
        await runTests("client");
        await cleanup();
        break;

      case "watch":
        await setupTestEnvironment();
        log(
          `${colors.yellow}Starting test watcher... (Press Ctrl+C to stop)${colors.reset}`
        );
        await runTests("watch");
        break;

      case "all":
      default:
        await setupTestEnvironment();
        await runTests("all");
        await cleanup();
        break;
    }

    log(
      `\n${colors.green}🎉 All operations completed successfully!${colors.reset}`
    );
  } catch (error) {
    logError("Test runner failed");
    console.error(error);
    process.exit(1);
  }
}

// Handle process termination
process.on("SIGINT", async () => {
  log(
    `\n${colors.yellow}Received interrupt signal, cleaning up...${colors.reset}`
  );
  await cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  log(
    `\n${colors.yellow}Received termination signal, cleaning up...${colors.reset}`
  );
  await cleanup();
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = {
  setupTestEnvironment,
  runTests,
  cleanup,
};
