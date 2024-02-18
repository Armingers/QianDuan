// 服务器：使用node+MySQL搭建
const express = require('express');
const mysql = require('mysql');
const fs = require('fs'); //用于访问本地文件系统的功能模块
const app = express(); //用于创建一个Express应用程序实例，该实例可以通过调用各种中间件和路由来处理HTTP请求和响应。
const querystring = require('querystring'); // 将url请求地址后的参数转化为对象，也可以把对象转化为url后的参数，便利程序猿对url的操作。
const cors = require('cors'); // 当浏览器发现一个页面向另一个域名发起了HTTP请求时，会先向该域名发送一个预检请求，询问该域名是否允许该页面发起跨域请求。如果该域名允许该页面发起跨域请求，浏览器才会继续发起实际的跨域请求。
const multiparty = require('multiparty');//可以解析包含文件上传的HTML表单数据，并将其转换为JavaScript对象。
const formidable = require('formidable');

// 阿里云OSS
const oss = require('ali-oss');
const co = require('co');
const bodyParser = require('body-parser');
const multer = require('multer');
const { error, log } = require('console');
const router = express.Router();

// mysql连接
const option = {
  host: 'localhost',
  port: '3310',
  user: 'root',
  password: 'a123456',
  database: 'lostsystem',
  connectionLimit: 20,
};

// 配置oss
var client = new oss({
  region: 'oss-cn-beijing', // 华东2 北京
  accessKeyId: 'LTAI5tMuQboM6baAFiez5BPv',
  accessKeySecret: '369lKjoJau87ETWtYcdICEsF1ccS24 ',
  bucket: 'nanjinggraduationproject',
});

// 设置跨域访问
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  );
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
  })
);

app.use(
  bodyParser.json({
    limit: '50mb',
  })
);

// 设置监听
app.listen(5000, () => {
  console.log('服务器启动……');
});

// 接口处理

// 用户登录
//定义一个POST请求的路由，当前端发送/login请求时，执行相关的逻辑。
app.post('/login', (req, res) => {
  const conn = mysql.createConnection(option); // 打开数据库连接 建一个MySQL数据库连接对象。
  let login = {
    username: req.body.username, // 从前端获取的用户名
    password: req.body.password, // 从前端获取的密码
  };
  // 自定义sql语句：查询用户名和密码匹配的项
  let loginSql = "select * from users where username='" + login.username + "'";
  // 与数据库进行判断
  conn.query(loginSql, (error, result) => {
    if (error) {
      console.log('err message', error);
    }
    if (result == '') {
      // 查询结果为0   查询结果为空,用户不存在
      console.log(result); // []
      res.json({
        code: 0,
        msg: '用户不存在,请先注册',
      });
    } else {
      // 查询结果不为0
      // 判断
      if (result[0].password == login.password) {
        // 用户名和密码都匹配
        console.log('登录成功');
        res.json({
          code: 1,
          msg: '登录成功',
          data: result,
        });
        console.log(
          '当前用户为:' + login.username + '--密码为:' + login.password
        );
      } else {
        console.log('用户名或密码错误');
        res.json({
          code: -1,
          msg: '用户名或密码错误',
        });
      }
    }
  });
  conn.end(); // 断开连接
});

// 用户注册
app.post('/register', (req, res) => {
  const conn = mysql.createConnection(option); // 打开数据库连接
  let register = {
    username: req.body.username,
    password: req.body.password,
  };
  // sql语句：将从前端获取的用户名和密码添加到数据库中
  let registerSQL = `insert into users values('${register.username}','${register.password}')`;
  // console.log(registerSQL);
  conn.query(registerSQL, (err, result) => {
    // console.log(result);
    if (err) {
      console.log(err);
      console.log('当前用户已存在，注册失败');
      res.json({
        code: -1,
        msg: '用户已存在，注册失败',
      });
    } else {
      console.log('注册成功');
      res.json({
        code: 1,
        msg: '注册成功',
      });
    }
  });
  conn.end(); // 断开连接
});

// 修改密码
app.post('/changePassword', (req, res) => {
  const conn = mysql.createConnection(option); //  打开数据库连接
  let change = {
    // 前端传递的值
    username: req.body.username,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  };
  // sql语句：先根据获取的用户名和密码进行验证
  let verifySql =
    'select username,password from users where username=' +
    "'" +
    change.username +
    "'";
  conn.query(verifySql, (error, result) => {
    // 查询用户
    const conn = mysql.createConnection(option); //  打开数据库连接
    if (error) {
      console.log('error message：', error);
    }
    if (result == '') {
      // 用户不存在
      console.log('用户不存在,请先注册');
      res.json({
        code: 0,
        msg: '用户不存在，请先注册',
      });
    } else {
      // 查询到用户，进行密码验证
      if (result[0].password == change.oldPassword) {
        // 密码匹配成功
        console.log('用户名、密码验证成功');
        // 开始进行信息更新
        let changeSql = `update users set password="${change.newPassword}" where username="${change.username}" ;`;
        console.log(changeSql);
        conn.query(changeSql, (err, changeResult) => {
          if (err) {
            console.log('error mssage:', err);
          }
          if (changeResult.affectedRows != 0) {
            console.log('修改成功');
            res.json({
              code: 1,
              msg: '修改成功',
            });
            console.log('数据修改成功');
          }
        });
      } else {
        // 密码不匹配
        console.log('密码错误，请检查后重试');
        res.json({
          code: -1,
          msg: '原密码错误，请检查后重试',
        });
      }
    }
  });
  conn.end(); // 断开连接
});

// 获取失物信息
app.post('/lostTings', (req, res) => {
  const conn = mysql.createConnection(option); // 开启数据库连接
  // 无需前端传参
  // 自定义sql语句
  let lostSql = 'select * from lostThings';
  conn.query(lostSql, (error, result) => {
    // console.log(result);
    if (error) {
      console.log('error message：' + error);
    } else {
      res.json(result); // 将数据发送给前端
      console.log('获取失物信息成功');
    }
  });
  conn.end(); // 断开数据库连接
});

// 获取招领信息
app.post('/foundThings', (req, res) => {
  const conn = mysql.createConnection(option); // 开启数据库连接
  // 无需前端传参
  // 自定义sql语句
  let foundSql = 'select * from foundThings';
  conn.query(foundSql, (error, result) => {
    // console.log(result);
    if (error) {
      console.log('error message：' + error);
    } else {
      res.json(result); // 将数据发送给前端
      console.log('获取招领信息成功');
    }
  });
  conn.end(); // 断开数据库连接
});

// 发布失物启事
app.post('/lostNotice', async (req, res) => {
  try {
    // 前端传递回来的参数
    let lostNotice = {
      username: req.body.username,
      title: req.body.title,
      address: req.body.address,
      contact: req.body.contact,
      remark: req.body.remark,
      lostTime: req.body.time,
    };
    let resultDate = lostNotice.lostTime;
    let year = resultDate.substring(0, 4); // 获取年份
    let month = resultDate.substring(5, 7); // 获取月份
    let day = resultDate.substring(8, 10); // 获取日
    let time = `${year}/${month}/${day}`;

    const filename = `${req.body.imgName}`; // 图片名
    const catalog = `/lostThings/${filename}`;
    /* 此处的catalog指的是上传的文件存储在当前Bucket或Bucket下的指定目录 */
    let OSSresult = await client.put(
      catalog,
      Buffer.from(req.body.imgData, 'base64')
    );
    console.log(OSSresult.url); // 图片在oss中的网络地址
    // 将数据插入到数据库中
    const conn = mysql.createConnection(option);
    // 自定义sql：将失物信息插入到数据库中
    let lostSql = `insert into lostthings values(NULL,'${lostNotice.username}','${lostNotice.title}','${lostNotice.address}','${time}','${OSSresult.url}','${lostNotice.remark}','${lostNotice.contact}',default);`;
    // console.log(lostSql);
    conn.query(lostSql, (error, result) => {
      if (error) {
        console.log('error msg:', error);
      }
      // console.log(result);
      if (result.affectedRows > 0) {
        res.json({
          code: 1,
          msg: '发布失物信息成功',
          imgUrl: OSSresult.url,
        });
        console.log('发布失物信息成功');
      } else {
        res.json({
          code: -1,
          msg: '发布失物信息失败',
        });
      }
    });
    conn.end(); // 断开连接
  } catch (e) {
    console.log(e);
  }
});

// 发布寻物启事
app.post('/foundNotice', async (req, res) => {
  try {
    // 前端传递回来的参数
    let foundNotice = {
      username: req.body.username,
      title: req.body.title,
      address: req.body.address,
      contact: req.body.contact,
      remark: req.body.remark,
      foundTime: req.body.time,
    };
    // 时间
    let resultDate = foundNotice.foundTime;
    let year = resultDate.substring(0, 4); // 获取年份
    let month = resultDate.substring(5, 7); // 获取月份
    let day = resultDate.substring(8, 10); // 获取日
    let time = `${year}/${month}/${day}`;
    console.log(foundNotice.foundTime);
    // console.log(req.body.imgData);
    const filename = `${req.body.imgName}`; // 获取文件名
    const catalog = `/foundThings/${filename}`; // 设置存储路径
    /* 此处的catalog指的是上传的文件存储在当前Bucket或Bucket下的指定目录 */
    let OSSresult = await client.put(
      catalog,
      Buffer.from(req.body.imgData, 'base64')
    );
    console.log(OSSresult.url); // 图片在oss中的网络地址
    // 将数据插入到数据库中
    const conn = mysql.createConnection(option);
    // 自定义sql：将失物信息插入到数据库中
    let lostSql = `insert into foundthings values(NULL,'${foundNotice.username}','${foundNotice.title}','${foundNotice.address}','${foundNotice.foundTime}','${OSSresult.url}','${foundNotice.remark}','${foundNotice.contact}',default);`;
    // console.log(lostSql);
    conn.query(lostSql, (error, result) => {
      if (error) {
        console.log('error msg:', error);
      }
      console.log(result);
      if (result.affectedRows > 0) {
        res.json({
          code: 1,
          msg: '发布招领信息成功',
          imgUrl: OSSresult.url,
        });
        console.log('发布招领信息成功');
      } else {
        res.json({
          code: -1,
          msg: '发布招领信息失败',
        });
      }
    });
    conn.end(); // 断开连接
  } catch (e) {
    console.log(e);
  }
});

// 获取所有用户数据
app.post('/getAllUsers', (req, res) => {
  // 无需传参
  const conn = mysql.createConnection(option); //  打开数据库连接
  let getUsersSql = 'show columns from users;';
  let getUsersInfoSql = 'select * from users';
  let tableHeader = []; // 表头
  let tableBody = []; // 表体
  let tableData = []; // 表格数据
  conn.query(getUsersSql, (error, result) => {
    const conn = mysql.createConnection(option); //  打开数据库连接
    result.forEach(element => {
      let dataElement = {
        label: element.Field,
      };
      tableHeader.push(dataElement); // 表头数据
    });
    conn.query(getUsersInfoSql, (error, result) => {
      // 表体数据
      result.forEach(element => {
        tableBody.push(element);
      });
      tableData = {
        tableHeader: tableHeader,
        tableBody: tableBody,
      };
      // 将查询到的表头和表体数据返回给前端
      res.json({
        tableData,
      });
      console.log('查询用户成功');
    });
  });
  conn.end();
});

// 删除用户按钮接口
app.post('/deleteUser', (req, res) => {
  // 需前端传递用户名
  console.log(req.body);
  let deleteData = {
    username: req.body.username,
  };
  // 删除语句
  let deleteUserSql =
    "delete from users where username ='" + deleteData.username + "';";
  // 开启数据库连接
  const conn = mysql.createConnection(option);
  conn.query(deleteUserSql, (error, result) => {
    if (error) {
      console.log(error);
      res.json({
        code: -1,
        msg: '未知错误，请检查后台代码！',
      });
    } else {
      res.json({
        code: 1,
        msg: '删除成功',
      });
      console.log('删除用户成功');
    }
  });
  conn.end();
});

// 修改用户信息
app.post('/editUserInfo', (req, res) => {
  const conn = mysql.createConnection(option); //  打开数据库连接
  let change = {
    // 前端传递的值
    username: req.body.username,
    oldName: req.body.oldName,
    Password: req.body.oldPassword,
  };
  // sql语句：先根据获取的用户名和密码进行验证
  let verifySql =
    'select username,password from users where username=' +
    "'" +
    change.oldName +
    "'";
  conn.query(verifySql, (error, result) => {
    // 查询用户
    // console.log(result);
    const conn = mysql.createConnection(option); //  打开数据库连接
    if (error) {
      console.log('error message：', error);
    }
    if (result == '') {
      // 用户不存在
      console.log('用户不存在,请先注册');
      res.json({
        code: 0,
        msg: '用户不存在，请先注册',
      });
    } else {
      // 查询到用户，进行数据修改
      console.log('开始进行数据修改');
      // 开始进行信息更新
      let changeSql = `update users set password='${change.Password}',username='${change.username}' where username="${change.oldName}";`;
      // let changeSql = "update users set password=" + "'" + change.newPassword + "'" + "where username=" + "'" + change.oldName + "'";
      conn.query(changeSql, (err, changeResult) => {
        if (err) {
          console.log('error mssage:', err);
        }
        if (changeResult.affectedRows != 0) {
          console.log('修改成功');
          res.json({
            code: 1,
            msg: '修改成功',
          });
          console.log('数据修改成功');
        }
      });
    }
  });
  conn.end(); // 断开连接
});

// 获取所有失物信息
app.post('/getAllLost', (req, res) => {
  // 无需传参
  const conn = mysql.createConnection(option); // 打开数据库连接
  let getLostSql = 'show columns from lostthings;';
  let getLostInfoSql = 'select *  from lostthings;';
  let tableHeader = []; // 表头数据
  let tableBody = []; // 表体数据
  let tableData = []; // 表格数据
  conn.query(getLostSql, (error, result) => {
    result.forEach(element => {
      let dataElement = {
        label: element.Field,
      };
      tableHeader.push(dataElement); // 设置表头数据
    });
    const conn = mysql.createConnection(option); // 打开数据库连接
    conn.query(getLostInfoSql, (error, result) => {
      result.forEach(element => {
        tableBody.push(element); // 表体数据
      });
      tableData = {
        tableHeader: tableHeader,
        tableBody: tableBody,
      };
      res.json({
        tableData,
      });
      console.log('查询失物信息成功');
    });
  });
  conn.end();
});

// 删除失物信息
app.post('/deleteLostInfo', (req, res) => {
  // 根据前端传递的数据编号来进行数据的删除
  // console.log(req.body);
  let deleteData = {
    id: req.body.id,
  };
  // 删除失物信息sql
  let deleteLostInfoSql = `delete from lostthings where id="${deleteData.id}";`;
  const conn = mysql.createConnection(option);
  conn.query(deleteLostInfoSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    // console.log(result);
    if (result.affectedRows > 0) {
      // 删除成功
      console.log('删除失物信息成功');
      res.json({
        code: 1,
        msg: '失物信息删除成功',
      });
    } else {
      // 删除失败
      console.log('删除失物信息失败');
      res.json({
        code: -1,
        msg: '失物信息删除失败，请联系管理员',
      });
    }
  });
  conn.end();
});

// 编辑失物信息
app.post('/editLostInfo', (req, res) => {
  // console.log(req.body);
  // 前端传递：id、title、address、lostTime、imgUrl、remark、contact，根据id来查询数据库然后更新
  let editData = {
    id: req.body.id,
    username: req.body.username,
    title: req.body.title,
    address: req.body.address,
    lostTime: req.body.lostTime,
    imgUrl: req.body.imgUrl,
    remark: req.body.remark,
    contact: req.body.contact,
  };
  const conn = mysql.createConnection(option);
  // 根据传递的id查询数据后进行更新
  let selectSql = `select * from lostthings where id='${editData.id}';`;
  conn.query(selectSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    console.log(result);
    if (result == '') {
      // 数据不存在，请咨询管理员
      res.json({
        code: 0,
        msg: '数据不存在，请咨询管理员',
      });
    } else {
      // 查询成功，进行数据更新
      // 编写更新SQL语句
      let updateSql = ``;
      const conn = mysql.createConnection(option); // 再开启一次连接
      conn.query(updateSql, (error, result) => {
        if (error) {
          console.log('error msg：', error);
        }
        if (result.affectedRows > 0) {
          // 修改成功
          res.json({
            code: 1,
            msg: '编辑失物信息成功',
          });
        } else {
          // 修改成功
          res.json({
            code: -1,
            msg: '编辑失物信息失败',
          });
        }
      });
    }
  });
  conn.end();
});

// 获取所有招领信息
app.post('/getAllFound', (req, res) => {
  // 无需传参
  const conn = mysql.createConnection(option); // 打开数据库连接
  let getFoundSql = 'show columns from foundthings;';
  let getFoundInfoSql = 'select *  from foundthings;';
  let tableHeader = []; // 表头数据
  let tableBody = []; // 表体数据
  let tableData = []; // 表格数据
  conn.query(getFoundSql, (error, result) => {
    result.forEach(element => {
      let dataElement = {
        label: element.Field,
      };
      tableHeader.push(dataElement); // 设置表头数据
    });
    const conn = mysql.createConnection(option); // 打开数据库连接
    conn.query(getFoundInfoSql, (error, result) => {
      result.forEach(element => {
        tableBody.push(element); // 表体数据
      });
      tableData = {
        tableHeader: tableHeader,
        tableBody: tableBody,
      };
      res.json({
        tableData,
      });
      console.log('查询招领信息成功');
    });
  });
  conn.end();
});

// 删除招领信息
app.post('/deleteFoundInfo', (req, res) => {
  // 根据前端传递的数据编号来进行数据的删除
  console.log(req.body);
  let deleteData = {
    id: req.body.id,
  };
  // 删除失物信息sql
  let deleteFoundInfoSql = `delete from foundthings where id="${deleteData.id}";`;
  const conn = mysql.createConnection(option);
  conn.query(deleteFoundInfoSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    // console.log(result);
    if (result.affectedRows > 0) {
      // 删除成功
      console.log('删除招领信息成功');
      res.json({
        code: 1,
        msg: '招领信息删除成功',
      });
    } else {
      // 删除失败
      console.log('删除招领信息失败');
      res.json({
        code: -1,
        msg: '招领信息失败，请联系管理员',
      });
    }
  });
  conn.end();
});

// 编辑招领信息
app.post('/editFoundInfo', (req, res) => {
  // console.log(req.body);
  // 前端传递：id、title、address、lostTime、imgUrl、remark、contact，根据id来查询数据库然后更新
  let editData = {
    id: req.body.id,
    title: req.body.title,
    address: req.body.address,
    foundTime: req.body.foundTime,
    imgUrl: req.body.imgUrl,
    remark: req.body.remark,
    contact: req.body.contact,
  };
  const conn = mysql.createConnection(option);
  // 根据传递的id查询数据后进行更新
  let selectSql = `select * from foundthings where id='${editData.id}';`;
  conn.query(selectSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    if (result == '') {
      // 数据不存在，请咨询管理员
      res.json({
        code: 0,
        msg: '数据不存在，请咨询管理员',
      });
    } else {
      // 查询成功，进行数据更新
      // 编写更新SQL语句
      let updateSql = `update foundthings set title='${editData.title}',address='${editData.address}',foundTime='${editData.foundTime}',imgUrl='${editData.imgUrl}',remark='${editData.remark}',contact='${editData.contact}' where id='${editData.id}'`;
      const conn = mysql.createConnection(option); // 再开启一次连接
      conn.query(updateSql, (error, result) => {
        if (error) {
          console.log('error msg：', error);
        }
        if (result.affectedRows > 0) {
          // 修改成功
          res.json({
            code: 1,
            msg: '编辑招领信息成功',
          });
          console.log('编辑招领信息成功');
        } else {
          // 修改成功
          res.json({
            code: -1,
            msg: '编辑招领信息失败',
          });
        }
      });
    }
  });
  conn.end();
});

// 发布留言
app.post('/addLiveWord', (req, res) => {
  // 接收前端传递的：用户名、留言信息、时间
  let getData = {
    username: req.body.username,
    msg: req.body.msg,
    systemTime: req.body.systemTime,
  };
  // console.log(req.body);
  // sql语句：将数据填写到数据中
  let addLiveSql = `insert into livemsg values(NULL,"${getData.username}","${getData.msg}","${getData.systemTime}")`;
  const conn = mysql.createConnection(option);
  conn.query(addLiveSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    // console.log(result);
    if (result.affectedRows > 0) {
      // 发布成功
      res.json({
        code: 1,
        msg: '留言信息发布成功',
      });
    } else {
      // 发布失败
      res.json({
        code: -1,
        msg: '留言信息发布失败',
      });
    }
  });
  conn.end();
});

// 获取所有留言数据接口
app.post('/getAllLiveWord', (req, res) => {
  // 无需传递参数
  // 查询SQL语句
  let getAllWordSql = `select * from livemsg`;
  const conn = mysql.createConnection(option);
  conn.query(getAllWordSql, (error, result) => {
    if (error) {
      console.log('error msg；', error);
    } else {
      res.json(result); // 将查询到的留言板全部返回前端
      console.log('查询留言板信息成功');
    }
  });
});

// 删除留言板数据
app.post('/deleteLiveWordData', (req, res) => {
  // 根据前端传递的数据编号来进行数据的删除
  console.log(req.body);
  let deleteData = {
    id: req.body.id,
  };
  // 删除失物信息sql
  let deleteLiveInfoSql = `delete from livemsg where id="${deleteData.id}";`;
  const conn = mysql.createConnection(option);
  conn.query(deleteLiveInfoSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    // console.log(result);
    if (result.affectedRows > 0) {
      // 删除成功
      console.log('删除留言板信息成功');
      res.json({
        code: 1,
        msg: '留言板信息删除成功',
      });
    } else {
      // 删除失败
      console.log('删除留言板信息失败');
      res.json({
        code: -1,
        msg: '留言板信息失败，请联系管理员',
      });
    }
  });
  conn.end();
});

// 编辑留言板数据
app.post('/editLiveWordData', (req, res) => {
  // console.log(req.body);
  // 前端传递：id、title、address、lostTime、imgUrl、remark、contact，根据id来查询数据库然后更新
  let editData = {
    id: req.body.id,
    username: req.body.username,
    msg: req.body.msg,
    livetime: req.body.livetime,
  };
  console.log(editData);
  const conn = mysql.createConnection(option);
  // // 根据传递的id查询数据后进行更新
  let selectSql = `select * from livemsg where id='${editData.id}';`;
  conn.query(selectSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    if (result == '') {
      // 数据不存在，请咨询管理员
      res.json({
        code: 0,
        msg: '数据不存在，请咨询管理员',
      });
    } else {
      // 查询成功，进行数据更新
      // 编写更新SQL语句
      let updateSql = `update livemsg set username='${editData.username}',msg='${editData.msg}',livetime='${editData.livetime}' where id='${editData.id}';`;
      const conn = mysql.createConnection(option); // 再开启一次连接
      conn.query(updateSql, (error, result) => {
        if (error) {
          console.log('error msg：', error);
        }
        // console.log(result);
        if (result.affectedRows > 0) {
          // 修改成功
          res.json({
            code: 1,
            msg: '编辑留言板信息成功',
          });
          console.log('编辑留言板信息成功');
        } else {
          // 修改成功
          res.json({
            code: -1,
            msg: '编辑留言板信息失败',
          });
        }
      });
    }
  });
  conn.end();
});

// 模糊查询
app.post('/searchId', (req, res) => {
  // 需要前端传递要查询的关键字，后台根据关键字对标题进行 模糊查询
  let keyWord = {
    key: req.body.key, // 关键词
  };
  // 模糊查询Sql
  let searchLostSql = `select * from lostthings where title like '%${keyWord.key}%'`;
  let searchFoundSql = `select * from foundthings where title like '%${keyWord.key}%'`;
  const conn = mysql.createConnection(option);
  conn.query(searchLostSql, (error, result) => {
    // 对失物表进行模糊查询
    if (error) {
      console.log('error1 msg：', error);
    }
    // console.log(result);
    if (result == '') {
      console.log('无失物信息，开始查询招领信息');
      const conn = mysql.createConnection(option);
      conn.query(searchFoundSql, (err, result2) => {
        // 招领数据
        if (error) {
          console.log('error2 msg：', err);
        }
        if (result2 == '') {
          res.json({
            msg: '无失物信息，无招领信息',
            code: -1,
          });
          console.log('无失物信息，无招领信息');
        } else {
          // 无失物信息，有招领信息
          // finalData.push(result2);
          console.log('无失物信息，有招领信息');
          res.json({
            msg: '无失物信息，有招领信息',
            foundData: result2,
            code: 0,
          });
        }
      });
    } else {
      console.log('有失物信息，开始查询招领信息');
      const conn = mysql.createConnection(option);
      conn.query(searchFoundSql, (err, result2) => {
        // 查询招领数据
        if (error) {
          console.log('error2 msg：', err);
        }
        if (result2 == '') {
          console.log('有失物信息，无招领信息');
          res.json({
            msg: '有失物信息，无招领信息',
            lostData: result,
            code: 1,
          });
        } else {
          console.log('有失物信息，有招领信息');
          res.json({
            msg: '有失物信息，有招领信息',
            lostData: result,
            foundData: result2,
            code: 2,
          });
        }
      });
    }
  });
  conn.end();
});

// 获取所有tips
app.post('/getAllTips', (req, res) => {
  // 无需传参
  let allTipsSql = `select * from tips`;
  const conn = mysql.createConnection(option);
  conn.query(allTipsSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    } else {
      res.json(result);
      console.log('获取小标语成功');
    }
  });
  conn.end();
});

// 增加小标语
app.post('/addTips', (req, res) => {
  // 需要前端传递新增的小标语
  let tips_data = {
    tips: req.body.tips_msg,
  };
  console.log(tips_data);
  let addTipsSql = `insert into tips values(NULL,'${tips_data.tips}');`;
  const conn = mysql.createConnection(option);
  conn.query(addTipsSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    if (result.affectedRows > 0) {
      res.json({
        code: 1,
        msg: '添加小标语成功',
      });
      console.log('添加小标语成功');
    } else {
      res.json({
        code: -1,
        msg: '添加小标语失败',
      });
    }
  });
  conn.end();
});

// 删除小标语
app.post('/deleteTips', (req, res) => {
  // 需要前端le't
  let id = req.body.id;
  // console.log(id);
  let deleteTipsSql = `delete from tips where id = '${id}'`;
  const conn = mysql.createConnection(option);
  conn.query(deleteTipsSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    if (result.affectedRows > 0) {
      res.json({
        code: 1,
        msg: '删除小标语成功',
      });
      console.log('删除小标语成功');
    } else {
      res.json({
        code: -1,
        msg: '删除小标语失败',
      });
    }
  });
  conn.end();
});

// 编辑小标语
app.post('/editTips', (req, res) => {
  // 需要前端传递id，改变后的标语
  let editData = {
    id: req.body.id,
    tips: req.body.tips_msg,
  };
  // console.log(editData);
  let editTipsSql = `update tips set tips_msg='${editData.tips}' where id='${editData.id}';`;
  const conn = mysql.createConnection(option);
  conn.query(editTipsSql, (error, result) => {
    if (error) {
      console.log('error msg：', error);
    }
    if (result.affectedRows > 0) {
      res.json({
        code: 1,
        msg: '编辑小标语成功',
      });
      console.log('编辑小标语成功');
    } else {
      res.json({
        code: -1,
        msg: '编辑小标语失败',
      });
    }
  });
  conn.end();
});

// 获取招领信息的条数
app.post('/getFoundLength', (req, res) => {
  let sql = `select count(id) as length from foundthings`;
  const conn = mysql.createConnection(option);
  conn.query(sql, (error, result) => {
    if (error) {
      console.log('get length error：', error);
    } else {
      res.json({
        lenth: result[0].length,
      });
    }
  });
  conn.end();
});

// 获取指定用户的失物信息
app.post('/getUserLost', (req, res) => {
  let data = {
    username: req.body.username,
  };
  let sql = `select * from lostthings where username = '${data.username}';`;
  // console.log(sql);
  const conn = mysql.createConnection(option);
  conn.query(sql, (error, result) => {
    if (error) {
      console.log('get info error：', error);
    } else {
      if (result == '') {
        res.json({
          code: -1,
          msg: '无数据',
        });
      } else {
        res.json({
          code: 1,
          msg: '查询成功',
          data: result,
        });
      }
    }
  });
  conn.end();
});

// 获取指定用户的招领信息
app.post('/getUserFound', (req, res) => {
  let data = {
    username: req.body.username,
  };
  let sql = `select * from foundthings where username = '${data.username}';`;
  // console.log(sql);
  const conn = mysql.createConnection(option);
  conn.query(sql, (error, result) => {
    if (error) {
      console.log('get info error：', error);
    } else {
      if (result == '') {
        res.json({
          code: -1,
          msg: '无数据',
        });
      } else {
        res.json({
          code: 1,
          msg: '查询成功',
          data: result,
        });
      }
    }
  });
  conn.end();
});

// 更改失物、招领状态
app.post('/changeStatus', (req, res) => {
  // 获取编号
  let data = {
    id: req.body.id,
  };
  // 分为失物、招领两种
  let lostSql = `update lostthings set status ='已找回' where id='${data.id}';`;
  let foundSql = `update foundthings set status ='已归还' where id='${data.id}';`;
  let sql;
  if (req.body.type == 'lost') {
    sql = lostSql;
  } else {
    sql = foundSql;
  }
  // console.log(sql);
  const conn = mysql.createConnection(option);
  conn.query(sql, (error, result) => {
    if (error) {
      console.log('status change error：', error);
    } else {
      if (result.affectedRows > 0) {
        res.json({
          code: 1,
          msg: '状态修改成功',
        });
      } else {
        res.json({
          code: -1,
          msg: '状态修改失败',
        });
      }
    }
  });
  conn.end();
});

// 文件上传接口->将文件存储到OSS或服务器本地
// 使用了multer.diskStorage方法创建了一个storage对象，用于设置文件上传的相关参数
const storage = multer.diskStorage({
  // destination属性用于设置文件存储的路径，这里使用了async/await语法，
  // 读取了上传的文件内容并使用阿里云OSS SDK将文件存储到OSS中，最后返回了文件的网络地址
  destination: async (req, file, fl) => {
    fl(null, './upload'); // 文件存储路径
    // 使用fs模块读取文件后写入OSS中
    let datas = fs.readFileSync(`./upload/${file.originalname}`);
    console.log(datas);
    const catalog = `/foundThings/${file.originalname}`; // 设置存储路径
    let OSSresult = await client.put(catalog, Buffer.from(datas, 'base64'));
    console.log(OSSresult.url); // 图片网络地址
  },
  filename: (req, file, fl) => {
    console.log(file);
    let fileFormat = file.originalname.split('.');
    fl(file.originalname);
  },
});
// 使用了multer方法创建了一个upload对象，将storage对象作为参数传递进去，用于配置文件上传的相关参数。
let upload = multer({
  storage: storage,
});
// 上传接口
app.post(
  '/uploadFile',
  upload.single('myfile', (req, res, next) => {
    res.json({});
  })
);
