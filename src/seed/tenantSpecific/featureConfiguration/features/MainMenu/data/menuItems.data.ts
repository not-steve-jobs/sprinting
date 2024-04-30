import {MenuItemConfig, MenuItemHostName, MenuItemLinkType} from '../interface';

const dashboard: MenuItemConfig = {
  name: 'dashboard',
  link: '/',
  linkType: MenuItemLinkType.Relative,
  iconName: 'Dashboard',
  hostName: MenuItemHostName.ClientAccess,
  target: 'dashboard',
};

const orderManagement: MenuItemConfig = {
  name: 'orderManagement',
  link: '/client/staffing-requests',
  linkType: MenuItemLinkType.Relative,
  iconName: 'AddFriend',
  hostName: MenuItemHostName.ClientAccess,
  target: 'staffing-requests',
};

const contracts: MenuItemConfig = {
  name: 'contracts',
  link: '/client/contracts',
  linkType: MenuItemLinkType.Relative,
  iconName: 'Suitcase',
  hostName: MenuItemHostName.ClientAccess,
  target: 'contracts',
};

const invoices: MenuItemConfig = {
  name: 'invoices',
  link: '/client/invoices',
  linkType: MenuItemLinkType.Relative,
  iconName: 'M365InvoicingLogo',
  hostName: MenuItemHostName.ClientAccess,
  target: 'invoices',
};

const communication: MenuItemConfig = {
  name: 'communication',
  link: '/client/communication',
  linkType: MenuItemLinkType.Relative,
  iconName: 'OfficeChat',
  hostName: MenuItemHostName.ClientAccess,
  target: 'communications',
};

const reports: MenuItemConfig = {
  name: 'reports',
  link: '/client/report',
  linkType: MenuItemLinkType.Relative,
  iconName: 'Report',
  hostName: MenuItemHostName.ClientAccess,
  target: 'reports',
  roles: ['admin'],
};

export const mainMenuItems = {
  dashboard,
  orderManagement,
  contracts,
  invoices,
  communication,
  reports,
};
