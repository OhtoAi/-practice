// 路由，一套处理规则，只需分配任务
const hanlder = require("./hanlder");

// 暴露处理路由函数，函数可以接受参数
module.exports = (req,res) => {
  if (req.url.startsWith("/index") || req.url == "/") {
    hanlder.showIndex(req,res);
  } else if (req.url.startsWith("/details")) {
    hanlder.showDetails(req,res);
  } else if (req.url.startsWith("/submit")) {
    hanlder.showSubmit(req,res);
  } else if (req.url.startsWith("/assets")) {
    hanlder.showAssets(req,res);
  } else if (req.url.startsWith("/add") && req.method == "GET") {
    hanlder.addGet(req,res);
  } else if (req.url.startsWith("/add") && req.method == "POST") {
    hanlder.addPost(req,res);
  } else {
    hanlder.show404(req,res);
  }
}