const http = require("http");
// 引入路由模块
const router = require("./router");

const server = http.createServer();

//绑定事件处理请求
// 根据不同请求，返回对应页面， （页面的数据都是动态渲染的）
server.on("request",(req,res) => {
  router(req,res);
});
server.listen(9999,() => console.log("http://localhost:9999 这个服务器已经启动了"));