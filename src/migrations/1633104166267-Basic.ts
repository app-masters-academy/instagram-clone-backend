import {MigrationInterface, QueryRunner} from "typeorm";

export class Basic1633104166267 implements MigrationInterface {
    name = 'Basic1633104166267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."client" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."post" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`ALTER TABLE "public"."post" ALTER COLUMN "id" SET DEFAULT '0e69ca7b-7b54-49a4-9543-10c1cd4d153a'`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "id" SET DEFAULT '16c7fb51-042b-48ce-9e01-803ff6c7080d'`);
        await queryRunner.query(`ALTER TABLE "public"."post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."client" ALTER COLUMN "id" SET DEFAULT '60ad2d96-ceb7-487f-9bff-beaaec5248d9'`);
    }

}
