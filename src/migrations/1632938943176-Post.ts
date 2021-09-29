import {MigrationInterface, QueryRunner} from "typeorm";

export class Post1632938943176 implements MigrationInterface {
    name = 'Post1632938943176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."post" ADD "authorIp" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."post" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "public"."post" ADD "clientId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."post" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "public"."post" ADD "clientId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."post" DROP COLUMN "authorIp"`);
    }

}
