import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DreamsModule } from './dreamscape-dreams/dreams.module';
import { SessionsModule } from './dreamscape-sessions/sessions.module';
import { SettingsModule } from './dreamscape-settings/settings.module';

const url = '192.168.1.250'; // production
// const url = 'localhost';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${url}/dreamscape`,
      {
        useNewUrlParser: true,
      },
    ),
    DreamsModule,
    SessionsModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
