import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CardSchema } from './cards.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Card', schema: CardSchema }])],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
