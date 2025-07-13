1. 创建nest项目

```js
> nest new 项目名称 -g -p pnpm
```

2. 生成一个增删改查模块

```js
> nset generate resource person // 也可以简写为 nest g resource person
```

3. 启动nest项目

```js
> nest start --watch // 也可以使用package.json中的 pnpm run start:dev, 本质上也是nest start --watch这个命令
```

> 启动后会发现终端打印的日志,红框里的就代表一个有person的crud接口的服务已经成功跑起来了

![image-20250712221447015](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712221447015.png)

4. 测试接口能否正常运行

> 例如我们访问`http://localhost:3000/person`,对应的controller或者说是handler就是findAll这个方法,对应的service也是findAll方法![image-20250712223110005](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712223110005.png)
>
> ![image-20250712223301023](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712223301023.png)
>
> ![image-20250712221858769](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712221858769.png)

## 访问静态资源

- nest中默认是不支持访问静态资源的,但是可以手动设置! 
  例如我想在浏览器中想访问`access文件夹中的index.html或者图片`呢?(图1).
  先访问一下试试看(图2),会发现直接报错了.

  那么究竟该如何实现呢?

![image-20250712224023221](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712224023221.png)

![image-20250712224342172](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712224342172.png)

- main.ts中开启静态资源访问

```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // 要给create方法传入NestExpressApplication泛型才会有useStaticAssets这些方法!!
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 第一个参数表示项目中的静态资源文件夹的名称,第二个参数表示浏览器访问的路径前缀, 例如现在想访问assets中的index.html,就需要写 localhost:3000/test/index.html
  app.useStaticAssets('assets', { prefix: '/test' }); 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

- 再次访问试试

> 会发现已经可以成功的访问到静态资源了!

![image-20250712224815906](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712224815906.png)

## URL Param参数

- url param是url中的参数,nest里通过 `:参数名`的方式来声明,然后通过`@param(参数名)`的装饰器取出来然后注入到`controller`
  @Controller('person')的路由和@Get(':username')的路由会拼到一起,也就是只有/api/person/xxx的get请求才会命中这个方法!

```js
import { Controller, Get, Param } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get(':username')
  urlParam(@Param('username') username: string) {
    console.log(username);
    return `参数是:${username}`;
  }
}
```

- 浏览器中访问`http://localhost:3000/person/zxx`, 会发现已经成功命中路由,并且参数也可以接收到!

![image-20250712231315809](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712231315809.png)

## Query参数

- 通过URL传递数据的方式除了`URL Params`还有`Query`
  `query`是`url`中 `?`后的字符串,需要做`url encode`, 在nest里,通过@Query装饰器来取出参数!
  试一下: 定义一个路由为person/testQuery的请求,在浏览器中通过`http://localhost:3000/person/testQuery?address=河北省`进行访问!

```js
import { Controller, Get, Param, Query } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

// 注意: 这个testQuery的路由一定要放在:username路由的前面,因为nest是从上往下匹配的,如果放在后面,那就会匹配到:username这个路由了

  @Get('testQuery')
  query(@Query('address') address: string, @Query('age') age: number) {
    console.log(address);
    return `参数是 address:${address}, age: ${age}`;
  }

  @Get(':username')
  urlParam(@Param('username') username: string) {
    console.log(username);
    return `参数是:${username}`;
  }
}
```

## FormUrlencoded

- `form urlencoded`是通过`body`传输数据,其实就是把`query`字符串放到了`body`里,所以需要做`url encode`
  用nest接受`form urlencoded`参数时,需要使用`@Body装饰器`,nest会解析请求体,然后注入到dto中!(dto的意思是 data transfer object, 就是用于封装传输的数据的对象)

- 先来封装一个dto

  ```js
  export class CreatePersonDto {
    username: string;
    age: number;
  }
  ```

- 再来定义一个路由
  ```js
  import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
  import { PersonService } from './person.service';
  import { CreatePersonDto } from './dto/create-person.dto';
  
  @Controller('person')
  export class PersonController {
    constructor(private readonly personService: PersonService) {}
  
    @Post()
    formUrlencodedAndJson(@Body() createPersonDto: CreatePersonDto) {
      return `参数是: ${JSON.stringify(createPersonDto)}`;
    }
  }
  ```

- 测试接口

  > 需要在接口测试工具中将`content type`设置为`x-www-form urlencoded`
  > 使用`axios`可能需要将headers设置为`{ 'content-type': 'application/x-www-form-urlencoded' }`
  > 会发现服务端成功的获取到了数据!

  ![image-20250712235832034](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712235832034.png)

## JSON

- `JSON`需要指定`content-type`为`application/json`,内容会以`JSON`的方式传输

- 后端代码同样使用`@Body`来接收,不需要做啥变动. `form urlencoded和json`都是从body中取值,nest内部会根据`content-type`做区分,然后使用不同的解析方式
  ```js
  import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
  import { PersonService } from './person.service';
  import { CreatePersonDto } from './dto/create-person.dto';
  
  @Controller('person')
  export class PersonController {
    constructor(private readonly personService: PersonService) {}
  
    @Post()
    formUrlencodedAndJson(@Body() createPersonDto: CreatePersonDto) {
      return `参数是: ${JSON.stringify(createPersonDto)}`;
    }
  }
  ```

- 测试下

  > 默认传输json其实就会指定content-type为`application/json`,不需要手动指定,但是在接口调试工具中还是需要手动设置一下的!
  >
  > 会发现服务器成功的接收到了通过json方式传递的数据!

![image-20250713000716286](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250713000716286.png)

## FormData

- `form urlencoded`和`json`都不适合传递文件,想传输文件要用`form data`

- `form data`是用`------`作为boundary分隔传输的内容的

  ![image-20250713211402114](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250713211402114.png)

- nest解析form data需要使用`FileInterceptor这个装饰器`,用`@UseInterceptors装饰器启用`,然后通过`@UploadedFiles来取`,非文件的参数同样是通过@Body来取
  ```js
  import {
    Body,
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
  } from '@nestjs/common';
  import { PersonService } from './person.service';
  import { CreatePersonDto } from './dto/create-person.dto';
  import { AnyFilesInterceptor } from '@nestjs/platform-express';
  
  @Controller('person')
  export class PersonController {
    constructor(private readonly personService: PersonService) {}
  
    @Post('file')
    @UseInterceptors(
      AnyFilesInterceptor({
        dest: 'uploads',
      }),
    )
    upload(
      @Body() createPersonDto: CreatePersonDto,
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      console.log(files);
      return `参数是:${JSON.stringify(createPersonDto)}`;
    }
  }
  ```

- 接口调试工具将`content-type`指定为`multipart/form-data`

  ![image-20250713211529154](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250713211529154.png)