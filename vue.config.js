//安装 body-parser 可以让我们拿到 post 请求里面的 body 数据
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    devtool: "source-map"
  },
  devServer: {
    before(app) {
      app.use(bodyParser.json()); // 针对 content-type 是 application/json
      app.use(bodyParser.urlencoded({ extended: false })); // 针对 content-type 是 application/x-www-form-urlencoded
      app.use(cookieParser());
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        bypass: function(req, res) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.");
            return "/index.html";
          } else if (process.env.MOCK !== "none") {
            // 按照命名规范，找到 mock 目录下的文件名
            const name = (req.path.split("/api/")[1] || "")
              .split("/")
              .join("_");
            // 获取到 js 里的函数，并获取到特定方法下的返回值
            const mock = require(`./mock/${name}`);
            const result = mock(req);
            // 手动删除缓存，使得每次 mock 数据更新可以及时生效
            delete require.cache[require.resolve(`./mock/${name}`)];
            return res.send(result);
          }
        }
      }
    }
  }
};
