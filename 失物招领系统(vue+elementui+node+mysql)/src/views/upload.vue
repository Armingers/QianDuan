<template>
  <div>
    <!-- 发布 -->
    <nav-bar :pages="5"></nav-bar>
    <!-- 发布信息：寻物启事 // 招领启事 -->
    <div class="main">
      <div class="inner">
        <el-form class="formStyle" :model="uploadData" label-width="70px">
          <h3 style="">发布信息</h3>
          <el-form-item style="margin-top: 30px; color:black;" label="类别选择">
            <el-select
              style="width: 400px"
              v-model="modelSelect"
              placeholder="请选择发布的类型"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input
              style="width: 400px"
              v-model="uploadData.title"
            ></el-input>
          </el-form-item>
          <el-form-item label="地点">
            <el-input
              style="width: 400px"
              v-model="uploadData.address"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input
              style="width: 400px"
              v-model="uploadData.contact"
            ></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              style="width: 400px"
              v-model="uploadData.time"
              type="date"
              placeholder="请选择时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input
              type="textarea"
              :rows="3"
              style="width: 400px"
              v-model="uploadData.remark"
            ></el-input>
          </el-form-item>

          <!-- 图片：非必填项 -->
          <el-form-item class="iptStyle" label="图片">
            <input
              class="ipt"
              type="file"
              accept="image/*"
              id="upload"
              @change="upload2($event)"
            />
          </el-form-item>
        </el-form>
        <div style="margin-top: 450px; margin-bottom: 10px; margin-left: 50px;text-align:center">
          
          <el-button @click="upload" type="primary">确定</el-button>
          <el-button @click="exit">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navBar from '@/components/navBar'
//导入了/src/api/api.js文件中定义的两个接口函数，用于上传失物启事和招领启事的数据。
import { LostNotice, FoundNotice } from '@/api/api'
//导出当前组件，以便其他组件使用
export default {
  data() {
    return {
      modelSelect: '', // 上传类型
      uploadData: {
        title: '',
        address: '',
        contact: '',
        time: '',
        remark: '',
        username: sessionStorage.getItem('username'), // 获取发布人名字
        imgData: '', // 存储图片二进制数据
        imgName: '' // 上传的图片名
      },
      uploadDataResult: {},
      uploadFile: '', // 图片
      options: [
        {
          label: '失物启事',
          value: '1'
        },

        {
          label: '招领启事',
          value: '2'
        }
      ]
    }
  },
  methods: {
    upload2(e) {
      var file = e.target.files[0]
      if (file) {
        //从事件对象中获取文件对象file，然后判断是否有文件被选中。如果有，将文件名赋值给uploadData.imgName
        this.uploadData.imgName = e.target.files[0].name // 图片名
        var reader = new FileReader()
        //该箭头函数将读取到的图片数据转换成base64格式
        reader.onload = (event) => {
          var base64 = event.target.result
          var base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
          this.uploadData.imgData = base64Data // 将图片二进制数据赋值给imgData
        }
        reader.readAsDataURL(file) // 将 Blob 或 File 对象转成base64
      }
    },
    upload() {
      // console.log(this.uploadData.imgData); // 图片数据
      // 先判断输入的内容
      if (this.modelSelect == '') {
        this.$message({
          message: '请选择发布类型',
          type: 'warning'
        })
      } else if (
        this.uploadData.title == '' ||
        this.uploadData.address == '' ||
        this.uploadData.contact == '' ||
        this.uploadData.remark == '' ||
        this.uploadData.time == ''
      ) {
        this.$message({
          message: '请正确的输入信息后重试',
          type: 'warning'
        })
      } else {
        // 确保输入框不为空后进行值验证
        if (this.modelSelect == 1) {
          // 先判断什么类型的，根据类型调用不同类型的接口
          // 1  失物启事
          console.log('失物启事')
          LostNotice(this.uploadData).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              // 通过刷新浏览器方式来清空输入框
              clearTimeout(t)
              let t = setTimeout(() => {
                window.location.reload()
              }, 200)
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        } else {
          // 2  招领启事
          console.log('招领启事')
          FoundNotice(this.uploadData).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              // 通过刷新浏览器方式来清空输入框
              clearTimeout(t)
              let t = setTimeout(() => {
                window.location.reload()
              }, 200)
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      }
    },
    exit() {
      // 取消按钮
      window.location.reload()
    }
  },
  components: {
    navBar
  },
  beforeCreate() {
    if (sessionStorage.getItem('username')) {
      console.log('已经登录，可以访问')
    } else {
      // 未登录，不能访问，跳转到登录页
      this.$confirm('未登录用户不能访问，是否跳转到登录页', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //点击确定
          this.$router.push('/login')
        })
        .catch(() => {
          // 点击取消
          this.$router.push('/index')
        })
    }
  }
}
</script>
<style scoped>
.main {
  width: 100%;
  height: 75.5vh;
  background-color: rgb(239, 239, 239);
  display: flex;
  justify-content: center;
}
.inner {
  width: 80%;
  padding-top: 60px;
  display: flex;
  justify-content: center;
}
.formStyle {
  width: 500px;
}
/deep/ .el-upload-dragger {
  width: 400px;
}
/deep/ .el-upload-list__item-name {
  text-align: left;
}
.iptStyle {
}
.ipt {
  margin-left: -138px;
}
</style>
