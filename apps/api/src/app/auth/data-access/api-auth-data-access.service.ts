import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ApiAuthDataAccessService {
  private readonly logger = new Logger(ApiAuthDataAccessService.name);

  constructor() {}

  register(body) {
    this.logger.verbose(`Register: ${JSON.stringify(body, null, 2)}`);
    return body;
  }
}
