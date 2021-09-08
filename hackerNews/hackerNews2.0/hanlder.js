//提供各种请求的处理方法

// 引入模块
const fs = require("fs");
const path = require("path");
const template = require("art-template");
const mime = require("mime");
const  url = require("url");
const queryString = require("querystring");
const tool = require("./tool");
// 引入工具模块

module.exports = {
  showIndex(req,res) {
    //渲染数据并且返回
    tool.readData(data => {
      let str = template(path.join(__dirname,"views","index.html"),data);
      res.end(str);
    })
  },
  showDetails(req,res) {//详情页
    // 要先获取查询的ID
    let id = url.parse(req.url,true).query.id;
    tool.readData(data => {
      let info = data.list.find(v => v.id == id);
      res.end(template(path.join(__dirname,"views","details.html"),info))
    })  
  },
  showSubmit(req,res) {
    //提交页是静态页面，直接读取返回即可
    fs.readFile(path.join(__dirname,"views","submit.html"),(err,data) =>{
      if (err) {
        return console.log(err)
      }
      res.end(data);
    })
  },
  showAssets(req,res) {
    fs.readFile(path.join(__dirname,req.url),(err,data) => {
      if (err) {
        return console.log(err)
      }
      res.setHeader("content-type",mime.getType(data));
      res.end(data);
    })
  },
  addGet(req,res) {
    let info = url.parse(req.url,true).query;
    tool.readData(data => {
      info.id = data.list[data.length -1 ].id + 1;
      data.list.push(info);
      data = JSON.stringify(data);
      tool.writeData(data,() => {
        res.statusCode = 302;
        res.setHeader = ("location","./index");
        res.end;
      })
    })
  },
  addPost(req,res) {
    let str = "";
    req.on("data",(chunk) => {
      str += chunk;
    })
    req.on("end",() =>{
      let info = queryString.parse(str);
      tool.readData(data => {
        info.id = data.list[data.list.length - 1].id +1;
        data.list.push(info);
        data = JSON.stringify(data,null,4);
        tool.writeData(data, ()=>{
          res.statusCode = 302;
          res.setHeader("location","/index");
          res.end();
        })
      })
    })
  },
  show404(req,res) {
    res.end("404");
  }
}