import { Module } from '@nestjs/common';
import { DreamController } from './dream.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DreamsSchema } from './schemas/dreams.schema';
import { DreamsService } from './dreams.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Dreams-Nick', schema: DreamsSchema, collection: 'dreams-nick' },
      {
        name: 'Dreams-Lydia',
        schema: DreamsSchema,
        collection: 'dreams-lydia',
      },
    ]),
  ],
  controllers: [DreamController],
  providers: [DreamsService],
})
export class DreamsModule {}
