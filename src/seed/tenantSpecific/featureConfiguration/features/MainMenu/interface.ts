/**
 * Config for the Menu Item displayed in the side nav on the FE
 *
 * @param {string} name - Name of the menu item
 * @param {string} link - The URL for this menu item
 * @param {string} linkType - Type of the URL (relative or external)
 * @param {string} iconName - Control the icon which should be displayed
 * @param {string} hostName - // TODO: Document this
 * @param {string} target - The target module to which this item belongs
 */
export interface MenuItemConfig {
  name: string;
  link: string;
  linkType: MenuItemLinkType;
  iconName: string;
  hostName: MenuItemHostName;
  target: string;
  roles?: string[];
}

export enum MenuItemLinkType {
  Relative = 'RELATIVE',
}

export enum MenuItemHostName {
  ClientAccess = 'CLIENT_ACCESS',
}

/**
 * Feature to control the Main Menu options
 *
 * @param {MenuItemConfig[]} menuItems - List with all menu items
 */
export interface MainMenuFeatureConfiguration {
  menuItems: MenuItemConfig[];
}
