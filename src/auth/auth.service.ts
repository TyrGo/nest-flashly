import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.createUser(username, password);
    return this.generateToken(user);
  }

  async loginUser(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.validateLogin(username, password);
    return this.generateToken(user);
  }

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const payload = { username: user.username, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  private async validateLogin(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.usersService.findOneByUsername(username); //move to userservice?
    if (!user) {
      throw new NotAcceptableException('Invalid username');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new NotAcceptableException('Invalid password');
    }

    return user;
  }
}
