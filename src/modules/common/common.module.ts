import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config/envconfig.service';

@Global()
@Module({
  imports:[],
  controllers:[],
  providers:[
    ConfigService
  ],
  exports:[
    ConfigService
  ]
})

export class CommonModule {}