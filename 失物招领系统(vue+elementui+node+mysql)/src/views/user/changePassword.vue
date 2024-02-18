<template>
  <div class="main">
    <!-- 用户注册 -->
    <div class="fromStyle">
      <div class="inner">
        <el-form ref="form" :model="forgetData" label-width="60px"
          ><h2 style="margin-bottom:30px">修改密码</h2>
          <el-form-item label="用户名">
            <el-input
              abled
              suffix-icon="el-icon-user"
              v-model="forgetData.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="原密码">
            <el-input
              show-password
              type="password"
              v-model="forgetData.oldPassword"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input
              show-password
              type="password"
              v-model="forgetData.newPassword"
            ></el-input>
          </el-form-item>
          <el-form-item style="float:right;margin:0">
            <el-button @click="goLogin" type="text">放弃修改？</el-button>
            <el-button @click="changePassword" type="primary">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { ChangePassword } from '@/api/api'
export default {
  data() {
    return {
      forgetData: {
        username: sessionStorage.getItem('username'),
        oldPassword: '', // 旧密码
        newPassword: '' // 新密码
      }
    }
  },
  methods: {
    changePassword() {
      // 先判断输入信息
      if (
        this.forgetData.username == '' ||
        this.forgetData.oldPassword == '' ||
        this.newPassword == ''
      ) {
        this.$message({
          message: '请输入正确信息后重试',
          type: 'warning'
        })
      } else {
        //调用ChangePassword函数，向后端服务器提交修改密码的请求，并在异步请求返回结果后进行处理。
        //this.forgetData是一个包含修改密码信息的对象，作为ChangePassword函数的参数传入。
        //then方法用于监听异步请求的解析结果，并在解析完成后执行回调函数，将解析结果作为回调函数的参数传入。
        ChangePassword(this.forgetData).then((res) => {
          // console.log(res);
          //使用switch语句对返回结果的code属性进行判断
          switch (res.data.code) {
            case 1:
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$router.push('/login')
              break
            case 0:
              this.$message({
                message: '用户不存在，请先注册',
                type: 'warning'
              })
              break
            case -1:
              this.$message({
                message: '原密码错误，请检查后重新输入',
                type: 'warning'
              })
              break
          }
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
  background: url(../../assets/login/test4.jpg);
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
