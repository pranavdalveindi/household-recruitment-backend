"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const connection_1 = require("./database/connection");
const startServer = async () => {
    const app = (0, app_1.createApp)();
    // Test database connection on startup
    console.log('🔄 Checking database connectivity...');
    await connection_1.db.testConnection();
    const server = app.listen(env_1.env.PORT, () => {
        console.log(`🚀 PanelSphere Backend API listening on port ${env_1.env.PORT}`);
        console.log(`📡 Environment: ${env_1.env.NODE_ENV}`);
        console.log(`📖 API Documentation: http://localhost:${env_1.env.PORT}/api-docs`);
    });
    // Graceful shutdown handling
    const shutdown = async (signal) => {
        console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
        server.close(async () => {
            console.log('✅ HTTP server closed.');
            process.exit(0);
        });
        // Force shutdown after 10s timeout
        setTimeout(() => {
            console.error('⚠️ Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};
startServer().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
