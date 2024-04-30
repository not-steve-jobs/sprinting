import {ServiceBusClient} from '@azure/service-bus';
import {ConfigService} from '@nestjs/config';
import {v4 as uuid} from 'uuid';
import {AppConfigService} from '../core/config/appConfig.service';

let connectionString;
let topicName;

let sbClient;
let sender;

const noOfCustomer = 10;
const noOfLocation = noOfCustomer * 10;
const noOfContact = noOfCustomer * 10;

const MAX_CUSTOMER_PER_BULK = 2;
const MAX_LOCATION_PER_BULK = noOfCustomer;
const MAX_CONTACT_PER_BULK = noOfCustomer;

async function main() {
  const infoSystemIntegration = await getInfoIntegrationConfig();

  connectionString = infoSystemIntegration.eventsConnectionString;
  topicName = infoSystemIntegration.eventsTopic;

  sbClient = new ServiceBusClient(connectionString);
  sender = sbClient.createSender(topicName);

  const genMainLocationIds = await sendCustomerBulk(
    noOfCustomer,
    MAX_CUSTOMER_PER_BULK,
    'bulkCustomerCreated',
    getCustomer,
    'locationId',
  );

  await sendLocationBulk(
    noOfLocation,
    MAX_LOCATION_PER_BULK,
    'bulkLocationCreated',
    getLocation,
    genMainLocationIds,
    'locationId',
  );

  await sendContactBulk(noOfContact, MAX_CONTACT_PER_BULK, 'bulkContactCreated', getContact, genMainLocationIds);

  await sender.close();
  await sbClient.close();
}

async function getInfoIntegrationConfig() {
  const loadEnv = (env) => require('dotenv').config({path: `${env}`});
  loadEnv(`.env.${process.env.NODE_ENV}.local`);
  loadEnv(`.env.local`);
  loadEnv(`.env.${process.env.NODE_ENV}`);
  loadEnv(`.env`);
  const envConfig = await import(`../../config/${process.env.NODE_ENV}`);
  console.log('env config', envConfig.default());
  const configService = new ConfigService(envConfig.default());
  const appConfigService = new AppConfigService(configService);

  return appConfigService.infoSystemIntegration;
}

async function sendCustomerBulk(noOfEntity, maxEntityPerBulk, bulkEventName, generatorFunc, bulkEntityParam = null) {
  let i = 1;
  let genIds = [];
  while (noOfEntity) {
    const messageCountInBulk = Math.min(noOfEntity, maxEntityPerBulk);
    noOfEntity -= messageCountInBulk;

    const msg = JSON.parse(JSON.stringify(baseMsg()));
    msg.eventName = bulkEventName;
    msg.parameters = new Array(messageCountInBulk).fill(0).map(() => generatorFunc());

    if (bulkEntityParam) {
      genIds = genIds.concat(msg.parameters.map((a) => a.parameters[bulkEntityParam]));
    }

    await sender.sendMessages({body: msg}).catch((err) => console.log(err));
    console.log(
      `BulkEventName: '${bulkEventName}', MessagesCountInBulk: ${messageCountInBulk}, BulkMessageNumber: ${i++}`,
    );
  }

  return genIds;
}

async function sendLocationBulk(
  noOfEntity,
  maxEntityPerBulk,
  bulkEventName,
  generatorFunc,
  entityParentIds,
  bulkEntityParam = null,
) {
  let i = 1;
  let genIds = [];
  while (noOfEntity) {
    const messageCountInBulk = Math.min(noOfEntity, maxEntityPerBulk);
    noOfEntity -= messageCountInBulk;

    const msg = JSON.parse(JSON.stringify(baseMsg()));
    msg.eventName = bulkEventName;
    msg.parameters = new Array(messageCountInBulk).fill(0).map((v, index) => generatorFunc(index, entityParentIds, i));

    if (bulkEntityParam) {
      genIds = genIds.concat(msg.parameters.map((a) => a.parameters[bulkEntityParam]));
    }

    await sender.sendMessages({body: msg}).catch((err) => console.log(err));
    console.log(
      `BulkEventName: '${bulkEventName}', MessagesCountInBulk: ${messageCountInBulk}, BulkMessageNumber: ${i++}`,
    );
  }

  return genIds;
}

async function sendContactBulk(
  noOfEntity,
  maxEntityPerBulk,
  bulkEventName,
  generatorFunc,
  entityParentIds,
  bulkEntityParam = null,
) {
  let i = 1;
  let genIds = [];
  while (noOfEntity) {
    const messageCountInBulk = Math.min(noOfEntity, maxEntityPerBulk);
    noOfEntity -= messageCountInBulk;

    const msg = JSON.parse(JSON.stringify(baseMsg()));
    msg.eventName = bulkEventName;
    msg.parameters = new Array(messageCountInBulk).fill(0).map((v, index) => generatorFunc(index, entityParentIds, i));

    if (bulkEntityParam) {
      genIds = genIds.concat(msg.parameters.map((a) => a.parameters[bulkEntityParam]));
    }

    await sender.sendMessages({body: msg}).catch((err) => console.log(err));
    console.log(
      `BulkEventName: '${bulkEventName}', MessagesCountInBulk: ${messageCountInBulk}, BulkMessageNumber: ${i++}`,
    );
  }

  return genIds;
}

const baseMsg = () => ({
  brand: 'ADECCO',
  country: 'CH',
  eventId: uuid(),
  candidateId: null,
  eventName: '',
  parameters: [],
});

const getCustomer = () => {
  return {
    brand: 'ADECCO',
    country: 'CH',
    eventId: uuid(),
    candidateId: null,
    eventName: 'accountCreated',
    parameters: {
      fax: null,
      vat: '6774700382',
      web: null,
      city: 'Test',
      phone: '1216487288',
      poBox: '3219',
      state: 'Vaud',
      number: '909049797',
      public: null,
      status: null,
      street: 'Test',
      country: 'Switzerland',
      recType: 'HQ Site',
      branchName: null,
      costCentre: 'Accounting',
      fiscalCode: null,
      locationId: uuid(),
      phoneOther: '+411216487288',
      postalCode: '1000',
      accountType: null,
      creditScore: null,
      description: null,
      phonePrefix: 'Switzerland +41',
      billingState: 'Vaud',
      businessName: null,
      locationName: 'Automation_CH_HQAcc_74203',
      segmentation: 'Large',
      sizeOfClient: 'Small',
      accountStatus: 'Legal Person',
      createdByUser: 'Testauto Branchuser',
      marketSegment: 'C: Manufacturing',
      countrySegment: 'SW0012345',
      isMainLocation: true,
      middleOfficeId: null,
      currencyIsoCode: 'CHF',
      techExternalKey: null,
      workEnvironment: null,
      workplaceStatus: null,
      headquartersFlag: true,
      lastModifiedDate: '03/10/2022 09:24:29',
      parentLocationId: null,
      phoneOtherPrefix: 'Switzerland +41',
      rangeOfEmployees: '10 to 19 employees',
      validatedAccount: true,
      accCreatedByEmail: null,
      numberOfEmployees: null,
      reasonWhyInactive: null,
      registrationCourt: null,
      billingCountryCode: 'CH',
      externalAccountKey: null,
      registrationNumber: null,
      approvedCreditLimit: null,
      clonedFromWorkplace: null,
      creditCheckPerformed: 'False',
      techExternalUniqueKey: null,
      accLastModifiedByEmail: null,
      lastModifiedByUsername: 'Testauto Branchuser',
      nationalIdentifierType: null,
      externalParentAccountKey: null,
    },
  };
};

const getLocation = (i: number, parentLocationIds: string[], randCounter: number) => {
  return {
    brand: 'ADECCO',
    country: 'CH',
    eventId: uuid(),
    candidateId: null,
    eventName: 'accountCreated',
    parameters: {
      fax: null,
      vat: '6774700382',
      web: null,
      city: 'Test',
      phone: '1216487288',
      poBox: '3219',
      state: 'Vaud',
      number: '909049797',
      public: null,
      status: null,
      street: 'Test',
      country: 'Switzerland',
      recType: 'HQ Site',
      branchName: null,
      costCentre: 'Accounting',
      fiscalCode: null,
      locationId: uuid(),
      phoneOther: '+411216487288',
      postalCode: '1000',
      accountType: null,
      creditScore: null,
      description: null,
      phonePrefix: 'Switzerland +41',
      billingState: 'Vaud',
      businessName: null,
      locationName: `Automation_CH_HQAcc_${randCounter}`,
      segmentation: 'Large',
      sizeOfClient: 'Small',
      accountStatus: 'Legal Person',
      createdByUser: 'Testauto Branchuser',
      marketSegment: 'C: Manufacturing',
      countrySegment: 'SW0012345',
      isMainLocation: false,
      middleOfficeId: null,
      currencyIsoCode: 'CHF',
      techExternalKey: null,
      workEnvironment: null,
      workplaceStatus: null,
      headquartersFlag: true,
      lastModifiedDate: '03/10/2022 09:24:29',
      parentLocationId: parentLocationIds[i],
      phoneOtherPrefix: 'Switzerland +41',
      rangeOfEmployees: '10 to 19 employees',
      validatedAccount: true,
      accCreatedByEmail: null,
      numberOfEmployees: null,
      reasonWhyInactive: null,
      registrationCourt: null,
      billingCountryCode: 'CH',
      externalAccountKey: null,
      registrationNumber: null,
      approvedCreditLimit: null,
      clonedFromWorkplace: null,
      creditCheckPerformed: 'False',
      techExternalUniqueKey: null,
      accLastModifiedByEmail: null,
      lastModifiedByUsername: 'Testauto Branchuser',
      nationalIdentifierType: null,
      externalParentAccountKey: null,
    },
  };
};

const getContact = (i: number, parentLocationIds: string[], randCounter: number) => {
  console.log(`bulk_gen${randCounter}${i}@yopmail.com`);
  return {
    brand: 'ADECCO',
    country: 'CH',
    eventId: uuid(),
    candidateId: null,
    eventName: 'contactCreated',
    parameters: {
      fax: null,
      email: `bulk_gen${randCounter}${i}@yopmail.com`,
      phone: '556677',
      title: 'test',
      deptId: 'de724683-0829-405d-b409-5615863e4b36',
      gender: null,
      mobile: null,
      userId: uuid(),
      function: 'HR Manager',
      inactive: false,
      isDirect: false,
      language: null,
      lastName: 'King',
      birthdate: null,
      deparment: 'Logistic/Transport',
      firstName: 'Melodie 20',
      otherPhone: null,
      salutation: 'Ms.',
      accountGUID: parentLocationIds[i],
      description: null,
      emailOptOut: 'False',
      mailingCity: 'Bern',
      mobilePhone: null,
      phonePrefix: 'Switzerland +41',
      mailingState: 'Bern',
      mainLocation: parentLocationIds[i],
      relationType: null,
      sourceSystem: 'Info',
      createdByName: 'VelimirMilicic',
      mailingStreet: 'Landoltstrasse 3',
      notifications: 'False',
      deptFunctionId: '35f891aa-5129-4779-afc1-d24ae5a5a99f',
      lastModifiedBy: 'Velimir Milicic',
      clientBirthDate: null,
      hobbiesComments: null,
      techSiteAccGUID: parentLocationIds[i],
      customDepartment: null,
      conCreatedByEmail: null,
      mailingPostalCode: '3007',
      externalAccountKey: null,
      mailingCountryCode: 'CH',
      contactWithoutEmail: 'False',
      surveyAllowanceGiven: null,
      phonePrefixOtherPhone: 'Switzerland +41',
      conLastModifiedByEmail: null,
      marketingCommunication: false,
    },
  };
};

main();
