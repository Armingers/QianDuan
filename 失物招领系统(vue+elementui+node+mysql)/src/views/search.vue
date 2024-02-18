<template>
  <div class="searchStyle">
    <!-- @dataSend事件监听器，当子组件触发dataSend事件时，会调用父组件中的dataSend方法，并将$event作为参数传递给该方法。 -->
    <nav-bar @dataSend="dataSend($event)"></nav-bar>
    <div class="searchBody">
      <!-- 在这里显示查询的数据：分为查询失物、查询招领信息两部分 -->
      <!-- 失物信息区 -->
      <!-- <h2 style="text-align: left; margin-bottom: 10px">
        当前查询的是：<span v-text="title"></span>
      </h2> -->
      <h1 v-show="nothing">暂无数据</h1>
      <div class="lost">
        <h3>失物信息区</h3>
        <div v-if="lost" class="info">
          <div v-for="(item, index) in lostData" :key="index" class="infoInner">
            <img :src="item.imgUrl" alt="" />
            <div>
              <!-- 标题 -->
              <h4
                style="
                  border-bottom: 2px solid rgb(64, 158, 255);
                  text-align: center;
                "
              >
                寻找-<span v-text="item.title"></span>
              </h4>
              <!-- 地址 -->
              <!-- <h5>地址：<span v-text="item.address"></span></h5> -->
              <label for="#">地址：</label><span v-text="item.address"></span
              ><br />
              <label for="#">发布人：</label><span v-text="item.username"></span
              ><br />
              <!-- 丢失时间 -->
              <p style="color: red" v-text="item.lostTime"></p>
              <el-button
                class="elbutton"
                type="primary"
                @click="openDialog(index)"
                >查看更多</el-button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 招领信息区 -->
      <div class="found">
        <h3>招领信息区</h3>
        <div v-if="found" class="info">
          <div
            v-for="(item, index) in foundData"
            :key="index"
            class="infoInner"
          >
            <img :src="item.imgUrl" alt="" />
            <div>
              <!-- 标题 -->
              <h4
                style="
                  border-bottom: 2px solid rgb(64, 158, 255);
                  text-align: center;
                "
              >
                招领-<span v-text="item.title"></span>
              </h4>
              <!-- 地址 -->
              <!-- <h5>地址：<span v-text="item.address"></span></h5> -->
              <label for="#">地址：</label><span v-text="item.address"></span
              ><br />
              <label for="#">发布人：</label><span v-text="item.username"></span
              ><br />
              <!-- 丢失时间 -->
              <p style="color: red" v-text="item.foundTime"></p>
              <el-button
                class="elbutton"
                type="primary"
                @click="openDialog2(index)"
                >查看更多</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 失物弹窗 -->
    <el-dialog
      :title="titleChange"
      :visible.sync="getDilog"
      width="800px"
      class="dialogStyle"
    >
      <!-- <el-button type="primary">招领信息</el-button> -->
      <div class="mainBox">
        <div class="mainTop">
          <!-- 弹窗主要信息区 -->
          <div class="left2">
            <!-- 图片区  宽350px -->
            <img :src="dialogData.imgUrl" alt="" />
            <h3 v-text="dialogData.title"></h3>
          </div>
          <div class="right2">
            <!-- 详细信息区域 -->
            <label for="#">标题：</label><span v-text="dialogData.title"></span
            ><br />
            <label for="#">地址：</label
            ><span v-text="dialogData.address"></span><br />
            <label for="#">发布人：</label
            ><span v-text="dialogData.username"></span><br />
            <label for="#">丢失时间：</label
            ><span v-text="dialogData.lostTime"></span><br />
            <label for="#">联系方式：</label
            ><span v-text="dialogData.contact"></span><br />
            <div class="forget">
              <label for="#">备注：</label>
              <div>
                <span v-text="dialogData.remark">.</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mainBottom">
          <el-button @click="closeDialog" type="danger">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 招领弹窗 -->
    <el-dialog
      :title="titleChange2"
      :visible.sync="getDilog2"
      width="800px"
      class="dialogStyle"
    >
      <!-- <el-button type="primary">招领信息</el-button> -->
      <div class="mainBox">
        <div class="mainTop">
          <!-- 弹窗主要信息区 -->
          <div class="left2">
            <!-- 图片区  宽350px -->
            <img :src="dialogData2.imgUrl" alt="" />
            <h3 v-text="dialogData2.title"></h3>
          </div>
          <div class="right2">
            <!-- 详细信息区域 -->
            <label for="#">标题：</label><span v-text="dialogData2.title"></span
            ><br />
            <label for="#">地址：</label
            ><span v-text="dialogData2.address"></span><br />
            <label for="#">发布人：</label
            ><span v-text="dialogData2.username"></span><br />
            <label for="#">拾到时间：</label
            ><span v-text="dialogData2.foundTime"></span><br />
            <label for="#">联系方式：</label
            ><span v-text="dialogData2.contact"></span><br />
            <div class="forget">
              <label for="#">备注：</label>
              <div>
                <span v-text="dialogData2.remark">.</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mainBottom">
          <el-button @click="closeDialog2" type="danger">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import navBar from '@/components/navBar'
import { SearchId } from '@/api/api'
export default {
  data() {
    return {
      nothing: true, // 默认显示暂无数据
      lost: false,
      lostData: [],
      found: false, // 控制显示那一块区域的数据
      foundData: [],
      res: [],
      title: '',
      getDilog: false,
      getDilog2: false,
      dialogData: {}, // 弹窗数据
      dialogData2: {}, // 弹窗数据
      titleChange: '',
      titleChange2: ''
    }
  },
  components: {
    navBar
  },
  created() {
    this.dataSend()
  },
  methods: {
    dataSend() {
      this.title = sessionStorage.getItem('searchTitle')
      // 调用接口
      let sendData = {
        key: this.title
      }
      SearchId(sendData).then((res) => {
        console.log(res.data)
        switch (res.data.code) {
          case -1: {
            this.nothing = true
            this.found = false
            this.lost = false
            break
          }
          case 0: {
            this.nothing = false
            this.found = true
            this.lost = false
            break
          }
          case 1: {
            this.nothing = false
            this.found = false
            this.lost = true
            break
          }
          case 2: {
            this.nothing = false
            this.found = true
            this.lost = true
            break
          }
        }
        // 填充数据
        this.lostData = res.data.lostData
        this.foundData = res.data.foundData
      })
    },
    openDialog(index) {
      // console.log(index);
      // console.log(this.lostData[index]); // 获取点击的模块的数据
      this.dialogData = this.lostData[index]
      // 显示更多
      this.getDilog = true
      this.titleChange = `搜索的物品是：${this.title}`
    },
    closeDialog() {
      this.getDilog = false
    },
    openDialog2(index) {
      // console.log(index);
      // console.log(this.foundData[index]); // 获取点击的模块的数据
      this.dialogData2 = this.foundData[index]
      // 显示更多
      this.getDilog2 = true
      this.titleChange2 = `搜索的物品是：${this.title}`
    },
    closeDialog2() {
      this.getDilog2 = false
    }
  }
}
</script>
<style scoped>
/* .searchStyle{
    text-align: left;
} */
.searchBody {
  height: 80vh;
  width: 80%;
  margin-left: 10%;
  padding-top: 10px;
}
.lost,
.found {
  text-align: left;
  border: 2px solid #eee;
  padding: 10px;
}
.found {
  margin-top: 10px;
}
.info {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}
.infoInner {
  width: 28%;
  display: inline-block;
  background-color: white;
  margin-top: 30px;
  padding: 0px 10px;
  margin-right: 5px;
  border: 1px solid #eee;
}
.infoInner img {
  width: 100%;
  height: 150px;
  padding: 20px 0px 20px 0px;
}
.infoInner h5,
p {
  line-height: 20px;
  text-align: left;
  padding: 5px;
}
.elbutton {
  margin-left: 220px;
  margin-bottom: 10px;
}
.dialogStyle {
  text-align: left;
}
.mainBox {
  height: 380px;
  padding-top: 10px;
}
.mainTop {
  height: 340px;
  display: flex;
  justify-content: space-between;
}
.left2 {
  width: 340px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.left2 img {
  width: 300px;
  height: 167px;
}
.right2 {
  width: 100%;
  padding-left: 20px;
}
.right2 label {
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
.right2 span {
  display: inline;
  line-height: 40px;
}
.mainBottom {
  padding-top: 10px;
  height: 50px;
}
.mainBottom button {
  float: right;
}
</style>
