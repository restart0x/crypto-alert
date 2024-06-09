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
        reject(error);
        return;
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

async function initializeServer() {
  console.log("Initializing server...");
  try {
    await executeCommand("npm install");
    console.log("Server initialized successfully.");
  } catch (error) {
    console.error("Error initializing server:", error);
    throw error;
  }
}

async function setupDatabase() {
  console.log("Setting up database...");
  const cacheKey = 'databaseSetup';
  if (cache[cacheKey]) {
    console.log("Using cached database setup confirmation.");
    return;
  }
  const dbSetupCommand = `mongo --username ${process.env.DB_USER} --password ${process.env.DB_PASS} --eval 'db.runCommand({ping: 1})'`;
  try {
    await executeCommand(dbSetupCommand);
    console.log("Database setup successfully.");
    cache[cacheKey] = true; // Cache successful setup
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
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
    await executeCommand(`curl -X POST -H "Authorization: Bearer ${process.env.NOTIFICATION_SERVICE_TOKEN}" ${process.env.NOTIFICATION_SERVICE_URL}/api/setup`);
    console.log("Third-party services setup successfully.");
    cache[cacheKey] = true; // Cache successful setup
  } catch (error) {
    console.error("Error setting up third-party services:", error);
    throw error;
  }
}

(async function deployCryptoAlert() {
  try {
    await initializeServer();
    await setupDatabase();
    await setupThirdPartyServices();
    console.log("CryptoAlert deployment completed successfully.");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
})();