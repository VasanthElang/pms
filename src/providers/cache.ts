/**
 * Define cache middleware
 *
 * @author Vasanth Elangovan
 */

import * as mcache from 'memory-cache';
import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

class Cache {
  public cache(_duration: number): any {
    return (req: Request, res: Response|any, next: NextFunction) => {
      if (req.method !== 'GET') {
        next();
      }
      const key = `__express__${req.originalUrl}` || req.url;

      const cachedBody = mcache.get(key);
      if (cachedBody) {
        res.send(JSON.parse(cachedBody));
      } else {
        res.sendResponse = res.send;
        res.send = (body: any) => {
          mcache.put(key, body, _duration * 1000);
          res.sendResponse(body);
        };
        next();
      }
    };
  }

  public clearAllCache(): void {
    logger.log({
      level: 'info',
      message: 'cleared all cache from the api'
    });
    mcache.clear();
  }

  public deleteCache(key:string):void {
    mcache.del(key);
    logger.log({
      level: 'info',
      message: `cleared following api ${key} from the cache`
    });
  }
}

export default new Cache();
