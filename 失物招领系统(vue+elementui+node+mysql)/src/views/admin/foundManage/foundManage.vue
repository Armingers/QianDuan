<template>
  <div>
    <index-lay-out @getLostThings="getLostThings">
      <template slot="tableShows">
        <!-- 显示的数据区域 -->
        <el-table max-height="598" :data="tableBody" style="width: 100%">
          <el-table-column prop="username" label="发布人" width="80">
          </el-table-column>
          <el-table-column prop="title" label="标题" width="100">
          </el-table-column>
          <el-table-column prop="address" label="地点" width="100">
          </el-table-column>
          <el-table-column prop="foundTime" label="拾到时间" width="110">
          </el-table-column>
          <el-table-column prop="imgUrl" label="图片地址" width="220">
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="290">
          </el-table-column>
          <el-table-column prop="contact" label="联系方式" width="130">
          </el-table-column>

          <el-table-column label="操作" width="200">
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

    <!-- 编辑失物信息弹窗 -->
    <el-dialog
      class="editInfo"
      title="编辑招领信息"
      :visible.sync="showLostDialog"
    >
      <el-form v-model="editData" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="editData.title"></el-input>
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="editData.address"></el-input>
        </el-form-item>
        <el-form-item label="丢失时间">
          <el-input v-model="editData.foundTime"></el-input>
        </el-form-item>
        <el-form-item label="图片地址">
          <el-input v-model="editData.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            :rows="3"
            type="textarea"
            v-model="editData.remark"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="editData.contact"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="editSure" type="primary">确定</el-button>
          <el-button @click="editExit" type="danger">取消</el-button>
        </el-form-item>
        <div style="width: 0; height: 0; clear: both"></div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import indexLayOut from '../index.vue'
import { GetAllFound, EditFoundInfo, DeleteFoundInfo } from '@/api/api'
export default {
  data() {
    return {
      tableData: [], // 表格数据
      tableBody: [], // 表格主体数据
      tableHeader: [], // 表格表头数据
      showLostDialog: false, // 编辑弹窗
      editData: {
        id: '',
        // 编辑框内容
        title: '',
        address: '',
        foundTime: '',
        imgUrl: '',
        remark: '',
        contact: ''
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
      this.getLostThings() // 创建时调用获取用户数据方法
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
    // 获取所有招领信息
    getLostThings() {
      // console.log("获取所有失物数据");
      GetAllFound().then((res) => {
        this.tableData.push(res.data.tableData)
        this.tableHeader = this.tableData[0].tableHeader // 表头数据
        this.tableBody = this.tableData[0].tableBody // 表体数据
      })
    },

    // 编辑按钮
    handleEdit(index, row) {
      // console.log(index, row);
      this.showLostDialog = true // 开启弹窗
      this.editData.id = row.id
      // 填充数据
      this.editData.title = row.title
      this.editData.address = row.address
      this.editData.foundTime = row.foundTime
      this.editData.imgUrl = row.imgUrl
      this.editData.remark = row.remark
      this.editData.contact = row.contact
    },
    // 编辑确定
    editSure() {
      EditFoundInfo(this.editData).then((res) => {
        switch (res.data.code) {
          case 1: {
            this.showLostDialog = false
            clearTimeout(t)
            let t = setTimeout(() => {
              window.location.reload()
            }, 300)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            break
          }

          case 0: {
            this.$message({
              message: '数据不存在，请咨询管理员',
              type: 'warning'
            })
            break
          }

          case -1: {
            this.$message({
              message: '编辑失物信息失败',
              type: 'warning'
            })
            break
          }
        }
      })
    },
    // // 编辑取消
    editExit() {
      this.showLostDialog = false
      // 清空数据
      this.editData.title = ''
      this.editData.address = ''
      this.editData.foundTime = ''
      this.editData.imgUrl = ''
      this.editData.remark = ''
      this.editData.contact = ''
    },
    handleDelete(index, row) {
      // console.log(index, row);
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
          DeleteFoundInfo(deleteData).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              clearTimeout(t)
              let t = setTimeout(() => {
                // 调用浏览器刷新方法，进行数据刷新
                window.location.reload()
              }, 300)
            } else {
              this.$message({
                type: 'danger',
                message: '删除失败!'
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
    }
  }
}
</script>
<style scoped>
/deep/ .el-table .cell {
  padding-left: 20px;
}
.editInfo {
  text-align: left;
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>
