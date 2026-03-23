import 'dotenv/config';

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

function getPort(): number {
  const value = process.env.PORT;

  if (!value) {
    return 3001;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return port;
}

function getFrontendOrigin(): string {
  return process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
}

export const env = Object.freeze({
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
  JWT_SECRET: getRequiredEnv('JWT_SECRET'),
  PORT: getPort(),
  FRONTEND_ORIGIN: getFrontendOrigin(),
});
