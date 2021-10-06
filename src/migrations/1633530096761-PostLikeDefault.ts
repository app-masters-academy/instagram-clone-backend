import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostLikeDefault1633530096761 implements MigrationInterface {
  name = 'PostLikeDefault1633530096761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "likes" SET DEFAULT '{"users":[]}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "likes" DROP DEFAULT`,
    );
  }
}
