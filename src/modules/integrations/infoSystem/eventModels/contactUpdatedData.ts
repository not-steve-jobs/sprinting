export interface ContactUpdatedData {
  userId: string;
  mainLocation: string;
  phonePrefix: string;
  phone: string;
  phonePrefixOtherPhone: string;
  otherPhone?: string;
  email: string;
  firstName: string;
  lastName: string;
  deptFunctionId: string;
  deptId: string;
  customDepartment: string;
  title: string;
  notifications: string;
  inactive?: boolean;
  language?: string;
}
