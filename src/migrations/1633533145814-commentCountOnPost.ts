import { MigrationInterface, QueryRunner } from 'typeorm';

export class commentCountOnPost1633533145814 implements MigrationInterface {
  name = 'commentCountOnPost1633533145814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD "commentsCount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "commentsCount"`);
  }
}
