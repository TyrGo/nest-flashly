import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from './cards.model';

@Injectable()
export class CardsService {
  constructor(@InjectModel('Card') private readonly cardModel: Model<Card>) {}

  async findOne(cardId: string): Promise<Card> {
    const card = await this.cardModel.findById(cardId);
    return card;
  }

  async createCard(word: string, defn: string, userId: string) {
    const newCard = new this.cardModel({ word, defn, userId });
    const result = await newCard.save();
    return result;
  }

  async getCards(userId: string): Promise<Card[]> {
    const cards = await this.cardModel.find({ userId });
    return cards;
  }

  // Return first card overdue or else first card by highest bin
  // Except if no cards or all cards beyond bin 11, return message
  async getNextCard(userId: string) {
    let card = null;
    let message = null;
    const hasCard = await this.cardModel.exists({ userId });

    if (!hasCard) {
      message = 'Please create new cards.'; //or throw
    } else {
      card = await this.getDueCard(userId);
      if (!card) {
        message = 'You have no more words to review!'; //or throw
      }
    }

    return { card, message };
  }

  async updateCard(cardId: string, word: string, defn: string): Promise<Card> {
    const card = await this.cardModel.findById(cardId);
    card.word = word;
    card.defn = defn;
    await card.save();

    return card;
  }

  async destroyCard(cardId: string): Promise<{ message: string }> {
    await this.cardModel.findByIdAndDelete(cardId);
    return { message: 'Card deleted' };
  }

  async binUp(cardId: string): Promise<{ message: string }> {
    const card = await this.cardModel.findById(cardId);
    card.bin++;
    card.due = new Date(this.updatedDue(card.bin));
    await card.save();

    return { message: 'Bin promoted' }; // maybe in controller?
  }

  async binDown(cardId: string): Promise<{ message: string }> {
    const card = await this.cardModel.findById(cardId);
    card.wrongs += 1;
    card.bin = card.wrongs === 10 ? 13 : 1;
    card.due = new Date(this.updatedDue(card.bin));
    await card.save();

    return { message: `Bin demoted` }; // maybe in controller?
  }

  private secondsDue(due: Date): number {
    return (new Date(due).getTime() - Date.now()) / 1000;
  }

  private async getDueCard(userId: string): Promise<Card> {
    const activeCards = await this.cardModel
      .find({ userId, bin: { $lt: 12 } })
      .sort('due');
    const overdueCards = activeCards.filter(
      (card) => this.secondsDue(card.due) < 0,
    );

    return overdueCards.length
      ? overdueCards.sort((a, b) => b.bin - a.bin)[0]
      : activeCards[0];
  }

  private updatedDue(bin: number): number {
    const currentTime = Date.now();
    const seconds = 1000;
    const minutes = 60 * seconds;
    const hours = 60 * minutes;
    const days = 24 * hours;

    switch (bin) {
      case 1:
        return currentTime + 5 * seconds;
      case 2:
        return currentTime + 25 * seconds;
      case 3:
        return currentTime + 2 * minutes;
      case 4:
        return currentTime + 5 * minutes;
      case 5:
        return currentTime + 10 * minutes;
      case 6:
        return currentTime + 1 * hours;
      case 7:
        return currentTime + 5 * hours;
      case 8:
        return currentTime + 1 * days;
      case 9:
        return currentTime + 5 * days;
      case 10:
        return currentTime + 25 * days;
      default:
        return currentTime + 120 * days;
    }
  }
}
