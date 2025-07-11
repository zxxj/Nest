import { Module } from '@nestjs/common';
import { Test4Controller } from './test4.controller';

@Module({
  controllers: [Test4Controller],
})
export class Test4Module {}
