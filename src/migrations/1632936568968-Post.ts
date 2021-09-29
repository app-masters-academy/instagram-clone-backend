import {MigrationInterface, QueryRunner} from "typeorm";

export class Post1632936568968 implements MigrationInterface {
    name = 'Post1632936568968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "likesCount" integer NOT NULL DEFAULT '0', "description" character varying NOT NULL, "photoUrl" character varying NOT NULL, "clientId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userIdId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_a218a3bf8f54282a66d6245b939" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_a218a3bf8f54282a66d6245b939"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
