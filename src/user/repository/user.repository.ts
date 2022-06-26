import { User } from 'src/user/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  logger = new Logger('UserRepository');
  async createUser(crreateUserDto: CreateUserDto): Promise<void> {
    const { username, password } = crreateUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      //SQL LITE의 unique에러 코드는 'SQLITE_CONSTRAINT'
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Existing username');
      } else {
        //DB 별로 unique 값 처리시 던지는 error.code가 다름. error코드 보고 확인해서 에러처리
        this.logger.verbose(error);
        throw new InternalServerErrorException();
      }
    }
  }
}
