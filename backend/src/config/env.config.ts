import { cleanEnv, num, port, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ 
    choices: [
        'development', 
        'test', 
        'production'
    ], 
    default: 'development' 
  }),
  PORT: port({ 
    default: 4000 
  }),
  CORS_ORIGIN: str({ 
    default: 'http://localhost:5174' 
  }),
  JWT_SECRET: str({ 
    desc: 'Secret used to sign access tokens' 
  }),
  JWT_EXPIRES_IN: str({ 
    default: '7d' 
  }),
  DB_HOST: str({ 
    default: 'localhost' 
  }),
  DB_PORT: port({ 
    default: 3306 
  }),
  DB_USER: str({ 
    default: 'root' 
  }),
  DB_PASSWORD: str({ 
    default: '' 
  }),
  DB_NAME: str({ 
    default: '' 
  }),
  LOG_LEVEL: str({ 
    default: 'info' 
  }),
  API_BASE_URL: url({ 
    default: 'http://localhost:4000' 
  }),
});
