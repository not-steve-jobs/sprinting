// extend Express request with our context object (see ContextService)
declare namespace Express {
  export interface Request {
    context?: import('./context/context.service').ContextService;
  }
}
