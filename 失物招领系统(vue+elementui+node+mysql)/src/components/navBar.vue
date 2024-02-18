<!-- 导航条子组件 -->
<template>
  <div>
    <div id="head">
      <div class="head_top">
        <div
          style="display: inline-block; float: left; padding-left: 20px"
          class="tips"
        >
          <span style="color: white; line-height: 40px">
            Tips：<span v-text="tips"></span
          ></span>
        </div>
        <div class="loginRegister">
          <div v-if="unLogin">
            <span class="cl">你好，请先登录！</span>
            <router-link style="color: white" to="/login">登录</router-link>
            <router-link style="color: white" to="/register">注册</router-link>
          </div>
          <div v-if="isLogin">
            <el-dropdown>
              <span class="el-dropdown-link">
                <span
                  style="margin-left: 10px; color: white"
                  v-text="username"
                ></span
                ><i
                  style="color: white"
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changePassword"
                  >修改密码</el-dropdown-item
                >
                <el-dropdown-item @click.native="showLostList"
                  >查看失物记录</el-dropdown-item
                >
                <el-dropdown-item @click.native="showFoundList"
                  >查看招领记录</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <span class="c2">当前用户为： <span v-text="user"></span> </span> -->
            <span style="margin-left: 20px"
              ><router-link
                @click.native="exit"
                style="color: white"
                to="/login"
                >退出登录</router-link
              ></span
            >
          </div>
        </div>
      </div>
      <div class="head_center">
        <!-- 两张图片 -->
        <div class="top_center_img">
          <a href="#"
            ><img class="logo" src="../assets/navbarImg/logo.png" alt=""
          /></a>
          <img
            style="height: 80px; float: right; margin-top: 40px"
            src="../assets/navbarImg/hed.png"
            alt=""
          />
        </div>
      </div>
      <!-- 导航条 -->
      <div class="nav">
        <div class="nav_position">
          <ul>
            <li id="1"><router-link to="/index">网站首页</router-link></li>
            <li id="2"><router-link to="/searchGoods">寻物</router-link></li>
            <li id="3"><router-link to="/getGoods">招领</router-link></li>
            <li id="4">
              <router-link to="/messageBoard">留言板</router-link>
            </li>
            <li id="5"><router-link to="/upload">发布</router-link></li>
          </ul>
          <el-form
            class="searchStyle"
            style="display: inline-block; float: right"
            ref="form"
            :model="searchData"
            label-width="80px"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input
                placeholder="请输入要搜索的物品"
                v-model="searchData.search"
                @keyup.enter.native="searchThings"
                ><el-button
                  style="width: 60px"
                  slot="append"
                  icon="el-icon-search"
                  @click="searchThings"
                ></el-button
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 查看失物记录 -->
    <el-dialog
      style="text-align: left"
      title="我的失物记录"
      :visible.sync="lostList"
      width="800px"
    >
      <el-table :data="lostTableData" style="width: 100%">
        <el-table-column prop="lostTime" label="丢失日期" width="140">
        </el-table-column>
        <el-table-column prop="title" label="丢失物品" width="140">
        </el-table-column>
        <el-table-column prop="address" label="大致地点" width="200">
        </el-table-column>
        <el-table-column prop="status" label="是否找回" width="140">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="isBack(scope.row.id)"
              >已找回?</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 查看招领记录 -->
    <el-dialog
      style="text-align: left"
      title="我的招领记录"
      :visible.sync="foundList"
      width="800px"
    >
      <el-table :data="foundTableData" style="width: 100%">
        <el-table-column prop="foundTime" label="拾到日期" width="140">
        </el-table-column>
        <el-table-column prop="title" label="拾到物品" width="140">
        </el-table-column>
        <el-table-column prop="address" label="大致地点" width="200">
        </el-table-column>
        <el-table-column prop="status" label="是否归还" width="140">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="isReturn(scope.row.id)"
              >已归还?</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { GetUserLost, GetUserFound, ChangeStatus, GetAllTips } from '@/api/api'
export default {
  name: 'navBar',
  props: {
    pages: {
      default: 1, // 控制底部显示，值从父组件传递过来
      type: Number
    }
  },
  data() {
    return {
      searchData: {
        search: ''
      },
      tips: '志当存高远。',
      unLogin: true,
      isLogin: false,
      user: '',
      activeName: sessionStorage.getItem('navActiveName'),
      username: sessionStorage.getItem('username'),
      lostList: false,
      foundList: false,
      lostTableData: [],
      foundTableData: [],
      type: 'lost' // 默认类型为失物
    }
  },
  created() {
    // 查询是否登录
    this.loginOrNot()
    // 调用接口，获取tips
    let tipsArry = []//定义一个空数组，用于存储从服务器端获取的所有小贴士。
    GetAllTips().then((res) => {
      res.data.forEach((element) => {
        tipsArry.push(element)
      })
      let num = Math.floor(res.data.length * Math.random())
      this.tips = tipsArry[num].tips_msg
    })
  },
  mounted() {
    // console.log(this.pages);
    let styleCss = '2px solid #409EFF'
    let index = document.getElementById('1') // 1
    let search = document.getElementById('2') // 2
    let get = document.getElementById('3') // 3
    let msg = document.getElementById('4') // 3
    let upload = document.getElementById('5') // 3
    switch (this.pages) {
      case 1: {
        index.style.borderBottom = styleCss
        break
      }
      case 2: {
        search.style.borderBottom = styleCss
        break
      }
      case 3: {
        get.style.borderBottom = styleCss
        break
      }
      case 4: {
        msg.style.borderBottom = styleCss
        break
      }
      case 5: {
        upload.style.borderBottom = styleCss
        break
      }
    }
  },
  methods: {
    // 查询sessionStorage中是否有登录信息
    loginOrNot() {
      // console.log(sessionStorage.getItem("username"));
      if (sessionStorage.getItem('username')) {
        // 管理员登录
        if (sessionStorage.getItem('username') == 'admin') {
          // 跳转到系统管理员界面
          this.$router.push('/admin')
        } else {
          // 普通用户登录
          // console.log("用户" + sessionStorage.getItem("username") + "已经登录");
          this.user = sessionStorage.getItem('username')
          this.unLogin = false
          this.isLogin = true
        }
      }
    },
    exit() {
      // 退出系统，清除sessionStorage的数据
      sessionStorage.clear()
      // console.log("exit");
      this.$message({
        message: '退出成功',
        type: 'success'
      })
    },
    // 查询按钮事件
    searchThings() {
      if (this.searchData.search) {
        this.$message({
          message: '查询成功',
          type: 'success'
        })
        this.$emit('dataSend')
        sessionStorage.setItem('searchTitle', this.searchData.search) // 将用户查询的数据写入sessionStorage中
        this.$router.push('/search')
        clearTimeout(t)
        let t = setTimeout(() => {
          window.location.reload() // 刷新页面，使数据更新
        }, 100)
      } else {
        this.$message({
          message: '请输入内容后再查询',
          type: 'warning'
        })
      }
    },
    showLostList() {
      // 查看丢失记录
      this.lostList = true
      let send = {
        username: sessionStorage.getItem('username')
      }
      GetUserLost(send).then((res) => {
        this.lostTableData = res.data.data
      })
    },
    showFoundList() {
      // 查看拾到记录
      this.foundList = true
      let send = {
        username: sessionStorage.getItem('username')
      }
      GetUserFound(send).then((res) => {
        this.foundTableData = res.data.data
      })
    },
    isBack(id) {
      // console.log(id);
      this.type = 'lost'
      this.changeStatus(id)
    },
    isReturn(id) {
      // console.log(id);
      this.type = 'found'
      this.changeStatus(id)
    },
    changeStatus(id) {
      let send = {
        id: id,
        type: this.type
      }
      ChangeStatus(send).then((res) => {
        if (res.data.code == '1') {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
          clearTimeout(t)
          let t = setTimeout(() => {
            window.location.reload()
          }, 500)
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    changePassword() {
      this.$router.push('/forget')
    }
  }
}
</script>
<style scoped>
/* * {
  margin: 0;
  padding: 0;
} */

#head {
  width: 100%;
  height: 228px;
}
.head_top {
  /* width: 100%; */
  height: 42px;
  background-color: #580304;
  
}
.loginRegister {
  display: flex;
  line-height: 40px;
  float: right;
  margin-right: 50px;
}
.loginRegister a {
  text-decoration: none;
  margin-left: 15px;
}
.head_center {
  width: 100%;
  height: 133px;
  background-color: #760002;
  overflow: hidden;
}
.top_center_img {
  width: 80%;
  height: 133px;
  margin-left: 10%;
  float: left;
  overflow: hidden;
}
.logo {
  width: 300px;
  float: left;
  margin-top: 16px;
  /* margin: 0 auto; */
}
.nav {
  height: 55px;
  background-color: #910001;
  overflow: hidden;
}
.nav_position {
  height: 55px;
  margin-left: 20px;
}
.nav_position li {
  list-style: none;
  float: left;
  padding-top: 15px;
  width: 80px;
  height: 30px;
  margin-left: 45px;
}
.nav_position a {
  font-size: 16px;
  text-decoration: none;
  color: #ffffff;
}
.nav_position a:hover {
  color: gold;
  cursor: pointer;
}

.searchStyle {
  height: 55px;
  padding-top: 7px;
  padding-right: 100px;
}
.cl {
  color: #8d8d8d;
}
.c2 {
  color: #e7e7e7;
}
.tabs {
  display: inline-block;
  float: left;
}
/deep/ .el-tabs__item {
  color: white;
  text-align: center;
  width: 150px;
  font-size: 16px;
  height: 49px;
}
/deep/ .el-tabs__item:hover {
  color: gold;
  cursor: pointer;
}
</style>
