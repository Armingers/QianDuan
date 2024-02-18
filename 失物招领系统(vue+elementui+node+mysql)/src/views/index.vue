<template>
  <div>
    <!-- 首页 -->
    <nav-bar :pages="1"></nav-bar>
    <!-- 主体部分 -->
    <div class="main">
      <div class="top">
        <div class="left" style="margin-left: 0px">
          <carousel-model weight="330px" height="330px" :list="list"></carousel-model>
        </div>
        <div class="right">
          <!-- <div style="width: 100%">
            <img class="imgStyle" :src="userInfoData.imgUrl" alt="" />
          </div>
          <div class="userInfo">
            <p>欢迎：<span v-text="userInfoData.username"></span></p>
            <p>当前有失物信息：<span v-text="lostInfoLength"></span>条</p>
            <p>当前有招领信息：<span v-text="foundInfoLength"></span>条</p>
          </div> -->
          <div>
            <h3>励志短语</h3>
            <p>
              生命如行舟，顺逆风浪皆是人生必经之路。不要害怕挫折，不要害怕失败，因为这些都是成长的过程。
            </p>
            <p>
              单枪匹马你别怕，一腔孤勇又如何，这一路你可以哭，但你一定不能怂。不拼一把，又怎么知道自己是人物还是废物！
            </p>
            <p>
              你是你的敌人，只有你才能打倒你；你是你的上帝，只有你才能拯救你。
            </p>
          </div>
        </div>
      </div>
      <div class="titles">
        <h3>失物招领信息</h3>
      </div>
      <!-- 信息列表 ..-->
      <!-- 判断是否渲染该元素。当infoShow为true时，该元素才会被渲染 -->
      <div v-if="infoShow" class="info">
        <!-- v-for指令，用于循环渲染该元素。pagesShow为循环的数据源，
        每次循环会将其中的元素赋值给item变量，同时还可以获取到当前循环的索引值index -->
        <!-- :key指令用于绑定循环元素的唯一标识，这里使用了index作为标识。
          class属性为该元素添加了一个名为"infoInner"的样式类。 -->
        <div v-for="(item, index) in pagesShow" :key="index" class="infoInner">
          <!-- item.imgUrl为图片地址。 -->
          <img :src="item.imgUrl" alt="" />
          <!-- v-show指令用于根据item.status的值来判断是否显示该标签。h4标签用于显示item.title的值，并添加了一个下边框。 -->
          <!-- p标签用于显示item.address、item.username、item.lostTime的值。
            el-button为Element UI框架的按钮组件，@click指令用于绑定点击事件，openDialog为事件处理函数。 -->
          <div style="position: relative">
            <!-- 标题 -->
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
            <!-- 地址 -->
            <p>地址：<span v-text="item.address"></span></p>
            <!-- <h5>地址：<span v-text="item.address"></span></h5> -->
            <!-- 信息 -->
            <!-- <p class="msgStyle" v-text="item.msg"></p> -->
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
      title="招领信息"
      :visible.sync="getDilog"
      width="850px"
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
            <label for="#">拾到时间：</label
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
  </div>
</template>
<script>
import navBar from '@/components/navBar'
// 引入轮播图组件
import carouselModel from '@/components/carousel'
import { LostTings } from '@/api/api'
export default {
  data() {
    return {
      list: [
        // 轮播图
        {
          imgPath: require('../assets/index/1.jpg')
        },
        {
          imgPath: require('../assets/index/2.jpg')
        },
        {
          imgPath: require('../assets/index/3.jpg')
        },
        {
          imgPath: require('../assets/index/4.jpg')
        }
      ],
      lostTingsData: [],
      currentPage: 1,
      pages: 1, // 页码数，默认为1
      showListData: [], // 要显示的数据为
      infoShow: true,
      pagesShow: [],
      getDilog: false, // 弹窗默认不显示
      dialogData: {}, // 弹窗数据
      lostInfoLength: '',
      foundInfoLength: ''
    }
  },
  methods: {
    // 调用获取失物信息接口
    getInfo() {
      LostTings().then((res) => {
        this.lostTingsData = res.data // 存储获取的数据
        this.lostInfoLength = res.data.length
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

      this.pagesShow.forEach((element) => {
        if (element.status == '未找回') {
          element.status = false
        }
      })
      // console.log(this.pagesShow);

      // console.log(newArr);
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
  },
  components: {
    navBar,
    carouselModel
  },
  created() {
    // 调用获取失物信息接口
    this.getInfo()
    // this.getInfo2();
    // this.getUserInfo();
  }
}
</script>
<style scoped>
.top {
  width: 80%;
  height: 300px;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  margin-left: 10%;
}
.top .right {
  width: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
}
.right {
  flex-wrap: wrap;
}
.right p {
  line-height: 35px;
  text-indent: 10px;
}
.userInfo p {
  width: 100%;
}
.userInfo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: -50px;
}
.main {
  background-color: rgb(239, 239, 239);
}
.titles {
  margin: 10px;
  width: 80%;
  padding: 10px;
  margin-left: 10%;
  border-bottom: 2px solid rgb(64, 158, 255);
  margin-top: 30px;
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
  /* width: 293px; */
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
  padding-bottom: 20px;
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
  height: 375px;
  padding-top: 10px;
}
.mainTop {
  height: 340px;
  display: flex;
  justify-content: space-between;
}
.left2 {
  width: 350px;
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
  /* color: ; */
}
.mainBottom {
  padding-top: 10px;
  height: 50px;
}
.mainBottom button {
  float: right;
}
/* .imgStyle{
  width: 150px;
  height: 150px;
  border-radius: 50%;
} */
</style>
