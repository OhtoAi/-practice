// 对外提供各个 公共 工具函数
const fs = require("fs");
const path = require('path');


module.exports = {
  //用封装提高代码的复用性
  //读取data.json数据的方法
  readData(callback) {
    fs.readFile(path.join(__dirname,"data","data.json"),"utf-8",(err,data) => {
      if (err) {
        return console.log(err) 
      }
      data = JSON.parse(data);
      callback && callback(data);
    });
  },
  // 写入data数据的方法
  writeData(data,fn) {
    fs.writeFile(path.join(__dirname,"data","data.json"),data,"utf-8",(err) => {
      if (err) {
        return console.log(err);
      }
      fn && fn();
    })
  }
}