# Getting Started

### Requirements

1. Node v12
2. Postgresql
3. not required, but good to have - pgAdmin

### Installation & Seed databse

1. `npm install`
2. update environments variable for database (Look at the next section)
3. `npm run db:migrate`
4. `npm run db:seed`
5. if anything goes wrong with local database, run `npm run db:reset`

### Environments

Enviroment variables are presented like `.env.${process.env.NODE_ENV}`.
If you want to override environment variable only for local, just add variable that you want to change in `.env.${process.env.NODE_ENV}.local`.

### Start scripts

1. `npm run start:dev` - reads from `.env.a` and `.env.a.local` environment.

### Build & Test

1. `npm run build` - will generate dist folder
2. `npm run start:prod` - will run builded version

To run test just run next script: `npm run test`

To format the code just run `npm run format`

# Documentation

Standard Nestjs documentation: https://docs.nestjs.com/

### Folder and file structure

In `src/modules` folder, we should add all modules that have own entity or controller.
Every module consists next:

- Entity
- Dtos
- Service
- Controller
- Repository
- Interface
- Enum ts files
- Builder
- Service.spec
- Controller.spec
- Repository.spec

Every file is named as `[filename].[fileExtension].ts`.

`src/core` are the files and modules that are used
`src/helper` consists of helper classes
`src/lib` consists of third party communications and base classes

### Files extensions

- `.module.ts` - Standard Nest module, always include core module inside it.
- `.map.ts` - Used for mapping data from the results of external API calls.
- `.controller.ts` - Standard controller
- `.helper.ts` - Injectable class with helper methods.
- `.utils.ts` - Set of functions used for initializations.
- `.seed.ts` - Set of data to seed the database.
- `.filter.ts` - It will be triggered when error occurs.
- `.context.ts` - Standard context. When you create one don't forget to update the `context.service.ts`
- `.interfaces.ts` - Set of interfaces
- `.builder.ts` - Builder class of entity
- `.base.ts` - Base classes, usually used to be extended
- `.dto.ts` - Standard Dto
- `.entity.ts` - Standard Entity
- `.error.ts` - Class of errors used in module/service etc.
- `.interceptor.ts` - NestJs interceptor
- `.decorator.ts` - Standard decorator
- `.repository.ts` - Standard repository
- `.repository.spec.ts` - Repository test
- `.controller.spec.ts` - Controller test
- `.service.spec.ts` - Service test
- `.integration.spec.ts` - Integration tests used
- `.api.ts` - Set of methods used for third-party communication
- `.map.ts` - Mapping the response data from `.api.ts` to types that we've defined in `.interfaces.ts` or in `.dto.ts`

### Authentification and authorization:

Just add decorator above controller method `@Auth(AuthScopes.admin, AuthScopes.user)`

# Test

### Mock data and methods

For mocking the data, we're using the builder pattern, with a little modification.
Instead of writing down for every entity property the method `with[propertyName]` that will do almost the same job, there is a `set` method where you can pass the object and change the values whichever you want.
Inside the constructor, set the parameters that represents minimum data for instance of entity to be created.

We have prepared few functions mock functions:

- `includeMockRepos` - changes all repositories methods to be `jest.fn()`.
- `includeTransactionalReset` - used to not save changes into database.

### Controller test

Answers on next questions:

- Which Auth Scopes that controller has
- Does it have body
- Which Route Parameters that controller has
- Which Query Parameters that controller has
- Which Path Route that controller has
- Is it calling right service method

Example: auth.controller.spec.ts

### Service test

Don't forget to run the function `includeMockRepos();`
Here we're going to mock all the injectable classes that are used in that service.
Example: auth.service.spec.ts

### Repository test

Don't forget to run the function `includeTransactionalReset();`
Example: user.repository.spec.ts

### Integration test

Don't forget to run the function `includeTransactionalReset();`
Example: app.integration.spec.ts

# Code Conventions

### Interfaces

- 1 file per interface/enum
- Related interfaces/enums can NOT be in same FILE but their files can be in the same folder.
- Interface file is named \*.interface.ts
- No interfaces and no interface filenames using the C# IName convention

# Adding a new tenant

### Seed changes

When a new tenant was added change this lookup table seeds:

- [certification.seed](data/JobRolesAndCertifications/JobRoleAndCertificationSeeds.md)
- employmentType.seed
- [jobRole.seed](data/JobRolesAndCertifications/JobRoleAndCertificationSeeds.md)
- rate.seed
- sector.seed
- serviceType.seed
- shift.seed
- status.seed
- type.seed
- permissions.seed
- closeReason.seed
- user.seed (new country code to be added)

  NOTE: It is possible to avoid adding any additional seed (rate.seed, sector.seed, ...) by configuring new added tenant to skip/include additional data:

```
        newTenant = {
            ...rest,
            seedFlags: {
                staffingRequests: false,
                contracts: true,
                invoices: false,
            }
        }
```

NOTICE! You will need to provide all statuses for new tenant in status.seed.ts also.
### Feature configuration

_featureConfigurationDataTenant[TenantName].ts_ should be created (as a copy of [featureConfigurationDataTenantAdeccoLux.ts](src/seed/featureConfigurationDataTenantAdeccoLux.ts)) and registered in [featureConfiguration.seed.ts](src/seed/featureConfiguration.seed.ts).
