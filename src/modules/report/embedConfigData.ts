import {PowerBiReportData} from './powerBiReportData';

export interface EmbedConfigData {
  type?: string;
  reportsDetail?: PowerBiReportData[];
  embedToken?: EmbedToken;
}

export interface EmbedToken {
  token: string;
  tokenId: string;
  expiration: string;
}
