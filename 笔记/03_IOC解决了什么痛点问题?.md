后端系统中,会有很多对象:

- Controller对象: 接收http请求,调用service,返回响应

- Service对象: 实现业务逻辑

- Repository对象: 实现对数据库的增删改查

  此外,还有数据库连接对象DataSource,配置对象Config等等.

这些对象有着错综复杂的关系:

- Controller依赖了Service来实现业务逻辑,Service依赖了Repository来实现对数据库做增删改查,Repository依赖了DataSource来建立与数据库的连接,DataSource又需要从Config对象中拿到数据库的用户名与密码等信息.

- 这样就导致了创建这些对象时是很复杂的,需要先理清他们之间的关系,要知道哪些需要先创建,哪些需要后创建.
  例如:

  ```js
  const config = new Config({ root: 'root', password: 123456 }) // 配置对象, 传入数据库配置
  const dataSource = new DataSource(config) // 数据源,用于连接数据库
  const repository = new Repository(dataSource) // 数据访问层,负责执行SQL
  const service = new Service(repository) // 业务层, 处理业务逻辑
  const controller = new Controller(service) // 控制器,处理请求和响应
  ```

  要经过一系列的初始化之后才能使用Controller对象,而且像config,datasource,repository,service,controller等这些对象不需要每次都new一次,一直用一个就可以,也就是始终保持单例模式.
  所以就需要在应用初始化之前,首先要理清依赖的先后关系,创建一大堆对象然后组合起来,还要保证不要多次new,是不是很麻烦?

  没错,这就是一个后端系统都存在的痛点问题,解决这个痛点的方式就是使用IOC.

- 什么是IOC?

  上面手动创建和组装对象不是很麻烦么,那么我想,能不能我在class上声明了依赖了什么,然后让工具去分析我声明的依赖关系,根据先后顺序自动把对象创建好了并组装起来呢?
  
  
  
  >  例如这样声明AppCotroller,它依赖了这个`AppService`,然后让工具分析依赖自动帮我创建好这两个对象并设置好依赖关系.
  >
  > 这就是IOC的实现思路.
  >
  > IOC有一个放对象的容器,程序初始化的时候会扫描class上声明的依赖关系,然后把这些class都先new一次,然后全部放到容器中.
  >
  > 创建对象的时候,再把它们所依赖的对象注入进去,这样不就完成了自动的对象创建和组装么?
  >
  > 这种依赖注入的方式叫做DI(Dependency Injection).
  >
  > 而这种方案为什么被叫做IOC也可以被理解了,本来是应该手动new依赖对象的,然后组装起来,现在是在class上声明依赖了啥,然后等待被注入.
  >
  > 从主动创建依赖到被动等待注入,这就是反转控制(Inverse of Control).
  >
  > 在class上声明依赖的方式,大家都选择的装饰器的方式(在java中叫做注解).
  >
  > 比如下面就是声明这个class要放到IOC容器中,然后它的依赖是啥,这样IOC容器扫描到它就知道要怎么创建它的对象了.
  >
  > 
  
  ![image-20250715231155589](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250715231155589.png)

## nest中的IOC

- 了解IOC之后,就来看一下nest中是如何使用IOC的吧.

- 首先,创建一个nest项目

  ```js
  nest new 项目名称 -g -p pnpm
  ```

- 再来看一下它是怎么创建对象的

  ```ts
  // app.service.ts
  
  // 它有一个AppService,使用@injectable装饰器声明了,代表这个class是可以注入到其他对象中,并且别的对象也可以注入到此对象中,并且使用@injectable声明后,nest就会把它的对象放到IOC容器中.
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  export class AppService {
    getHello(): string {
      return 'Hello World!';
    }
  }
  ```

  ```ts
  // app.controller.ts
  
  // AppController被@Controller这个装饰器声明,代表这个class可以被注入,nest也会把它的对象放到IOC容器中.
  // AppController的构造器参数依赖了AppService
  
  // 为什么Controller是单独的装饰器呢?: 
  // 因为Service是可以被注入,也可以注入到别的对象的,所以用@Injectable声明.
  // 而Controller只需要被注入,所以nest单独给它加了@Controller的装饰器.
  
  import { Controller, Get } from '@nestjs/common';
  import { AppService } from './app.service';
  
  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService) {}
  
    @Get()
    getHello(): string {
      return this.appService.getHello();
    }
  }
  ```

  然后在`AppModule`中引入

  ```js
  // app.module.ts
  
  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  
  // 通过@Module装饰器声明模块
  @Module({
    imports: [],
    controllers: [AppController], // 控制器,只能被注入
    providers: [AppService], // providers里可以被注入,也可以注入到别的对象,比如这里的AppService
  })
  export class AppModule {}
  
  ```

  然后在入口模块跑起来

  ```ts
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule); // 传入AppModule
    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
  ```

  那么nest就会从AppModule开始解析class上通过装饰器声明的依赖信息,然后自动创建和组装对象.

  ![image-20250715233248992](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250715233248992.png)

  所以AppController中只声明了对AppService的依赖,就可以调用AppService中的方法了!
  因为nest在背后做了对象创建和依赖注入的工作!

  ![image-20250715233404090](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250715233404090.png)

## nest的模块机制

- nest还提供了模块机制,可以把不同业务的controller,service等放到不同的模块里.

  > 1.创建模块

  ```js
  nest generate module other // 执行过后,会生成如下代码
  ```

  ```ts
  // src/other/other.module.ts
  import { Module } from '@nestjs/common';
  
  @Module({})
  export class OtherModule {}
  ```

  > 会发现,并且模块生成后还会在AppModule中自动导入

  ```ts
  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { OtherModule } from './other/other.module';
  
  @Module({
    imports: [OtherModule], // 自动导入了!, 而且一旦导入other这个模块后,这个other模块exports的provider就可以在当前模块中注入使用了!
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ```

  > 2.创建一个service文件试试

  ```js
  nest generate service other --no-spec // 执行过后,会生成如下代码,并且它会自动添加到到OtherModule的providers中
  ```

  ```ts
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  export class OtherService {}
  ```

  > 生成后,会被自动添加到OtherModule的providers中

  ```ts
  import { Module } from '@nestjs/common';
  import { OtherService } from './other.service';
  
  @Module({
    providers: [OtherService], // 被自动添加到这里了
    exports: [OtherService],
  })
  export class OtherModule {}
  ```

  > 3. 然后我们在service中添加一个方法,然后在module中exports它,测试一下service是否被注入到了其他模块

  ```ts
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  export class OtherService {
    // 添加一个测试方法`
    test() {
      return 'other-test';
    }
  }
  ```

  > 4. 然后在AppController中注入OtherService,试一下是否能成功注入,并且使用方法

  ```ts
  import { Controller, Get, Inject } from '@nestjs/common';
  import { AppService } from './app.service';
  import { OtherService } from './other/other.service';
  
  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService) {}
  
    // 注入OtherService
    @Inject(OtherService)
    private readonly otherService: OtherService;
  
    @Get()
    getHello(): string {
      return this.appService.getHello();
    }
  
    // 调用测试方法
    @Get('test')
    test(): string {
      return this.otherService.test();
    }
  }
  ```

  > 启动项目

  ```js
  pnpm run start:dev
  ```

  > 访问htttp://localhost:3000/test,会发现成功的访问到了OtherService中的方法!这就是nest中的IOC机制!

  ![image-20250715235224144](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250715235224144.png)

  

  