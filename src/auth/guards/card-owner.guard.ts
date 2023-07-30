import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class CardOwnerGuard implements CanActivate {
  constructor(private cardService: CardsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const cardId = request.params.cardId;

    const card = await this.cardService.findOne(cardId);
    if (!card) {
      throw new UnauthorizedException('Card not found');
    }

    const isOwner = card.userId.toString() === user.id.toString();
    const isAdmin = user.isAdmin;

    if (!isOwner && !isAdmin) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
