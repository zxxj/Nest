import { Module } from '@nestjs/common';
import { Test1Controller } from './test1.controller';
import { Test1Service } from './test1.service';

@Module({
  controllers: [Test1Controller],
  providers: [Test1Service],
})
export class Test1Module {}
