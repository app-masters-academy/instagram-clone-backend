# Deploy a Nestjs api to Heroku

## configs for typeorm/database
- ### synchronize
Must be ``false`` when deploying to avoid lose data.

- ### ssl
Verify if your database needs a ssl config and change


## files needed:
- ### Procfile
Instructions to Heroku, example: ``web: yarn run start:prod``
___
- ### .nvmrc
Contains node version to avoid conflicts, example: ``v14.17.6``
___
