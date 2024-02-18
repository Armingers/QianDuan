<template>
  <div>
    <!-- 寻物 -->
    <nav-bar :pages="2"></nav-bar>
    <div class="main">
      <div class="titles">
        <h3>失物信息</h3>
      </div>
      <!-- 信息列表 -->
      <div v-if="infoShow" class="info">
        <div v-for="(item, index) in pagesShow" :key="index" class="infoInner">
          <img :src="item.imgUrl" alt="" />
          <div style="position: relative">
            <!-- 标题 -->
            <!-- v-show来控制该元素的显示状态。当item.status为true时，该元素会显示出来；当item.status为false时，该元素会隐藏。 -->
            <h3
              v-show="item.status"
              style="
                position: absolute;
                top: -150px;
                right: 125px;
                color: rgb(216, 29, 29);
              "
            >
              已找回
            </h3>
            <h4 style="border-bottom:2px solid rgb(64, 158, 255);text-align">
              寻找-<span v-text="item.title"></span>
            </h4>
            <p>地址：<span v-text="item.address"></span></p>
            <!-- <h5>地址：<span v-text="item.address"></span></h5> -->
            <p>发布人：<span v-text="item.username"></span></p>
            <!-- 发布时间 -->
            <p style="color: red">
              发布时间：<span v-text="item.lostTime"></span>
            </p>
            <el-button
              class="elbutton"
              type="primary"
              @click="openDialog(index)"
              >查看更多</el-button
            >
          </div>
        </div>
        <!-- <img src="../assets/lostThings/帅哥卡.jpg" alt=""> -->
      </div>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page.sync="currentPage"
        background
        :page-size="1"
        layout="prev, pager, next, jumper"
        :total="pages"
        @current-change="currentClick"
      ></el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="失物信息"
      :visible.sync="getDilog"
      width="800px"
      class="dialogStyle"
    >
      <!-- <el-button type="primary">失物信息</el-button> -->
      <div class="mainBox">
        <div class="mainTop">
          <!-- 弹窗主要信息区 -->
          <div class="left">
            <!-- 图片区  宽350px -->
            <img :src="dialogData.imgUrl" alt="" />
            <h3 v-text="dialogData.title"></h3>
          </div>
          <div class="right">
            <!-- 详细信息区域 -->
            <label for="#">标题：</label><span v-text="dialogData.title"></span
            ><br />
            <label for="#">地址：</label
            ><span v-text="dialogData.address"></span><br />
            <label for="#">发布人：</label
            ><span v-text="dialogData.username"></span><br />
            <label for="#">遗失时间：</label
            ><span v-text="dialogData.lostTime"></span><br />
            <label for="#">联系方式：</label
            ><span v-text="dialogData.contact"></span><br />
            <div class="forget">
              <label for="#">备注：</label>
              <div>
                <span v-text="dialogData.remark"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="mainBottom">
          <el-button @click="closeDialog" type="danger">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import navBar from '@/components/navBar'
import { LostTings } from '@/api/api'
export default {
  data() {
    return {
      lostTingsData: [],
      currentPage: 1,
      pages: 1, // 页码数，默认为1
      showListData: [], // 要显示的数据为
      infoShow: true,
      pagesShow: [],
      getDilog: false, // 弹窗默认不显示
      dialogData: {} // 弹窗数据
    }
  },
  components: {
    navBar
  },
  created() {
    // 调用获取失物信息接口
    this.getInfo()
  },
  methods: {
    // 调用获取失物信息接口
    getInfo() {
      LostTings().then((res) => {
        this.lostTingsData = res.data // 存储获取的数据
        // 获取数据的条数
        let num = this.lostTingsData.length
        // 计算页码数    一页显示15条数据
        this.pages = num / 12

        this.changes(0)
      })
    },
    currentClick() {
      this.changes(this.currentPage - 1)
    },
    changes(page) {
      // 数组切割
      let newArr = []
      for (let i = 0; i < this.pages; i++) {
        let a = this.lostTingsData.slice(12 * i, 12 * (i + 1))
        newArr.push(a)
      }
      this.pagesShow = newArr[page]
      // console.log(newArr);
      this.pagesShow.forEach((element) => {
        if (element.status == '未找回') {
          element.status = false
        }
      })
    },
    openDialog(index) {
      // console.log(index);
      // console.log(this.pagesShow[index]); // 获取点击的模块的数据
      this.dialogData = this.pagesShow[index]
      // 显示更多
      this.getDilog = true
    },
    closeDialog() {
      this.getDilog = false
    }
  }
}
</script>
<style scoped>
.main {
  min-height: 68vh;
  background-color: rgb(239, 239, 239);
}
.titles {
  width: 80%;
  padding: 20px 10px;
  margin-left: 10%;
  border-bottom: 2px solid rgb(64, 158, 255);
}
.info {
  width: 80%;
  margin-left: 10%;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  padding-left: 7px;
}
.infoInner {
  width: 24%;
  display: inline-block;
  background-color: white;
  margin-top: 10px;
  margin-left: 10px;
}
.infoInner img {
  width: 90%;
  height: 150px;
  padding: 20px 10px 20px 10px;
}
.infoInner h5,
p {
  line-height: 20px;
  text-align: left;
  padding: 5px;
}
.elbutton {
  margin-left: 180px;
  margin-bottom: 10px;
}
.pagination {
  margin-top: 20px;
}
.msgStyle {
  width: 280px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.dialogStyle {
  text-align: left;
}
.mainBox {
  height: 370px;
  padding-top: 10px;
}
.mainTop {
  height: 320px;
  display: flex;
  justify-content: space-between;
}
.left {
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.left img {
  width: 300px;
  height: 167px;
}
.right {
  width: 100%;
  padding-left: 20px;
}
.right label {
  display: inline-block;
  text-align: right;
  line-height: 40px;
  width: 90px;
  font-weight: 600;
}
.forget {
  display: flex;
  flex-wrap: wrap;
}
.forget div {
  width: 350px;
  height: 130px;
  overflow-y: auto;
}
.right span {
  display: inline;
  line-height: 40px;
}
.mainBottom {
  padding-top: 25px;
  height: 50px;
}
.mainBottom button {
  float: right;
}
</style>
