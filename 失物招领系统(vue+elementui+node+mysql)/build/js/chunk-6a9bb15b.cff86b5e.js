(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6a9bb15b"],{"058a":function(t,e,s){"use strict";s("49b0")},"1d33":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("nav-bar",{attrs:{pages:4}}),s("div",{staticClass:"main"},[s("div",{staticClass:"inner"},[t._m(0),s("p",{staticStyle:{"padding-top":"6px","font-size":"13px"}},[t._v(" 那些以前说着永不分离的人，早已经散落在天涯了。 ")]),s("div",{staticClass:"msg"},[s("el-input",{attrs:{type:"textarea",rows:6,placeholder:"请留下些记忆吧",resize:"none"},model:{value:t.msg,callback:function(e){t.msg=e},expression:"msg"}}),s("el-button",{attrs:{type:"primary"},on:{click:t.sendWord}},[t._v("提交留言")])],1),s("div",{staticClass:"head"}),t._l(t.showList,(function(e,a){return s("div",{key:a,staticClass:"liveWord"},[s("div",{staticStyle:{width:"100%"}},[s("p",{staticStyle:{color:"#409eff"}},[t._v(" 姓名："),s("span",{staticStyle:{color:"black"},domProps:{textContent:t._s(e.username)}})]),s("p",{staticStyle:{"padding-top":"10px",color:"#409eff"}},[t._v(" 留言内容："),s("span",{staticStyle:{color:"black"},domProps:{textContent:t._s(e.msg)}}),s("span",{staticStyle:{float:"right"},domProps:{textContent:t._s(e.livetime)}})])])])})),s("div",{staticClass:"bottom"})],2)])],1)},n=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"title"},[s("h1",{staticStyle:{"text-align":"left"}},[t._v("留言板")])])}],i=s("da1d"),o=s("4ec3"),c={data:function(){return{showList:[],msg:""}},methods:{sendWord:function(){var t=this,e=new Date,s=e.getFullYear(),a=e.getMonth()+1,n=e.getDate(),i=e.getHours(),c=e.getMinutes(),r=e.getSeconds(),l=s+"/"+a+"/"+n+" "+i+":"+c+":"+r,u={username:sessionStorage.getItem("username"),systemTime:l,msg:this.msg};""!=this.msg?Object(o["a"])(u).then((function(e){switch(e.data.code){case 1:t.$message({message:e.data.msg,type:"success"}),clearTimeout(s);var s=setTimeout((function(){window.location.reload()}),300);break;case-1:t.$message({message:e.data.msg,type:"warning"});break}})):this.$message({message:"请输入留言内容",type:"warning"})},getData:function(){var t=this;Object(o["r"])().then((function(e){t.showList=e.data}))}},components:{navBar:i["a"]},created:function(){var t=this;sessionStorage.getItem("username")?this.getData():this.$confirm("未登录用户不能访问，是否跳转到登录页","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.$router.push("/login")})).catch((function(){t.$router.push("/index")}))}},r=c,l=(s("058a"),s("2877")),u=Object(l["a"])(r,a,n,!1,null,"f2c55a76",null);e["default"]=u.exports},"49b0":function(t,e,s){}}]);
//# sourceMappingURL=chunk-6a9bb15b.cff86b5e.js.map