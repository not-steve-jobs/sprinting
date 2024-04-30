import {Permission} from 'src/modules/permission/permission.enum';
import {MyColleaguesFormFieldMode} from './enum/myColleaguesFormFieldMode';
import {MyColleaguesFormFieldName} from './enum/myColleaguesFormFieldName';
import {MyColleaguesFormFieldType} from './enum/myColleaguesFormFieldType';
import {MyColleaguesFormField} from './interface';

const email: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.Email,
  type: MyColleaguesFormFieldType.Email,
  mode: MyColleaguesFormFieldMode.DisableEdit,
  label: 'email',
  placeholder: 'enterEmail',
  validation: {
    isRequired: true,
    maxChars: 255,
  },
};

const firstName: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.FirstName,
  type: MyColleaguesFormFieldType.Text,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'firstName',
  placeholder: 'enterName',
  validation: {
    maxChars: 255,
    isRequired: true,
  },
};

const lastName: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.LastName,
  type: MyColleaguesFormFieldType.Text,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'lastName',
  placeholder: 'enterName',
  validation: {
    maxChars: 255,
    isRequired: true,
  },
};

const title: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.Title,
  type: MyColleaguesFormFieldType.Text,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'titleInput',
  placeholder: 'enterTitle',
  validation: {
    maxChars: 255,
    isRequired: true,
  },
};

const department: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.Department,
  type: MyColleaguesFormFieldType.Select,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'department',
  placeholder: 'enterDepartment',
  validation: {
    isRequired: true,
  },
};

const functionField: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.Function,
  type: MyColleaguesFormFieldType.Select,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'function',
  placeholder: 'enterFunction',
  validation: {
    isRequired: true,
  },
  dependencyField: MyColleaguesFormFieldName.Department,
};

const mainLocation: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.MainLocation,
  type: MyColleaguesFormFieldType.Select,
  mode: MyColleaguesFormFieldMode.DisableEdit,
  label: 'mainLocation',
  placeholder: 'enterMainLocation',
  validation: {
    isRequired: true,
  },
};

const changeMainLocation: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.ChangeMainLocation,
  type: MyColleaguesFormFieldType.InFormButton,
  mode: MyColleaguesFormFieldMode.AllowOnlyEdit,
};

const permissionNote: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.PermissionsNote,
  type: MyColleaguesFormFieldType.Note,
  mode: MyColleaguesFormFieldMode.Generic,
};

const permissions: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.Permissions,
  type: MyColleaguesFormFieldType.MultiSelectSwitch,
  mode: MyColleaguesFormFieldMode.Generic,
  values: [
    {
      name: Permission.Assignments,
    },
    {
      name: Permission.StaffingRequests,
    },
    {
      name: Permission.Timesheets,
    },
    {
      name: Permission.ESignature,
    },
    {
      name: Permission.Invoices,
    },
    {
      name: Permission.Contracts,
    },
  ],
  validation: {
    isRequired: true,
  },
};

const locationNote: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.LocationsNote,
  type: MyColleaguesFormFieldType.Note,
  mode: MyColleaguesFormFieldMode.Generic,
};

const locationCounter: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.LocationsCounter,
  type: MyColleaguesFormFieldType.SelectionCounter,
  dependencyField: MyColleaguesFormFieldName.Locations,
  mode: MyColleaguesFormFieldMode.Generic,
};

const locations: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.Locations,
  type: MyColleaguesFormFieldType.Select,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'costumizeLocations',
  placeholder: 'selectLocation',
  icon: 'arrowDownIcon',
  styleConfig: 'cellDouble',
  validation: {
    isRequired: true,
    isMultiple: true,
  },
};

const addressLine1: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.AddressLine1,
  type: MyColleaguesFormFieldType.Select,
  mode: MyColleaguesFormFieldMode.Generic,
  dependencyField: 'external-service',
  label: 'addressLine1',
  placeholder: 'enterAddress',
  icon: 'searchIcon',
  validation: {
    isRequired: true,
  },
};

const addressLine2: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.AddressLine2,
  type: MyColleaguesFormFieldType.Text,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'addressLine2',
  placeholder: 'enterAddress',
  validation: {
    isRequired: false,
  },
};

const city: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.City,
  type: MyColleaguesFormFieldType.Text,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'city',
  validation: {
    isRequired: false,
    isDisabled: true,
  },
  dependencyField: MyColleaguesFormFieldName.AddressLine1,
};

const state: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.State,
  type: MyColleaguesFormFieldType.Text,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'state',
  validation: {
    isRequired: false,
    isDisabled: true,
  },
  dependencyField: MyColleaguesFormFieldName.AddressLine1,
};

const postalCode: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.PostalCode,
  type: MyColleaguesFormFieldType.Text,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'postalCode',
  validation: {
    isRequired: false,
    isDisabled: true,
  },
  dependencyField: MyColleaguesFormFieldName.AddressLine1,
};

const country: MyColleaguesFormField = {
  name: MyColleaguesFormFieldName.Country,
  type: MyColleaguesFormFieldType.Text,
  mode: MyColleaguesFormFieldMode.Generic,
  label: 'country',
  validation: {
    isRequired: false,
    isDisabled: true,
  },
  dependencyField: MyColleaguesFormFieldName.AddressLine1,
};

export const MyColleagueFormFields = {
  email,
  firstName,
  lastName,
  title,
  department,
  functionField,
  mainLocation,
  changeMainLocation,
  permissionNote,
  permissions,
  locationNote,
  locationCounter,
  locations,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  country,
};
