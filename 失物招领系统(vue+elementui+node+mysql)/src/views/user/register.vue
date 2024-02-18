<template>
  <div class="main">
    <!-- 用户注册 -->
    <div class="fromStyle">
      <div class="inner">
        <el-form ref="form" :model="registerData" label-width="70px"
          ><h2 style="margin-bottom:30px">用户注册</h2>
          <el-form-item label="用户名">
            <el-input
              placeholder="请输入用户名"
              suffix-icon="el-icon-user"
              v-model="registerData.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              placeholder="请输入密码"
              type="password"
              show-password
              v-model="registerData.password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input
              placeholder="请再次输入密码"
              @keydown.enter.native="register"
              type="password"
              show-password
              v-model="registerData.rewritePassword"
            ></el-input>
          </el-form-item>
          <el-form-item style="float:right;margin:0">
            <el-button @click="goLogin" type="text">已有账户？</el-button>
            <el-button @click="register" type="primary">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { Register } from '@/api/api'
export default {
  data() {
    return {
      registerData: {
        username: '',
        password: '',
        rewritePassword: '' // 确认密码
      }
    }
  },
  methods: {
    register() {
      //  先判断密码和确认密码是否一致
      if (
        this.registerData.username == '' ||
        this.registerData.password == ''
      ) {
        this.$message({
          message: '请输入正确信息',
          type: 'warning'
        })
      } else if (
        this.registerData.password != this.registerData.rewritePassword
      ) {
        this.$message({
          message: '两次密码不一致，请检查后重新输入',
          type: 'warning'
        })
      } else {
        // 信息无误后，调用接口
        Register(this.registerData).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '注册成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '用户已存在，请前往登录',
              type: 'warning'
            })
          }
          this.$router.push('/login')
        })
      }
    },
    goLogin() {
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped>
.main {
  height: 100vh;
  background: url(../../assets/login/test3.jpg);
  display: flex;
  justify-content: center;
  align-items: center;
}
.fromStyle {
  width: 550px;
  height: 350px;
  background-color: rgb(31, 46, 65);
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inner {
  width: 500px;
  color: white;
}
</style>
<style>
.inner .el-form-item__label {
  color: white;
}
</style>
