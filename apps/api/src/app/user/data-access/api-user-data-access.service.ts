import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ApiCoreDataAccessService } from '../../core/data-access';

@Injectable()
export class ApiUserDataAccessService {
  private readonly logger = new Logger(ApiUserDataAccessService.name);

  constructor(private readonly data: ApiCoreDataAccessService) {}

  findMany() {
    return this.data.findUsers();
  }

  async findOne(userId: string) {
    const found = await this.data.findUserById(userId);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
}
