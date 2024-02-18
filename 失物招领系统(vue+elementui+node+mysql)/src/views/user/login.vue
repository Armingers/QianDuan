<template>
  <div class="main">
    <!-- 登录页面 -->
    <div class="login">
      <div class="formStyle">
        <el-form
          class="formNormal"
          ref="form"
          :model="loginData"
          label-width="60px"
          
        >
        <!-- @keydown.enter.native = 'Login'当用户在键盘上按下 "Enter" 键时，执行 login 方法，并且使用原生的 DOM 事件监听方式来绑定事件。 -->
          <h2 style="margin-bottom: 15px; color: white">用户登录</h2>
          <el-form-item style="width: 460px" label="用户名">
            <el-input
              v-model="loginData.username"
              suffix-icon="el-icon-user"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 460px" label="密码">
            <el-input
              type="password"
              @keydown.enter.native="login"
              v-model="loginData.password"
              placeholder="请输入密码"
              show-password
            ></el-input>
            <el-button
              style="float: right; margin-left: 20px"
              @click="goChange"
              type="text"
              >忘记密码?
            </el-button>
          </el-form-item>
          <el-form-item style="margin: 0; float: right">
            <!-- 右对齐并且取消上下边距 -->
            <el-button @click="goRegister" type="text">还没有账户？</el-button>
            <el-button @click="login" m type="primary">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
// 引入了名为Login的api接口
import { Login } from '@/api/api';
// 默认导出一个Vue组件
export default {
  // 一个Vue组件的数据选项，返回一个包含loginData对象的数据对象。
  // data里面是vue组件存放的数据
  data() {
    return {
      loginData: {
        username: '',
        password: '',
      },
    };
  },
  // methods：一个Vue组件的方法选项，包含了login、goChange和goRegister三个方法。
  methods: {
    login() {
      if (this.loginData.username == '' || this.loginData.password == '') {
        // Element UI库中的消息提示组件，向用户展示提示信息。
        this.$message({
          message: '请输入正确登录信息',
          type: 'warning',
        });
      } else {
        // 调用名为Login的api接口，将loginData对象作为参数传递给该接口。
        //一个箭头函数，它的参数是res，函数体是console.log(res)，即在控制台中输出res的值。
        Login(this.loginData).then(res => {
          console.log(res);
          // 判断后端返回的数据中code属性是否等于1，即判断登录是否成功。
          if (res.data.code == 1) {
            // 登录成功
            this.$message({
              message: '登录成功',
              type: 'success',
            });
            // 将登录信息存入sessionStorage中
            sessionStorage.setItem('username', this.loginData.username);
            // 使用Vue Router库中的路由跳转方法，跳转到指定的页面。
            this.$router.push('/index');
          } else if (res.data.code == 0) {
            // alert("用户不存在，请先注册");
            this.$message({
              message: '用户不存在，请先注册',
              type: 'warning',
            });
            this.$router.push('/register');
          } else {
            this.$message({
              message: '用户名或密码错误',
              type: 'error',
            });
          }
        });
      }
    },
    goChange() {
      this.$router.push('/forget');
    },
    goRegister() {
      this.$router.push('/register');
    },
  },
};
</script>
<!-- scoped将组件限制在组件内部 -->
<style scoped>
.main {
  /* 高度为视口高度的 100% */
  height: 100vh;
  background: url(../../assets/login/test2.jpg);
  background-size: cover;
  /* 设置 .main 元素为一个弹性盒子 */
  display: flex;
  /* 将所有子元素沿着主轴（水平方向）、交叉轴（垂直方向）居中对齐。 */
  justify-content: center;
  align-items: center;
}
.login {
  width: 550px;
  height: 350px;
  background-color: rgb(31, 46, 65);
  /* 不透明度为 0.8，使其半透明。 */
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
}
.formStyle {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  /* 当设置为 nowrap 时，子元素不会换行，会尽可能地在同一行中排列。

当设置为 wrap 时，子元素会在容器的同一行排列直到空间不够，然后会自动换行到下一行。

当设置为 wrap-reverse 时，子元素也会自动换行，但是从容器的最后一行开始排列。 */
}
</style>
<style>
/* 选中 .login 元素内所有类名为 .el-form-item__label 的元素为白色 */
.login .el-form-item__label {
  color: white;
}
</style>
