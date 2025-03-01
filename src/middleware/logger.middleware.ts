import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${method} ${url} - ${res.statusCode} (${duration}ms)`);
    });

    next();
  }
}
