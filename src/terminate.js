const { cleanup } = require('./store/client');

async function terminate(exitCode = 0) {
    await cleanup();
    process.exit(exitCode);
}

module.exports = terminate;
