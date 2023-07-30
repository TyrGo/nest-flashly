import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class CardAdminGuard implements CanActivate {
  constructor(private cardService: CardsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const isAdmin = user.isAdmin;

    if (!isAdmin) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
