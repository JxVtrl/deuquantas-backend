import { Controller, Post } from '@nestjs/common';
import { TestDataService } from './test-data.service';

@Controller('test-data')
export class TestDataController {
  constructor(private readonly testDataService: TestDataService) {}

  @Post('create-test-users')
  async createTestUsers() {
    return this.testDataService.createTestUsers();
  }
} 