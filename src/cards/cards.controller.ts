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
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/user.model';
import { CardOwnerGuard } from 'src/auth/guards/card-owner.guard';
import { CardAdminGuard } from 'src/auth/guards/card-admin.guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardService: CardsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createCard(
    @GetUser() user: User,
    @Body('word') word: string,
    @Body('defn') defn: string,
  ): Promise<Card> {
    const card = await this.cardService.createCard(word, defn, user.id);
    return card;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getCards(@GetUser() user: User): Promise<Card[]> {
    const cards = await this.cardService.getCards(user.id);
    return cards;
  }

  @UseGuards(AuthGuard('jwt'), CardAdminGuard)
  @Get('admin-cards/:userId')
  async getAdminCards(@Param('userId') userId: string): Promise<Card[]> {
    const cards = await this.cardService.getCards(userId);
    return cards;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('next')
  async getNextCard(
    @GetUser() user: User,
  ): Promise<{ card: Card; message: string }> {
    const { card, message } = await this.cardService.getNextCard(user.id);
    return { card, message }; // return card, throw message
  }

  @UseGuards(AuthGuard('jwt'), CardOwnerGuard)
  @Get(':cardId')
  async getCard(@Param('cardId') cardId: string): Promise<Card> {
    const card = await this.cardService.findOne(cardId);
    return card;
  }

  @UseGuards(AuthGuard('jwt'), CardOwnerGuard)
  @Patch(':cardId/update')
  async updateCard(
    @Param('cardId') cardId: string,
    @Body('word') word: string,
    @Body('defn') defn: string,
  ): Promise<Card> {
    const card = await this.cardService.updateCard(cardId, word, defn);
    return card;
  }

  @UseGuards(AuthGuard('jwt'), CardOwnerGuard)
  @Delete(':cardId/destroy')
  async destroyCard(
    @Param('cardId') cardId: string,
  ): Promise<{ message: string }> {
    const message = await this.cardService.destroyCard(cardId);
    return message;
  }

  @UseGuards(AuthGuard('jwt'), CardOwnerGuard)
  @Post(':cardId/bin_up')
  async binUp(@Param('cardId') cardId: string): Promise<{ message: string }> {
    const message = await this.cardService.binUp(cardId);
    return message;
  }

  @UseGuards(AuthGuard('jwt'), CardOwnerGuard)
  @Post(':cardId/bin_down')
  async binDown(@Param('cardId') cardId: string): Promise<{ message: string }> {
    const message = await this.cardService.binDown(cardId);
    return message;
  }
}
