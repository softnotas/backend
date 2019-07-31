import { parse } from 'dotenv';
import * as Joi from '@hapi/joi';
import { existsSync, readFileSync } from 'fs';
import { Logger } from '@nestjs/common';
import { EnvConfig } from './envconfig.interface';

export class ConfigService {

  private readonly env: EnvConfig;
  private readonly filePath = `.env.init`;
  private logger = new Logger(`ConfigService`, true);

  constructor() {
    if (!existsSync(this.filePath)) {
      this.logger.error(`Config file ${this.filePath} not exist`);
      throw new Error();
    }
    this.env = this.validate(parse(readFileSync(this.filePath, 'utf-8')));
  }

  private validate(envConfig: EnvConfig): EnvConfig {
    const envVars: Joi.ObjectSchema = Joi.object(
      {
        NODE_ENV: Joi.string(),
        APP_NAME: Joi.string(),
        APP_HOST: Joi.string().hostname().default('localhost'),
        APP_URL_PREFIX: Joi.string(),
        APP_PORT: Joi.number().port().default(8550),
        JWT_KEY: Joi.string(),
        DB_TYPE: Joi.string(),
        DB_HOST: Joi.string().hostname().default('localhost'),
        DB_DATABASE: Joi.string(),
        DB_PORT: Joi.number().port().default(3306),
        DB_SYNCHRONIZE: Joi.boolean(),
        DB_LOGGING: Joi.boolean()
      }
    );

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVars,
    );

    if (error) {
      this.logger.error(`Configuration validation error: ${error.message}`)
      throw new Error();
    }
    return validatedEnvConfig;
  }

  get orm_config(): any {
    return {
      type: this.env.DB_TYPE,
      host: this.env.DB_HOST,
      port: this.env.DB_PORT,
      database: this.env.DB_DATABASE,
      useNewUrlParser: true,
      synchronize: this.env.DB_SYNCHRONIZE,
      logging: this.env.DB_LOGGING,
      entities: ['src/entities/**/*.entity{.ts,.js}']
    }
  }

  get redis_config(): any {
    return {
      host: this.env.REDIS_HOST,
      port: parseInt(this.env.REDIS_PORT),
      password: this.env.REDIS_PASSWORD
    }
  }
}