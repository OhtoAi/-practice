// 引入模块
// 负责服务器正常启动
const express = require("express");
const router = require("./router");
const bodyParser = require("body-parser");
const app = express();

//设置 模板引擎
app.engine("html",require("express-art-template"));
app.set("views","./pages");
