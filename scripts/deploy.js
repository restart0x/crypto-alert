const { exec } = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

// Simple in-memory cache
const cache = {};

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`, error);
        reject(new Error(`Error executing command: ${error.message}`));
        return;
      }
      if (stderr) {
        console.warn(`Command executed with warnings: ${command}`, stderr);
      }
      resolve(stdout.trim());
    });
  });
}

async function initializeServer() {
  console.log("Initializing server...");
  try {
    await executeCommand("npm install");
    console.log("Server initialized successfully.");
  } catch (error) {
    console.error("Error initializing server:", error.message);
    throw new Error("Server initialization failed.");
  }
}

async function setupDatabase() {
  console.log("Setting up database...");
  const cacheKey = 'databaseSetup';
  if (cache[cacheKey]) {
    console.log("Using cached database setup confirmation.");
    return;
  }

  try {
    const dbUser = encodeURIComponent(process.env.DB_USER);
    const dbPass = encodeURIComponent(process.env.DB_PASS);
    const dbSetupCommand = `mongo --username ${dbUser} --password ${dbPass} --eval 'db.runCommand({ping: 1})'`;
    await executeCommand(dbSetupCommand);
    console.log("Database setup successfully.");
    cache[cacheKey] = true; // Cache successful setup
  } catch (error) {
    console.error("Error setting up database:", error.message);
    throw new Error("Database setup failed.");
  }
}

async function setupThirdPartyServices() {
  console.log("Setting up third-party services for notifications...");
  const cacheKey = 'thirdPartyServicesSetup';
  if (cache[cacheKey]) {
    console.log("Using cached third-party services setup confirmation.");
    return;
  }
  try {
    const setupCommand = `curl -X POST -H "Authorization: Bearer ${process.env.NOTIFICATION_SERVICE_TOKEN}" ${process.env.NOTIFICATION_SERVICE_URL}/api/setup`;
    await executeCommand(setupCommand);
    console.log("Third-party services setup successfully.");
    cache[cacheKey] = true; // Cache successful setup
  } catch (error) {
    console.error("Error setting up third-party services:", error.message);
    throw new Error("Third-party services setup failed.");
  }
}

(async function deployCryptoAlert() {
  try {
    await initializeServer();
    await setupDatabase();
    await setupThirdPartyServices();
    console.log("CryptoAlert deployment completed successfully.");
  } catch (error) {
    console.error("Deployment failed:", error.message);
  }
})();