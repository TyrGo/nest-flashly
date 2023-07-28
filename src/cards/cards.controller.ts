import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './cards.model';
import { AuthGuard } from '@nestjs/passport';
import { UserIsUserGuard } from 'src/auth/gaurds/user-is-user.gaurd';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardService: CardsService) {}

  @Post(':userId/create')
  async createCard(
    @Param('userId') userId: string,
    @Body('word') word: string,
    @Body('defn') defn: string,
  ): Promise<Card> {
    const card = await this.cardService.createCard(word, defn, userId);
    return card;
  }

  @UseGuards(AuthGuard('jwt'), UserIsUserGuard)
  @Get(':userId')
  async getCards(@Param('userId') userId: string): Promise<Card[]> {
    const cards = await this.cardService.getCards(userId);
    return cards;
  }

  @Get(':userId/card')
  async getCard(
    @Param('userId') userId: string,
  ): Promise<{ card: Card; message: string }> {
    const { card, message } = await this.cardService.getCard(userId);

    return { card, message }; // return card, throw message
  }

  @Patch(':cardId/update')
  async updateCard(
    @Param('cardId') cardId: string,
    @Body('word') word: string,
    @Body('defn') defn: string,
  ): Promise<Card> {
    const card = await this.cardService.updateCard(cardId, word, defn);
    return card;
  }

  @Delete(':cardId/destroy')
  async destroyCard(
    @Param('cardId') cardId: string,
  ): Promise<{ message: string }> {
    const message = await this.cardService.destroyCard(cardId);
    return message; // or id
  }

  @Post(':cardId/bin_up')
  async binUp(@Param('cardId') cardId: string): Promise<{ message: string }> {
    const message = await this.cardService.binUp(cardId);
    return message;
  }

  @Post(':cardId/bin_down')
  async binDown(@Param('cardId') cardId: string): Promise<{ message: string }> {
    const message = await this.cardService.binDown(cardId);
    return message;
  }
}
