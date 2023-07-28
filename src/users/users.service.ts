import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findOne(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId });
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async createUser(username: string, password: string): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = new this.userModel({ username, password: hashedPassword });
    await user.save();

    return user;
  }
}
