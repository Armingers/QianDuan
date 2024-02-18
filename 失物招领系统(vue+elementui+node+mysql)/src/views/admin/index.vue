<template>
  <div>
    <!-- 用户管理界面主页 -->
    <el-container>
      <el-aside width="300px">
        <div class="aside_top">
          <img style="height: 50px" src="../../assets/logo.png" alt="" />
          <p style="padding-left: 10px; color: #409eff">
            失物招领系统后台管理
          </p>
        </div>
        <el-collapse @change="changeNumber" v-model="activeName" accordion>
          <el-collapse-item title="用户管理" name="1">
            <ul>
              <li><el-button @click="getUserList">获取用户列表</el-button></li>
              <li>
                <el-button @click="reGetUserList">刷新用户列表</el-button>
              </li>
              <li><el-button @click="addUser">增加用户</el-button></li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="失物信息管理" name="2">
            <ul>
              <li>
                <el-button @click="getLostThings">获取失物信息列表</el-button>
              </li>
              <li>
                <el-button @click="reGetLostThings">刷新失物信息列表</el-button>
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="招领信息管理" name="3">
            <ul>
              <li>
                <el-button @click="getFoundThings">获取招领信息列表</el-button>
              </li>
              <li>
                <el-button @click="reGetFoundThings"
                  >刷新招领信息列表</el-button
                >
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="留言板管理" name="4">
            <ul>
              <li>
                <el-button @click="getWordData">获取留言板数据</el-button>
              </li>
              <li>
                <el-button @click="regetWordData">刷新留言板数据</el-button>
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="小标语管理" name="5">
            <ul>
              <li><el-button @click="getTipsData">获取小标语数据</el-button></li>
              <li><el-button @click="regetTipsData">刷新小标语数据</el-button></li>
               <li><el-button @click="addTipsData">增加小标语数据</el-button></li>
            </ul>
          </el-collapse-item>
          
        </el-collapse>
      </el-aside>
      <el-container>
        <el-header
          ><router-link to="/login" @click.native="exit"
            >退出系统</router-link
          ></el-header
        >
        <el-main>
          <slot name="tableShows"></slot>
        </el-main>
        <el-footer>
          <!-- 底部版权信息区域 -->
          <p>
            Copyright &copy; 2022-2023. All Rights Reserved. Armin版权所有
          </p>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: sessionStorage.getItem("activeName"), // 默认显示的侧边功能栏
      tableData: [], // 表格数据
      tableBody: [], // 表格主体数据
      tableHeader: [], // 表格表头数据
    };
  },
  created() {},
  components: {},
  methods: {
    // 获取用户列表
    getUserList() {
      this.$emit("getUserList");
      this.$router.push("/admin/user");
    },
    // 刷新用户列表
    reGetUserList() {
      window.location.reload();
      this.$router.push("/admin/user");
    },
    // 添加用户
    addUser() {
      this.$emit("showDialog", true);
      this.$router.push("/admin/user");
    },
    // 退出系统
    exit() {
      // 退出系统，清除sessionStorage的数据
      sessionStorage.clear();
      // console.log("exit");
      this.$message({
        message: "退出成功",
        type: "success",
      });
    },
    // 获取失物信息列表
    getLostThings() {
      this.$emit("getLostThings");
      this.$router.push("/admin/lost");
    },
    // 刷新失物信息列表
    reGetLostThings() {
      window.location.reload();
      this.$router.push("/admin/lost");
    },
    // 获取招领信息列表
    getFoundThings() {
      this.$emit("getLostThings");
      this.$router.push("/admin/found");
    },
    // 刷新招领信息列表
    reGetFoundThings() {
      window.location.reload();
      this.$router.push("/admin/found");
    },
    // 获取留言板数据
    getWordData() {
      this.$emit("getLostThings");
      this.$router.push("/admin/liveword");
    },
    // 刷新留言板数据
    regetWordData() {
      window.location.reload();
      this.$router.push("/admin/liveword");
    },
    // 获取小标语数据
    getTipsData() {
      this.$emit("getTipsData");
      this.$router.push("/admin/tips");
    },
    // 刷新小标语数据
    regetTipsData() {
      window.location.reload();
      this.$router.push("/admin/tips");
    },
    // 添加小标语数据
    addTipsData() {
      this.$emit("addTipsData", true);
      this.$router.push("/admin/tips");
    },
    // 修改当前模块，用于显示侧边
    changeNumber(){
      // console.log(index);
      sessionStorage.setItem("activeName",this.activeName);
      this.activeName = sessionStorage.getItem("activeName");
    }
  },
};
</script>
<style scoped>
.el-header,
.el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-header {
  text-align: right;
}
.el-header a {
  text-decoration: none;
  color: #409eff;
}

.el-aside {
  background-color: rgb(45, 65, 86);
  color: #333;
  text-align: left;
  height: 100vh;
}
.aside_top {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
  border: none;
}
/deep/ .el-collapse-item__header {
  background-color: rgb(45, 65, 86);
  color: white;
  height: 60px;
  /* border: none; */
}
.el-collapse-item {
  text-indent: 1rem;
}

.el-collapse-item ul {
  list-style-type: none;
  background-color: rgb(31, 45, 61);
}

.el-collapse-item button {
  width: 100%;
  border: none;
  text-align: left;
  margin-left: -1rem;
  background-color: rgb(31, 45, 61);
  color: rgb(162, 177, 194);
  height: 50px;
  border-radius: 0;
}
.el-collapse-item button:hover {
  background-color: rgb(0, 21, 40);
  color: rgb(162, 177, 194);
}
/deep/ .el-collapse-item__content {
  padding: 0;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  height: 550px;
  padding: 0px;
  padding-top: 2px;
}
/deep/ .el-table td,
.el-table th {
  padding: 7px 0px;
}
.pagination {
  margin-top: 20px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.addUserStyle,
.editUserStyle {
  text-align: left;
}
/deep/ .el-dialog__body {
  padding: 10px 20px 0px;
}
/deep/ .el-table .cell {
  padding-left: 50px;
}
</style>