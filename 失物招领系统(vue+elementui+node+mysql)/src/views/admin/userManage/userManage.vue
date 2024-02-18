<template>
  <div>
    <index-lay-out @getUserList="getUserList" @showDialog="showDialog">
      <template slot="tableShows">
        <!-- 显示的数据区域 -->
        <el-table max-height="598" :data="tableBody" style="width: 100%">
          <el-table-column prop="username" label="用户名" width="400px">
          </el-table-column>
          <el-table-column prop="password" label="密码" width="400px">
          </el-table-column>
          <el-table-column label="操作" width="420px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </index-lay-out>
    <!-- 新增用户弹窗 -->
    <el-dialog
      class="addUserStyle"
      title="新增用户"
      :visible.sync="addDialog"
      width="500px"
    >
      <div class="inner">
        <el-form ref="form" :model="addUserData" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="addUserData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="addUserData.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="addUserData.rewritePassword"></el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button @click="register" type="primary">注册</el-button>
            <el-button @click="closeDialog" type="danger">取消</el-button>
          </el-form-item>
          <div style="width: 0; height: 0; clear: both"></div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 编辑用户信息弹窗 -->
    <el-dialog
      class="editUserStyle"
      title="编辑信息"
      :visible.sync="editUser"
      width="500px"
    >
      <div class="inner">
        <el-form ref="form" :model="editInfo" label-width="60px">
          <el-form-item label="用户名">
            <el-input v-model="editInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="原密码">
            <el-input v-model="editInfo.oldPassword"></el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button @click="editClick" type="primary">确定</el-button>
            <el-button @click="closeEditDialog" type="danger">取消</el-button>
          </el-form-item>
          <div style="width: 0; height: 0; clear: both"></div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import indexLayOut from '../index.vue'
import { GetAllUsers, EditUserInfo, DeleteUser, Register } from '@/api/api'
export default {
  data() {
    return {
      tableData: [], // 表格数据
      tableBody: [], // 表格主体数据
      tableHeader: [], // 表格表头数据

      addDialog: false, // 新增用户弹窗
      addUserData: {
        username: '',
        password: '',
        rewritePassword: '' // 确认密码
      },
      editUser: false, // 编辑用户信息弹窗
      editInfo: {
        username: '',
        oldName: '', // 旧用户名，用于当用户名也修改时数据库查询原数据
        oldPassword: '' // 旧密码
      }
    }
  },
  components: {
    indexLayOut
  },
  created() {
    // 查询用户是否为admin
    if (sessionStorage.getItem('username') == 'admin') {
      console.log('管理员登录')
      this.getUserList() // 创建时调用获取用户数据方法
    } else {
      this.$confirm('非管理员用户不能访问，是否跳转到登录页', '提示', {
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
          this.$router.push('/login')
        })
    }
  },
  methods: {
    // 获取所有用户信息
    getUserList() {
      // console.log("获取所有用户数据");
      GetAllUsers().then((res) => {
        this.tableData.push(res.data.tableData)
        this.tableHeader = this.tableData[0].tableHeader // 表头数据
        this.tableBody = this.tableData[0].tableBody // 表体数据
      })
    },
    showDialog(index) {
      // 打开新增用户弹窗
      this.addDialog = index
      // console.log(this.addDialog);
    },
    // 编辑按钮
    handleEdit(index, row) {
      this.editUser = true // 打开弹窗
      // console.log(row);
      // 将当前行的数据写入输入框中当作提示
      this.editInfo.username = row.username
      this.editInfo.oldPassword = row.password
      // 将旧用户名存储起来
      this.editInfo.oldName = row.username
    },
    // 编辑确定
    editClick() {
      // 调用接口
      // 先判断输入信息
      if (this.editInfo.username == '' || this.editInfo.oldPassword == '') {
        this.$message({
          message: '请输入正确信息后重试',
          type: 'warning'
        })
      } else {
        // 调用接口
        EditUserInfo(this.editInfo).then((res) => {
          switch (res.data.code) {
            case 1: {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              clearTimeout(t)
              let t = setTimeout(() => {
                window.location.reload()
              }, 300)
              this.editUser = false
              break
            }

            case 0:
              this.$message({
                message: '用户不存在，请先注册',
                type: 'warning'
              })
              break
          }
        })
      }
    },
    // // 编辑取消
    closeEditDialog() {
      this.editUser = false
      // 清空数据
      this.editInfo.username = ''
      this.editInfo.oldPassword = ''
    },
    handleDelete(index, row) {
      // 删除按钮
      let deleteData = {
        username: row.username
      }
      // 删除按钮
      // console.log("删除按钮");
      this.$confirm(
        `此操作将永久删除${deleteData.username}账户, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 调用删除接口
          DeleteUser(deleteData).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              clearTimeout(t)
              let t = setTimeout(() => {
                window.location.reload()
              }, 300)
            }
          })
          // 调用浏览器刷新方法，进行数据刷新
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 新增用户
    addUser() {
      this.addDialog = true
    },
    // 新增用户：确定按钮  调用用户注册接口
    register() {
      if (this.addUserData.username == '' || this.addUserData.password == '') {
        this.$message({
          message: '请输入正确信息',
          type: 'warning'
        })
      } else if (
        this.addUserData.password != this.addUserData.rewritePassword
      ) {
        this.$message({
          message: '两次密码不一致，请检查后重新输入',
          type: 'warning'
        })
      } else {
        // 信息无误后，调用接口
        Register(this.addUserData).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            clearTimeout(t)
            let t = setTimeout(() => {
              window.location.reload()
            }, 300)
            // //   刷新用户表数据;
            // window.location.reload();
            // // 清空输入框后关闭弹窗
            // this.addUserData.username = "";
            // this.addUserData.password = "";
            // this.addUserData.rewritePassword = "";
            this.addDialog = false
          } else {
            this.$message({
              message: '用户已存在，请前往登录',
              type: 'warning'
            })
          }
        })
      }
    },
    // // 关闭当前弹窗
    closeDialog() {
      this.addDialog = false
      // 清空输入框
      this.addUserData.username = ''
      this.addUserData.password = ''
      this.addUserData.rewritePassword = ''
    }
  }
}
</script>
<style scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px 0px;
}
</style>
