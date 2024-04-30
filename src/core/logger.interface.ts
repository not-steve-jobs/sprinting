export interface LoggerHttpOutboundData {
  url: string;
  path: string;
  method: string;
  route: string;
  queryString?: string;
  payload: string;
  headers: any;
  responseTime: number;
  success: boolean;
  statusCode: number;
  responsePayload: string;
  responseHeaders: any;
}
