import { Test, TestingModule } from '@nestjs/testing';
import { Test2Controller } from './test2.controller';
import { Test2Service } from './test2.service';

describe('Test2Controller', () => {
  let controller: Test2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Test2Controller],
      providers: [Test2Service],
    }).compile();

    controller = module.get<Test2Controller>(Test2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
