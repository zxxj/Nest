import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test1Module } from './test1/test1.module';
import { Test2Module } from './test2/test2.module';
import { Test3Module } from './test3.module';
import { Test3Controller } from './test3/test3.controller';
import { Test4Module } from './test4/test4.module';

@Module({
  imports: [Test1Module, Test2Module, Test3Module, Test4Module],
  controllers: [AppController, Test3Controller],
  providers: [AppService],
})
export class AppModule {}
