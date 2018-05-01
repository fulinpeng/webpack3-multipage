# webpack

## 概述

* 模块化：是一种将系统分离成独立部分的方法，严格定义模块接口、模块间具有透明性
* 这是前端模块化的打包工具，用于将关注点(concern)从环境(environment)、构建目标(build target)、运行时(runtime)中分离，然后使用专门的工具（如 webpack-merge）将它们合并；
* webpack 的配置文件，是导出一个对象的 JavaScript 文件
  * 此对象，在 webpack 中根据对象定义的属性进行解析
  * 使用 js 控制流表达式、操作符、常量、变量，或编写并执行函数来生成部分配置
* webpack 配置是标准的 CommonJS 模块，能够以各种方式表达它们的依赖关系
  * ES2015 import 语句
  * CommonJS require() 语句
  * AMD define 和 require 语句
  * css/sass/less 文件中的 @import 语句
  * 样式(url(...))或 HTML 文件(<img src=...>)中的图片链接(image url)
* 注意
  * 避免导出不确定的值（调用 webpack 两次应该产生同样的输出文件）
  * 编写很长的配置（应该将配置拆分为多个文件）
  * 使用 webpack 命令行接口时，应该编写自己的命令行接口，或使用 --env）
* webpack 接受以多种编程和数据语言编写的配置文件

## Entry

* 单文件入口

  * 有两种语法：直接写路径、对象写法
    * entry + 路径
    * entry + 对象
  * 对象写法定义入口是`最可扩展`的方式

* 多个主入口(multi-main entry)

  * 传入一个依赖文件数组，方便将依赖 graph 到一个 chunk

* 应用场景
  * 分离 应用程序(app) 和 第三方库(vendor) 入口
    * webpack 依据 entry 值，来创建依赖图(dependency graph)
  * 长效缓存 CommonsChunkPlugin 提取 vendor 引用(vendor reference) 到 vendor bundle
  * 多页面应用程序
    * 每个 HTML 文档只使用一个入口起点

## Output

* 输出

  * 可以控制 webpack 如何向硬盘写入编译文件
  * filename 输出文件的文件名
  * path 目标输出目录的绝对路径

* path/publicPath
  * 可以用 [hash]
  * 在编译时不知道最终输出文件的 publicPath 的情况下，publicPath 可以留空
  * path:是 webpack 所有文件的输出的路径，必须是绝对路径
  * publicPath:输出解析文件的目录，url 相对于 HTML 页面

## Loaders

* 源代码转换

  * 可以使你在 import 或"加载"模块时预处理文件
  * 将文件从不同的语言（如 TypeScript）转换为 JavaScript
  * 将内联图像转换为 data URL
  * 甚至允许你直接在 JavaScript 模块中 import CSS 文件
  * 为 JavaScript 生态系统提供了更多能力，如压缩、打包、语言翻译和其他更多

* loader 有三种使用方式

  * 配置 在 webpack.config.js 文件中指定 loader（推荐）
  * 内联 在每个 import 语句中显式指定 loader
    * import Styles from 'style-loader!css-loader?modules!./styles.css';
  * CLI 在 shell 命令中指定 loader
    * webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'

* 特性

  * loader 对资源使用流水线(pipeline)按先后顺序编译。
    * 一个 loader 返回值给下一个 loader，最后一个 loader 返回 webpack 所预期的 JavaScript。
  * loader 可以是同步的，也可以是异步的
  * loader 运行在 Node.js 中，并且能够执行任何可能的操作
  * loader 接收查询参数或 options 对象进行配置，对 loader 传递配置
  * 除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader
    * 做法是在 package.json 里定义一个 loader 字段
  * loader 能够产生额外的任意文件
  * loader 模块需要导出为一个函数，并且使用 Node.js 兼容的 JavaScript 编写
    * 可以将自定义 loader 作为应用程序中的文件。按照约定，loader 通常被命名为 xxx-loader
  * 将模块暴露给全局
  * 排出一些不需要加载的目录

* 加载文件
  * 使用 csv-loader 和 xml-loader，加载 JSON 文件，CSV、TSV 和 XML
  * loader 加载图片时，它会识别这是一个本地文件，url 地址替换为输出目录中图像的最终路径，处理过程类似 import 引入 js 文件
  * file-loader 和 url-loader 可以接收并加载任何文件

## Plugins

* 介绍
  * 插件 plugin 目的在于解决 loader 无法实现的其他事
  * apply 属性可以被 compiler 对象在整个编译生命周期访问
    * 你可以在配置中使用这样的方式来内联自定义插件（compiler.apply）
* 用法
  * 在 webpack 配置中向 plugins 属性传入带有参数的 new 实例

## alias

## 模块(Modules)

* 支持各种语言和预处理器编写模块
  * webpack 如何处理非 JavaScript(non-JavaScript) 模块，并且在 bundle 中引入这些依赖
    * 通过 loader 可以支持各种语言和预处理器编写模块
* 保证开发、测试和生成流程的无侵入性(non-opinionated)
  * webpack 提供了可定制的、强大和丰富的 API，允许任何技术栈使用 webpack

## 模块解析(Module Resolution)

* resolver
  * resolver 是一个库(library)，用于帮助找到模块的绝对路径
  * 打包模块时，webpack 使用 enhanced-resolve 来解析文件路径
* 缓存
  * 每个文件被访问后都被缓存在系统中，以便更快触发对同一文件的多个并行或穿行请求
  * 在观察模式下，只有修改过的文件会从缓存中摘出，如果关闭观察模式，在每次编译前清理缓存

## 依赖图表(Dependency Graph)

* webpack 从命令行或配置文件中定义的一个模块列表开始，处理你的应用程序
* webpack 从入口起点开始，webpack 递归地构建一个依赖图

## 文件清单(Manifest)

* runtime 和 manifest 管理所有模块的交互
  * Runtime 在浏览器运行时，webpack 用来连接模块化的应用程序的所有代码
    * 包含：在模块交互时，连接模块所需的加载和解析逻辑
    * 包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑
  * Manifest 当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点，这个数据集合称为 "Manifest"
  * 他们是模块热替换的前置条件
* webpack 幕后工作
  * 编译器执行、解析和映射应用程序，生成一个包含所有模块的详细要素的数据集合（Manifest）
  * 打包完成，然后发送给浏览器，在运行时再通过 Manifest 来解析和加载模块
  * runtime 通过 manifest 数据查询模块标识符，检索出背后对应的模块（通过**webpack_require**方法）

## 构建目标(Targets)

* 切换构建目标，因为服务器和浏览器代码都可以用 JavaScript 编写
  * 默认是 'web'，可省略
  * 使用 'node'，webpack 会编译为用于「类 Node.js」环境

## 模块热替换(Hot Module Replacement)

* 在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面
  * 保留在完全重新加载页面时丢失的应用程序状态
  * 只更新变更内容
  * 调整样式更加快速

## 安装

* 建议本地安装
  * 可以使我们在引入破坏式变更(breaking change)的依赖时，更容易分别升级项目
  * 当你在本地安装 webpack 后，你能够从 node_modules/.bin/webpack 访问它的 bin 版本
  * 不推荐全局安装
  * 这会将您项目中的 webpack 锁定到指定版本，并且在使用不同的 webpack 版本的项目中，可能会导致构建失败

## 起步

* 常用命令
    * webpack --config webpack.min.js //另一份配置文件
    * webpack --display-error-details //显示异常信息
    * webpack --watch   //监听变动并自动打包
    * webpack -p    //压缩混淆脚本，这个非常非常重要！
    * webpack -d    //生成map映射文件，告知哪些模块被最终打包到哪里了
    * webpack --progress //显示进度条
    * webpack --color //添加颜色
    * npm info webpack    // 查看webpack 版本信息
    * npm install --save-dev webpack@<version>    // 安装特定版本

* 安装
    * npm init -y     // 快速初始化，会把README.md的部分内容当做description
    * npm install --save-dev webpack
    * node_modules/.bin/webpack src/index.js dist/bundle.js // 打包命令

* package.json 中配置：
> "scripts": {

>> "build": "webpack",     // 可以自动从node_modules中索引webpack并执行
>> "watch": "webpack --progress --watch",      // 观察模式启动
>> "start": "webpack-dev-server"      // 热更新，需要额外配置才能使用

> },

* 小结
  * 如果出现 XXX 不是内部命令，可能是需要管理员权限，linux 要加 sudo
  * 使用局部 webpack 之类的命令要用：./node_modules/.bin/webpack --config webpack.config.js
  * 在 script 中可以通过模块名，来引用本地安装的 npm 包，代替之前长长的命令
  * 传参：在命令和你的参数之间添加两个中横线，可以将自定义参数传递给 webpack

## API

## plugins

* 常用 plugins
  * HtmlWebpackPlugin // 向 HTML 动态添加 bundle
  * CleanWebpackPlugin // 清理 dist 文件夹
  * ExtractTextPlugin // 分离 CSS 文件
  * UglifyjsWebpackPlugin // 使用 UglifyJS 去压缩 JavaScript 代码
  * webpack.HotModuleReplacementPlugin // 模块热替换
  * webpack.optimize.CommonsChunkPlugin // 抽取公共模块，可将它缓存提高性能
  * webpackDevServer // 方便开发的实时加载服务器
  * CopyWebpackPlugin // 直接拷贝不需要处理的资源
  * postcss postcss-loader autoprefixer // 自动添加浏览器前缀 --- 需要在根目录添加 postcss.config.js
  * 添加 helper 函数来做额外的处理

## 运行

* npm run dev 开发环境下执行
* npm run watch 监测文件变化
* npm start 开发环境下使用，并有热更新
* npm run build 上线时使用
