项目开发离不开工程化的部分,比如创建项目/编译构建/开发时监听文件变动自动构建等.

nest项目自然也是这样,所以它在`@nestjs/cli`这个包中提供了`nest`这个命令.



## 两种安装nest-cli的方式

> 1. 通过npx执行,npm会把它下载下来然后执行
>
> ```js
> > npx @nestjs/cli new 项目名
> > nest
> ```

> 2. 全局安装nest然后执行
>
> ```js
> > pnpm i @nestjs/cli -g
> > nest
> ```

## NestCLI常用命令

### nest -h

- `nest -h`是`nest --help`的缩写形式,可以查看`nest-cli`中提供的所有命令!

![image-20250711233014531](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250711233014531.png)

### nest new及配置选项

- `nest new`: 用于创建项目,同时也可以指定一些配置选项,`nest new -h`可以查看所有的配置项

![image-20250711233312340](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250711233312340.png)

```js
`nest new 项目名称 -g`或`nest new 项目名称 --skip-git`: 表示创建项目时不初始化git

`nest new 项目名称 -s`或`nest new 项目名称 --skip-install`: 表示创建项目是不自动下载依赖(npm install)

`nest new 项目名称 -p npm或yarn或pnpm`或`nest new 项目名称 --package-manager npm或yarn或pnpm`: 用于指定包管理器

`nest new 项目名称 -l TypeScript或JavaScript`或`nest new 项目名称 --language TypeScript或JavaScript`: 用于指定创建项目时使用TS还是JS

`nest new 项目名称 --strict false或true`: 指定ts的编译选项是否开启严格模式

`--collection`: 配置一代码生成模板,一般不用改
```

### nest generate(生成单个文件)

- `nest generate`: 用于生成代码,例如controller/service/module等等.

> 例如生成一个module文件,会生成一个同名的文件夹与`.module`文件

![image-20250712001857429](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712001857429.png)

> 并且module会自动引入到app.module.ts文件中

![image-20250712001931816](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712001931816.png)

> 生成一个同名的(test1)controller试试, 会发现,在test1这个文件夹下生成了两个文件,一个是controller文件,一个是测试文件
>
> 如果不需要测试文件需要这样操作: nest generate controller test1 --spec 

![image-20250712002101776](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712002101776.png)

> 并且这个生成的controller也已经被自动引入到了module中

![image-20250712002344520](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712002344520.png)

> 再生成一个同名的(test1)service试试,同样的,也生成了两个文件,一个是service文件,一个是测试文件

![image-20250712002625207](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712002625207.png)

> 并且会发现,这个service也已经被自动引入到了test1.module.ts中

![image-20250712002807364](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712002807364.png)



### nest generate(生成一个完整的模块)

如果想生成一个完整的模块代码(包含module,controller,service,entity,dto),nest也提供了一种方式 => `nest resource 模块名字`.

> 来试一下吧,例如想生成一个完整的模块,模块名称为test2,要求是RESTAPI风格的增删改查.

```js
nest generate resource test2 // 执行后会弹出一下选项,因为nest支持http/websocket/graphql/tcp等,这里选择http的RESTAPI风格就可以了
```

![image-20250712003305008](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712003305008.png)

> 选择了REST API之后,又会问你是否需要生成基础的增删改查代码?,选择是就行了.

![image-20250712003452031](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712003452031.png)

> 选择确认生成基础增删改查代码后,就会开始生成整个模块的CRUD + REST API的代码!
>
> 当然,它同样也会自动在app.module.ts中被引入.

![image-20250712003927894](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712003927894.png)

### nest generate配置选项

- `nest generate --flat和--no-flat`: 用于指定是否生成对应目录的

> 不生成对应文件目录

![image-20250712004524402](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712004524402.png)

> 生成对应文件目录

![image-20250712004620857](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712004620857.png)

`nest generate --spec和--no-spec`: 用于指定是否生成测试文件

> 生成测试文件

![image-20250712004803295](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712004803295.png)

> 不生成测试文件

![image-20250712005002102](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712005002102.png)

`nest generate --skip-import`: 表示不导入到AppModule中

![image-20250712005258827](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712005258827.png)


### nest build

- `nest build`: 用于构建项目,执行`nest build`后,就会在`dist`目录下生成编译后的代码

![image-20250712005751243](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712005751243.png)

### nest build配置选项

```js
nest build -h // 查看全部配置选项

nest build --webpack // 编译方式,默认为tsc
nest build --watch // 监听文件变动,自动build, 但是watch只能监听js/ts文件,加上--watchAssets会连别的文件一同监听变化,并输出到dist目录中,比如.md,.yml文件.
nest build --path // 指定tsc配置文件的路径
nest build --config // nest-cli.json(nest-cli的配置文件)
```



- 两种编译方式,`nest`默认采用的是`tsc`编译,但是可以通过配置项或手动指定到`webpack`编译方式

> 上图dist目录中就是tsc编译的产物,这次来看一下webpack编译后输出的产物!
>
> 使用`nest build -h`先看一下全部命令,然后会发现有一个`--webpack选项`,即指定编译方式为webpack.
>
> 如果所见,webpack的产物只输出了一个main.js

![image-20250712010205793](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712010205793.png)

### nest-cli.json

![image-20250712011757193](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712011757193.png)

### nest start配置选项

```js
nest start // 运行项目

nest start --watch // 最常用,改动文件后自动进行build
nest start --debug // 启动调试的websocket服务,用来debug
nset start --exec //可以指定用什么跑,默认是node,也可以指定其他runtime
其余选项与nest build一样!!
```

### nest info

`nest info`用于查看项目信息(包含系统信息/node/npm和依赖版本信息等等)

![image-20250712012321517](/Users/zhangxinxin/Library/Application Support/typora-user-images/image-20250712012321517.png)