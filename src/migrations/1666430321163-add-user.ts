import { UserRole } from '../users/user.entity';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class addUser1666430321163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment', 
            isNullable: false,
          },
          // {
          //   name: 'name',
          //   type: 'varchar',
          //   isNullable: false,
          // },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'userRole',
            type: 'varchar',
            isNullable: false,
            enum: [...Object.values(UserRole)],
            default: UserRole.USER,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
