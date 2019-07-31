import * as dotnev from 'dotenv';

dotnev.config();


export const AppMode = process.env.NODE_ENV === 'production';

export const AppName = process.env.APP_NAME;

export const AppHost = process.env.APP_HOST;

export const AppPrefix = process.env.APP_URL_PREFIX;

export const AppPort = process.env.APP_PORT;

export const JwtKey = process.env.JWT_KEY;