<template>
  <div>
    <!-- 留言板 -->
    <nav-bar :pages="4"></nav-bar>
    <div class="main">
      <div class="inner">
        <div class="title">
          <h1 style="text-align: left">留言板</h1>
        </div>
        <p style="padding-top: 6px; font-size: 13px">
          每一个普通人的善良聚集在一起，就是最温暖的光芒。
        </p>
        <!-- <p>在这可以留下您的留言、意见或者其他想说的话。</p> -->
        <div class="msg">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="想说些什么呢？0v 0"
            v-model="msg"
            resize="none"
          ></el-input>
          <el-button type="primary" @click="sendWord">提交留言</el-button>
        </div>
        <div class="head"></div>
        <div class="liveWord" v-for="(item, index) of showList" :key="index">
          <!-- 昵称、消息区 -->
          <div style="width: 100%">
            <p style="color: #409eff">
              姓名：<span style="color:black" v-text="item.username"></span>
            </p>
            <p style="padding-top:10px;color: #409eff">
              留言内容：<span style="color:black" v-text="item.msg"></span
              ><span style="float:right;" v-text="item.livetime"></span>
            </p>
          </div>
        </div>
        <div class="bottom"></div>
      </div>
    </div>
  </div>
</template>
<script>
import navBar from '@/components/navBar'
import { AddLiveWord, GetAllLiveWord } from '@/api/api'
export default {
  data() {
    return {
      showList: [], // 显示的数据
      msg: '' // 输入框
    }
  },
  methods: {
    // 提交留言功能
    sendWord() {
      // 调用接口，传递当前用户名、系统时间、留言信息
      var date = new Date() 
      var year = date.getFullYear() 
      var month = date.getMonth() + 1 
      var day = date.getDate() 
      var hour = date.getHours() 
      var minute = date.getMinutes() //分
      var second = date.getSeconds() //秒
      let systemTime =
        year +
        '/' +
        month +
        '/' +
        day +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second +
        '' // 格式化时间
      let sendData = {
        username: sessionStorage.getItem('username'), // 存储与session中的用户名
        systemTime: systemTime, // 获取系统时间
        msg: this.msg // 输入框中数据
      }
      // 调用接口，将数据写入数据库中
      if (this.msg != '') {
        AddLiveWord(sendData).then((res) => {
          // console.log(res.data);
          switch (res.data.code) {
            case 1: {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              // alert("111");
              // 页面刷新
              clearTimeout(t)
              let t = setTimeout(() => {
                window.location.reload()
              }, 300)
              break
            }
            case -1: {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
              break
            }
          }
        })
      } else {
        this.$message({
          message: '请输入留言内容',
          type: 'warning'
        })
      }
    },
    getData() {
      GetAllLiveWord().then((res) => {
        this.showList = res.data
      })
    }
  },
  components: {
    navBar
  },
  created() {
    if (sessionStorage.getItem('username')) {
      // console.log("已经登录，可以访问");
      // 数据渲染
      this.getData()
    } else {
      // 未登录，不能访问，跳转到登录页
      this.$confirm('未登录用户不能访问，是否跳转到登录页', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //点击确定的操作(调用接口)
          this.$router.push('/login')
        })
        .catch(() => {
          //几点取消的提示
          this.$router.push('/index')
        })
    }
  }
}
</script>
<style scoped>
.main {
  width: 80%;
  margin-left: 10%;
  padding-top: 20px;
  min-height: 80vh;
  text-align: left;
  background-color: rgb(red, green, blue);
  /* 不设置高度，使高度根据数据条数进行拓展 */
  /* background: transparent; */
}
.title {
  height: 55px;
  border-bottom: 2px solid rgb(218, 217, 217);
}
.msg {
  height: 220px;
  padding-top: 10px;
}
.msg button {
  margin-top: 8px;
  float: right;
}
.liveWord {
  border-bottom: 2px dashed rgb(179, 178, 178);
  padding: 10px 0px;
  line-height: 22px;
  display: flex;
  justify-content: space-between;
}

.username {
  color: #409eff;
}
button {
  cursor: pointer; /* 鼠标经过按钮时，变为手状 */
}
.record {
  padding-top: 8px;
}
.record button {
  margin-top: 8px;
  height: 35px;
  text-align: center;
  float: right;
  margin-left: 5px;
}
.bottom {
  height: 20px;
}
.head {
  height: 5px;
  border-bottom: 2px dashed rgb(179, 178, 178);
}
</style>
