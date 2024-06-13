const { exec } = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const setupCache = {};

function executeShellCommand(shellCommand) {
  return new Promise((resolve, reject) => {
    exec(shellCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing shell command: ${shellCommand}`, error);
        reject(new Error(`Error executing shell command: ${error.message}`));
        return;
      }
      if (stderr) {
        console.warn(`Shell command executed with warnings: ${shellCommand}`, stderr);
      }
      resolve(stdout.trim());
    });
  });
}

async function initializeNodeEnvironment() {
  console.log("Initializing node environment...");
  try {
    await executeShellCommand("npm install");
    console.log("Node environment initialized successfully.");
  } catch (error) {
    console.error("Error initializing node environment:", error.message);
    throw new Error("Node environment initialization failed.");
  }
}

async function configureDatabaseConnection() {
  console.log("Configuring database connection...");
  const cacheKey = 'databaseConfigured';
  if (setupCache[cacheKey]) {
    console.log("Using cached database configuration status.");
    return;
  }

  try {
    const dbUsername = encodeURIComponent(process.env.DB_USER);
    const dbPassword = encodeURIComponent(process.env.DB_PASS);
    const databaseConnectionCommand = `mongo --username ${dbUsername} --password ${dbPassword} --eval 'db.runCommand({ping: 1})'`;
    await executeShellCommand(databaseConnectionCommand);
    console.log("Database connection configured successfully.");
    setupCache[cacheKey] = true; // Caching successful configuration
  } catch (error) {
    console.error("Error configuring database connection:", error.message);
    throw new Error("Database connection configuration failed.");
  }
}

async function initializeThirdPartyNotifications() {
  console.log("Initializing third-party notifications...");
  const cacheKey = 'notificationsInitialized';
  if (setupCache[cacheKey]) {
    console.log("Using cached third-party notifications initialization status.");
    return;
  }
  try {
    const notificationInitializationCommand = `curl -X POST -H "Authorization: Bearer ${process.env.NOTIFICATION_SERVICE_TOKEN}" ${process.env.NOTIFICATION_SERVICE_URL}/api/setup`;
    await executeShellCommand(notificationInitializationCommand);
    console.log("Third-party notifications initialized successfully.");
    setupCache[cacheKey] = true; // Caching successful initialization
  } catch (error) {
    console.error("Error initializing third-party notifications:", error.message);
    throw new Error("Third-party notifications initialization failed.");
  }
}

(async function launchCryptoAlertSystem() {
  try {
    await initializeNodeEnvironment();
    await configureDatabaseConnection();
    await initializeThirdPartyNotifications();
    console.log("CryptoAlert system launched successfully.");
  } catch (error) {
        console.error("System launch failed:", error.message);
  }
})();