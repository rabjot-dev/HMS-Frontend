import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../services/logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logger: LoggerService) {}

  handleError(error: unknown): void {
    this.logger.error('Unhandled application error', error);
  }
}
