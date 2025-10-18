import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/prisma';

const start = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

start();

// Graceful Shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
