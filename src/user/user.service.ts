import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    const user = this.userRepo.findOne(id);
    if (!!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: ['User not found'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = { ...(await this.findOne(id)), ...updateUserDto };
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    return this.userRepo.softRemove(await this.findOne(id));
  }
}
