import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRootAsync(
      {
        useFactory: async (config) => (config.orm_config),
        inject: ['ConfigService']
      }
    )
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor(private readonly con: Connection){

  }
}