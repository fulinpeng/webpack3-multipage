/**
 * Created by flp on 2018/4/20.
 */
console.log("####", process.env.NODE_ENV);
const ISDEV = process.env.NODE_ENV == "prod" ? false : true;
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 向 HTML 动态添加 bundle
const CleanWebpackPlugin = require("clean-webpack-plugin"); // 清理dist文件夹
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 分离 CSS 文件
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin"); // 直接拷贝不需要处理的资源，类似gulp
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const basePath = ISDEV ? "http://127.0.0.1:8080/dist" : "线上路径";

const glob = require("glob");
const config = {
  entry: {
    "src/js/main": "src/js/main.js",
    vender: ["./src/js/lib/jquery-3.2.1.min.js"]
  },
  output: {
    filename: "[name].[hash:5].js", // 变量 name 为 entry 中每个入口文件的文件名
    path: path.resolve(__dirname, "dist/"),
    publicPath: basePath, // 所有静态资源的根路径 js img css等，方便上线时统一修改为绝对路径
    chunkFilename: "[name].[hash:5].js" // 变量 name 在 CommonsChunkPlugin 插件中设置
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2015", "stage-3"]
            }
          }
        ]
      },
      {
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader", // 失败了就执行style-loader, 它是将css通过js的方式插入到style标签中
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "postcss-loader", // 自动添加浏览器前缀
              options: {
                config: {
                  path: "postcss.config.js" // 这个得在项目根目录创建此文件
                }
              }
            },
            {
              loader: "less-loader"
            }
          ]
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              useRelativePath: false, // 是否使用相对路径
              name: "images/[name].[hash:5].[ext]",
              limit: 10240 // 图片小于 10kb 此数则转换成 base64编码 格式
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/i,
        use: ["html-withimg-loader"] // 处理HTML中图片路径问题
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(csv|tsv)$/,
        use: ["csv-loader"]
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/[contenthash:5].css"), // 为分离的css命名，这个name默认是它被打包后所在的js的输出文件的配置名字
    new CleanWebpackPlugin(["dist"]), // 执行webpack前清空dist目录
    new HtmlWebpackPlugin({
      // 当只有一个页面时，直接在这里写就是了，若有多个要借助函数处理
      title: "首页标题",
      meta: [
        {
          name: "添加description",
          content: "content content content content"
        }
      ],
      mobile: true, // 没看出来有什么效果
      // favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
      filename: "./index.html", // 生成的html存放路径，相对于pathPublic的
      template: path.resolve(__dirname, "index.html"), // html模板路径
      inject: "body", // js插入的位置，true：'head'，'body'：false
      // hash: true, // 为静态资源生成hash值 ?2c0901dec5bd0f6f034b
      chunks: ["commons", "src/js/main"], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: {
        // 压缩HTML文件
        removeComments: !ISDEV, // 移除HTML中的注释
        collapseWhitespace: !ISDEV // 删除空白符与换行符
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // 切割成多个js文件，方便在html中用script引入
      name: "commons", // ( 该公共chunk 的 chunk名称)
      filename: "commons/commons.js" // ( 生成的公共文件的文件名)
      // minChunks: 3, // (至少有3个文件共有)
      // chunks: ['pageA', 'pageB'], // (只使用这些 入口 chunk )
    }),
    new webpack.optimize.ModuleConcatenationPlugin({
      warnings: !ISDEV, // 是否去除警告
      sourceMap: ISDEV, // 是否生成资源地图，开启打包会变慢
      warningsFilter: ISDEV, // 也可以是一个函数
      parallel: {
        // 并行处理
        cache: ISDEV,
        workers: 2 // 并行数量2
      }
    })
    // new CopyWebpackPlugin([
    //   { from: "./src/img/", to: path.resolve(__dirname, "dist/src/img/") } //拷贝图片
    // ]),
  ],
  resolve: {
    extensions: [".js", ".less", ".css", ".json"], // require或import的时候可以不带后缀
    alias: {
      // 别名，将文件路径映射为一个全局变量
      main: path.resolve(__dirname, "src/css/main")
    }
  },
  externals: {
    // 外部扩展
    $: "jQuery",
    react: "React"
  }
};

if (ISDEV) {
  // 生产环境
  config.plugins.concat([
    new webpack.HotModuleReplacementPlugin() // 模块热替换
  ]);
  config.devtool = "inline-source-map"; // 提供了 source map 功能
  config.devServer = {
    // 定义了 contentBase 之后，url后面会跟上过个 //dist ，甚至提示重定向次数过多
    contentBase: basePath, //根目录为 根目录/dist，这个路径一般与output.path一致，因为html插件生成的index是放在output.path这个目录下
    host: "127.0.0.1",
    port: 8080, //端口改为9000
    open: true, // 自动打开浏览器，每次启动服务器会自动打开默认的浏览器
    // index:'index.html', // 可以不配
    inline: true, // 默认为true, 意思是，在打包时会注入一段代码到最后的js文件中，用来监视页面的改动而自动刷新页面,当为false时，网页自动刷新的模式是iframe，也就是将模板页放在一个frame中
    // hot:true, // 这个设置了将不会刷新页面
    // hotOnly: true, // 这个设置为true将不会刷新页面
    compress: true //压缩
  };
} else {
  config.plugins.concat([
    new UglifyjsWebpackPlugin({
      sourceMap: false
    })
  ]);
}

// 下面这个函数是处理html引用正确的js的分析逻辑，很烂，很烂，目录结构变了就得换一套
~(function () {
  // 多页面入口文件处理：以函数形式函数生成 entries，并添加到config中
  const jsDir = path.resolve("src/", "js");
  const files = glob.sync(jsDir + "/*.{js,jsx}"); // 所有文件绝对路径数组
  const newEntries = {};
  files.forEach(function (f) {
    const name = /.*\/(src\/.*?)\.js/.exec(f)[1]; // 得到 src/js/list 这样的文件名
    newEntries[name] = f;
  });
  config.entry = Object.assign({}, config.entry, newEntries);

  //生成HTML模板
  const pagesDir = path.resolve("src/", "pages");
  const pages = glob.sync(pagesDir + "/*.html"); // 所有文件绝对路径数组
  const pagesEntries = {};
  pages.forEach(function (f) {
    const name = /.*\/(src\/.*?)\.html/.exec(f)[1]; // 得到 src/pages/list 这样的文件名
    const urlArr = name.split("src/");
    const fileName = urlArr[1].split("/")[1];
    // const fileName='./' + urlArr[1];
    const conf = {
      filename: "./" + urlArr[1] + ".html", // 生成的html存放路径
      template: name + ".html", // html模板路径
      inject: true, // 允许插件修改哪些内容,包括head与body，false 则不插入任何js
      hash: false, // 是否添加hash值
      minify: {
        // 压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      },
      chunks: ["src/js/" + name.split("pages/")[1], "commons"] // 需要引入的chunk，不配置就会引入所有页面的资源
    };
    console.log("src/js/" + name.split("pages/")[1]);
    config.plugins.push(new HtmlWebpackPlugin(conf));
  });
})();

module.exports = config;
