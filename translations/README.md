### Generated translations information

This folder contains the generated JSON translation files, which are created from the cli commands with the help of the `nestjs-console` library and the `TranslationModule` module.

Once generated these files should be moved into the following directory:
`clientaccess-fe\zerotouch\public\locales\en`

### How to use

Inside `TranslationService` we have `entitiesConfig` and `entitesRelatedToTenantConfig` variables. They serve as configuration data
in which we define which of the entities we want to translate, what will be the generated filename, which of the service methods is used to
get the translatable records and what is the entity field we want to use as a translation value.

We have 2 types of entities:

1. Regular ones, where all the records data is stored in the entity table - the ones stored in `entitiesConfig` variable.
2. Tenant related ones, where for the different tenants we have different records - the ones stored in `entitesRelatedToTenantConfig` variable.

We can add/remove entities configurations from the `entitiesConfig` and `entitesRelatedToTenantConfig` variables in
order to add/remove entities that we want to generate translations for.

We can run the translation generation from the root project folder(clientaccess-be) with the following command:
`npm run console:dev g-translations`

### Additional information

We are not limited to only generating translation JSON files.
Thanks to `nestjs-console` library we can register and run every service method we want as a cli command.
