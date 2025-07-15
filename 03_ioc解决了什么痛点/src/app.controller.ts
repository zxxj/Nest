import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { OtherService } from './other/other.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(OtherService)
  private readonly otherService: OtherService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test(): string {
    return this.otherService.test();
  }
}
