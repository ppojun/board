import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  EntityRepository,
  PrimaryGeneratedColumn,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateBoardDto } from '../dto/create-board.dto';
import { BoardStatus } from '../entities/board-status.enum';
import { Board } from '../entities/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });

    await this.save(board);
    return board;
  }
}
