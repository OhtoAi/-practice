const http = require("http");
const fs = require("fs");
const path = require("path");
const template = require("art-template");
const mime = require("mime");
const url = require("url");
const queryString = require("querystring");


const server = http.createServer();

//绑定事件处理请求
// 根据不同请求，返回对应页面， （页面的数据都是动态渲染的）
server.on("request", (req, res) => {
  // 首页
  if (req.url.startsWith("/index") || req.url == "/") {
    fs.readFile(path.join(__dirname, "data", "data.json"), "utf-8", (err, data) => {
      if (err) {
        return console.log(err)
      }
      data = JSON.parse(data); //转成对象
      //把数据和模板进行绑定
      let str = template(path.join(__dirname, "views", "index.html"), data);
      res.end(str);
      // 通知服务器，所有响应头和响应主体都已被发送，即服务器将其视为已完成。
    })
    // 请求静态资源，直接读取并返回即可
  } else if (req.url.startsWith("/assets")) {
    fs.readFile(path.join(__dirname, req.url), (err, data) => {
      if (err) {
        return console.log(err)
      }
      //设置响应头信息， 比如content-type
      res.setHeader("content-type", mime.getType(data));
      res.end(data);
    })
  } else if (req.url.startsWith("/details")) {
    // 1 - 获取前端传递id， 
    // 2 - 根据id去数据库中查找对应的数据再返回
    id = url.parse(req.url, true).query.id;
    // console.log(url.parse(req.url, true).query);
    fs.readFile(path.join(__dirname, "data", "data.json"), "utf-8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      data = JSON.parse(data);
      // 获取id对应的那个数据 
      // data.list.find(function (v) {
      //     return v.id == id;
      // })
      let info = data.list.find(v => v.id == id);
      let str = template(path.join(__dirname, "views", "details.html"), info);
      res.end(str);
    })
  } else if (req.url.startsWith("/submit")) {
    // 提交页面
    fs.readFile(path.join(__dirname, "views", "submit.html"), (err, data) => {
      if (err) {
        return console.log(err)
      }
      res.end(data);
    });
  } else if (req.url.startsWith("/add") && req.method == "GET") {
    // 1- 获取前端传递的新数据
    // 2- 把数据添加到数据库中
    //    先读取json数据 
    //    转出数组，向数组中添加
    //    转回json，写入到data.json中 
    // 3- 重新渲染首页
    let info = url.parse(req.url, true).query;
    console.log(info);
    fs.readFile(path.join(__dirname, "data", "data.json"), "utf-8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      data = JSON.parse(data);
      let id = 1; //设置默认值，防止数组为空
      if (data.list.length > 0) {
        id = data.list[data.list.length - 1].id + 1;
        //新添加的这一项的ID要比原来数组最后一项的id+1
      }
      info.id = id;
      data.list.push(info);
      data = JSON.stringify(data, null, 4);
      fs.writeFile(path.join(__dirname, "data", "data.json"),data, "utf-8", (err) => {
        if (err) {
          return console.log(err)
        }
        res.statusCode = 302;
        res.setHeader("location", "./index");
        res.end();
      });
    })
  } else if (req.url.startsWith('/add') && req.method=="POST" ) {  // post 添加 
    // 获取post提交的数据  chunk 块 ，片段 
    // post传递的数据量比较大，要把数据分成很多个片段来传递， 用事件进行监听，不同接受传递的数据
    let str = '';
    let num = 0;
    req.on('data', (chunk) => {
        str += chunk;
        // console.log(++num);            
    })
   
    //当后台看到结束标志后，会触发end事件 
    req.on('end', () => {
        //在end事件中可以使用完整的数据了 
        // title=aa&url=cc&text=dd
        console.log(str);       
        let info = queryString.parse(str); 
        console.log(info);
        // 获取数据全部数据
        fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf-8', (err, data) => {
            if (err) {
                return console.log(err);                    
            }
            data = JSON.parse(data); //转对象
            //给新数据加id
            let id = 1;
            if (data.list.length > 0) {
                id = data.list[data.list.length - 1].id + 1;
            }
            info.id = id; 
            data.list.push(info); //追加 
            //写入到data.json中 
            data = JSON.stringify(data, null, 4);
            fs.writeFile(path.join(__dirname, 'data', 'data.json'), data, 'utf-8', (err) => {
                if (err) {
                    return console.log(err);                        
                }
                //跳转到首页
                res.statusCode = 302; 
                res.setHeader('location', '/index');
                res.end();
            })
        })
        

    })

} else if (req.url.startsWith("/add") && req.method == "POST") {
  let str = "";
  req.on("data",(chunk) => {
    str += chunk;
  });
  req.on(end,() => {
    let info = queryString.parse(str);
  })
  fs.readFile(path.join(__dirname,"data","data.json"),"utf-8",(err,data) => {
    if (err) {
      return console.log(err)
    }
    data = JSON.parse(data);
    let id = 1;
    if (data.list.length > 0) {
      id = data.list[data.list.length -1].id + 1;
    }
    info.id = id;
    data.list.push(info);
    data = JSON.stringify(data);
    fs.writeFile(path.join(__dirname,"data","data.json"),data,"utf-8",(err) => {
      res.statusCode = 302;
      res.setHeader("location","index");
      res.end();
    })
  })
}
});

server.listen(9999, () => console.log('http://localhost:9999 服务器已启动'));
