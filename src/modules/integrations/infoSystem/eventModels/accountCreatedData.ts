import {WorkplaceStatus} from 'src/modules/workplace/workplace.enum';

export interface AccountCreatedData {
  locationId: string;
  parentLocationId?: string;
  businessName?: string;
  vat?: string;
  number?: string;
  phonePrefix?: string;
  phone?: string;
  web?: string;
  email?: string;
  locationName: string;
  city?: string;
  state?: string;
  street?: string;
  postalCode?: string;
  isMainLocation: boolean;
  country?: string;
  status?: string;
  recType?: string;
  workplaceStatus?: WorkplaceStatus;
  workEnvironment?: string;
}
