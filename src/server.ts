import { createApp } from './app';
import { env } from './config/env';
import { db } from './database/connection';

const startServer = async () => {
  const app = createApp();

  // Test database connection on startup
  console.log('🔄 Checking database connectivity...');
  await db.testConnection();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 PanelSphere Backend API listening on port ${env.PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`📖 API Documentation: http://localhost:${env.PORT}/api-docs`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
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

