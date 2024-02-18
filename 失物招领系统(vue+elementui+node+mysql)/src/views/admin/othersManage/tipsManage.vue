<template>
  <div>
    <index-lay-out @getTipsData="getTipsData" @addTipsData="addTipsData">
      <template slot="tableShows">
        <!-- 显示的数据区域 -->
        <el-table max-height="598" :data="tableBody" style="width: 100%">
          <el-table-column prop="id" label="编号" width="100px">
          </el-table-column>
          <el-table-column prop="tips_msg" label="小标语" width="800px">
          </el-table-column>
          <el-table-column label="操作" width="320px">
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
      title="新增小标语"
      :visible.sync="addDialog"
      width="500px"
    >
      <div class="inner">
        <el-form ref="form" :model="addTipsDataData" label-width="70px">
          <el-form-item label="小标语">
            <el-input
              type="textarea"
              :rows="4"
              v-model="addTipsDataData.tips_msg"
            ></el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button @click="addData" type="primary">确定</el-button>
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
          <el-form-item label="新标语">
            <el-input v-model="editInfo.tips_msg"></el-input>
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
import { GetAllTips, EditTips, DeleteTips, AddTips } from '@/api/api'
export default {
  data() {
    return {
      tableBody: [], // 表格主体数据
      addDialog: false, // 新增用户弹窗
      addTipsDataData: {
        tips_msg: '' // 输入框内容
      },
      editUser: false, // 编辑用户信息弹窗
      editInfo: {
        id: '',
        tips_msg: '' // 编辑框内容
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
      this.getTipsData() // 创建时调用获取用户数据方法
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
    // 获取所有小标语信息
    getTipsData() {
      // console.log("获取所有用户数据");
      GetAllTips().then((res) => {
        this.tableBody = res.data // 表体数据
      })
    },
    showDialog(index) {
      // 打开新增小标语弹窗
      this.addDialog = index
      // console.log(this.addDialog);
    },
    // 编辑按钮
    handleEdit(index, row) {
      this.editUser = true // 打开弹窗
      // console.log(row);
      // 将当前行的数据写入输入框中当作提示
      this.editInfo.tips_msg = row.tips_msg
      this.editInfo.id = row.id
    },
    // 编辑弹窗 确定
    editClick() {
      // 调用接口
      // 先判断输入信息
      if (this.editInfo.tips_msg) {
        EditTips(this.editInfo).then((res) => {
          if (res.data.code == 1) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            // 数据刷新
            clearTimeout(t)
            let t = setTimeout(() => {
              window.location.reload()
            }, 200)
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
      } else {
        this.$message({
          message: '请输入内容后重试',
          type: 'warning'
        })
      }
    },
    // // 编辑弹窗 取消
    closeEditDialog() {
      // 关闭编辑弹窗
      this.editUser = false
      // 清空数据
    },
    handleDelete(index, row) {
      // 删除按钮
      let deleteData = {
        id: row.id
      }
      // 删除按钮
      // console.log("删除按钮");
      this.$confirm(
        `此操作将永久删除编号为${deleteData.id}的数据, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 调用删除接口
          DeleteTips(deleteData).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              // 数据刷新
              clearTimeout(t)
              let t = setTimeout(() => {
                window.location.reload()
              }, 200)
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 新增小标语
    addTipsData() {
      this.addDialog = true
    },
    // 新增小标语：确定按钮  调用新增小标语接口
    addData() {
      AddTips(this.addTipsDataData).then((res) => {
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
           
          })
          // 关闭弹窗
          this.addDialog = false
          // 数据刷新
          clearTimeout(t)
          let t = setTimeout(() => {
            window.location.reload()
          }, 200)
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // // 关闭当前弹窗
    closeDialog() {
      this.addDialog = false
      // 清空输入框
    }
  }
}
</script>
<style scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px 0px;
}
</style>
