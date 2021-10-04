import * as express from 'express';
declare global {
  namespace Express {
    interface Request {
      userClient: Record<string, any>;
    }
  }
}
