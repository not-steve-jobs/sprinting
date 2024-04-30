import {WorkplaceStatus} from 'src/modules/workplace/workplace.enum';

export interface AccountUpdatedData {
  locationId: string;
  businessName?: string;
  vat: string;
  number: string;
  phonePrefix: string;
  phone: string;
  web?: string;
  locationName: string;
  city: string;
  state: string;
  street: string;
  postalCode: string;
  isMainLocation: boolean;
  country: string;
  status?: boolean;
  recType?: string;
  workplaceStatus?: WorkplaceStatus;
  workEnvironment?: string;
  parentLocationId?: string;
}
