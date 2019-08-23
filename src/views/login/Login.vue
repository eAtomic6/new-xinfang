<!-- 登录页面 -->
<template>
  <div class="login" :style="{background:url_back_img}">
    <div class="login_container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm login_form">
        <h1 class="loginTitle">吉家新房管理后台</h1>
        <div class="erweima" v-show="isShowEWM">
          <!-- <img src="../../assets/images/erweima.png" alt="手机二维码"> -->
          <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
          <p class="textSaoyisao" v-show="isShowWord">
            请使用
            <span>新房APP</span>扫一扫登录
          </p>
          <p v-show="isShowSuccess">扫描成功，请在手机上点击确认</p>
          <el-button type="primary  " @click.native.prevent="backLogin" class="loginBtn">返回</el-button>
        </div>
        <div v-show="isShowLogin" class="showLogin">
          <el-form-item prop="mobile" class="iptPhone">
            <span class="icon icon-zhuchang phoneIcon"></span>
            <el-input
              v-model="ruleForm.mobile"
              placeholder="请输入手机号"
              maxlength="11"
              class="loginPhone"
              @change="loginPhoneChange"
            ></el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <span class="icon icon-mima phonePassword"></span>
            <el-input
              v-model="ruleForm.captcha"
              placeholder="请输入短信验证码"
              class="codeIpt"
              @keyup.enter.native="loginEnter('ruleForm')"
            ></el-input>
            <div class="getPhoneCd" @click="getPhoneCd" v-show="isShowGet">获取手机验证码</div>
            <div class="getPhoneCd againPhoneCd" v-show="isShowAgain">
              还剩
              <span style="color: #FD8F00">{{againTime}}</span> 秒
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click.native.prevent="loginEnter('ruleForm')"
              class="loginBtn"
            >登录</el-button>
          </el-form-item>
          <el-button type="text" class="getEWMBtn" @click="showEWM">二维码登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { isvalidLoginPhone } from "./validate.js";
import QrcodeVue from "qrcode.vue";
import {
  getPhoneCode,
  getLoginAdmin,
  getPersonInfo,
  getAnnounceList,
  getNoReadNum
} from "@/api/index";

export default {
  data() {
    return {
      uuid1: "",
      value: "", //二维码的url
      size: 150, //二维码的大小
      userCode: "9988",
      isShowGet: true, // 显示获取短信验证码
      isShowAgain: false, // 重新获取验证码显示
      againTime: 60, // 重新获取短信验证码倒计时时间
      isShowLogin: true, // 显示登录界面
      isShowEWM: false, // 显示扫描登录
      isShowWord: true, // 扫描之前的提示
      isShowSuccess: false, // 扫描成功之后的提示
      setIntervalID: "",
      ruleForm: {
        mobile: "",
        captcha: ""
      },
      rules: {
        mobile: [{ required: true, trigger: "blur", message: "请输入手机号" }],
        captcha: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ]
      },
      url_back_img:
        "url(" + require("../../assets/images/login-banner.jpg") + ")"
    };
  },
  created() {
    this.reloginMethod();

    //  从驻场端过来
    if (this.$route.query.token) {
      console.log(`我是驻场端过来的token:${this.$route.query.token}`);
      this.longinPublicMethod(this.$route.query.token);
    }
  },
  methods: {
    connectSocket() {
      let hostUrl = window.location.host;
      let url = "";
      let pathObj = {path: '/ws/socket.io'}
      let uuid1;
      let _this = this;
      switch (hostUrl) {
        case "newhousesys.t.jjw.com:8095":
          url = "http://newhousesys.t.jjw.com";
          break;
        case "192.168.1.29:8089":
          url = "http://s224.360fdc.com:18088";
          pathObj={}
          break;
        case "s224.360fdc.com:8095":
          url = "http://s224.360fdc.com:8095/ws";
          break;
        case "newhousesys.jjw.com":
          // url = location.protocol === 'https' ? "wss://newhousesys.jjw.com:18089" : "ws://newhousesys.jjw.com:18089";
          url = "https://newhousesys.jjw.com";
          break;
      }
      let socket = io.connect(url, pathObj);
      let captcha = Math.floor(Math.random() * 9000) + 1000;
      socket.emit("regCaptcha", captcha, function(data) {
        console.log("我是建立sockiet链接");
      });
      socket.on("captcha" + captcha, function(uuid) {
        console.log(`我是获得二维码:${uuid}`);
        _this.value = url + "/qr/sendMyToken?captcha=" + uuid;
        uuid1 = uuid;
        socket.on(uuid1, function(val) {
          _this.longinPublicMethod(val);
        });
      });
    },
    reloginMethod() {
      if (localStorage.getItem("checkIsLogin") == "true") {
        this.alertMessage("warning", "登录已过期，请重新登录");
        localStorage.setItem("checkIsLogin", false);
      }
    },
    // 登录按钮确定
    loginEnter(ruleForm) {
      // 将参数存储到params
      let params = this.ruleForm;
      // 首先判断是否为空
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // 调用登录接口
          if (!isvalidLoginPhone(this.ruleForm.mobile)) {
            this.alertMessage("warning", "手机号请输入十一位数字");
            return;
          }
          getLoginAdmin({ params: params }).then(res => {
            if (res.status == 200) {
              // 将接口中的token存储到本地存储中
              this.longinPublicMethod(res.data.token);
            } else {
              this.alertMessage("warning", res.message);
            }
          });
        } else {
          this.alertMessage("warning", "请填写完整信息");
          return false;
        }
      });
    },
    longinPublicMethod(val) {
      // console.log(this.setIntervalID);
      localStorage.setItem("token", val);
      this.alertMessage("success", "登录成功");
      // this.setIntervalID = ""
      clearInterval(this.setIntervalID);
      // 登录成功将token存储到state中
      this.$store.commit("set_token", val);
      getPersonInfo().then(res => {
        // 秦星星增加---公司logo---左上角使用
        this.$store.commit("companyLogo", res.data.headImg);
        this.$store.commit("set_info", res.data);
        localStorage.setItem("myInfo", JSON.stringify(res.data));
      });
      getNoReadNum().then(res => {
        if (res.status === 200) {
          localStorage.setItem("announceNum", res.data.count);
          this.$store.commit("set_annNum", res.data.count);
        }
      });
      setTimeout(() => {
        // 登录成功跳转页面
        if (this.$route.query.token) {
          this.$router.push({
            name: "projectManage"
          });
          this.$store.commit("code", 1);
        } else {
          this.$router.replace("/home");
          this.$store.commit("code", 2);
        }
      }, 1000);
    },
    // 获取短信验证码
    getPhoneCd() {
      if (!isvalidLoginPhone(this.ruleForm.mobile)) {
        this.alertMessage("warning", "手机号请输入十一位数字");
        return;
      }
      this.ruleForm.type = 0;
      const params = this.ruleForm;
      getPhoneCode({ params: params }).then(res => {
        if (res.status === 200) {
          this.isShowGet = false;
          this.isShowAgain = true;
          let timerId = setInterval(() => {
            this.againTime--;
            if (this.againTime == 0) {
              clearInterval(timerId);
              this.againTime = 60;
              this.isShowGet = true;
              this.isShowAgain = false;
            }
          }, 1000);
        } else {
          this.alertMessage("warning", res.message);
          return;
        }
      });
    },
    loginPhoneChange() {
      if (!isvalidLoginPhone(this.ruleForm.mobile)) {
        this.alertMessage("warning", "手机号请输入十一位数字");
        return;
      }
    },
    // 点击扫码返回函数
    backLogin() {
      this.isShowEWM = false;
      this.isShowLogin = true;
    },
    // 点击二维码登录函数
    showEWM() {
      this.connectSocket();
      this.isShowEWM = true;
      this.isShowLogin = false;
      this.setIntervalID = setInterval(() => {
        this.connectSocket();
      }, 60000);
    }
  },
  components: {
    QrcodeVue
  }
  // watch: {
  //   uuid1(val) {
  //     let socket = io.connect("http://192.168.1.224:18088");
  //     socket.on(uuid1, function(val) {
  //       console.log("获得token" + val);
  //     });
  //   }
  // }
};
</script>
<style lang="scss" scoped>
$btn: #fd8f00;
$fontColor: #666;
$hover: #3292f5;
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  .login_container {
    position: relative;
    // &:before {
    //   content: "";
    //   position: absolute;
    //   top: 62px;
    //   z-index: 2;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   width: 428px;
    //   height: 0.4em;
    //   background: -webkit-linear-gradient(
    //       315deg,
    //       transparent,
    //       transparent 45%,
    //       #ccc,
    //       transparent 55%,
    //       transparent 100%
    //     ),
    //     -webkit-linear-gradient(45deg, transparent, transparent 45%, #ccc, transparent
    //           55%, transparent 100%);
    //   background: linear-gradient(
    //       135deg,
    //       transparent,
    //       transparent 45%,
    //       #ccc,
    //       transparent 55%,
    //       transparent 100%
    //     ),
    //     linear-gradient(
    //       45deg,
    //       transparent,
    //       transparent 45%,
    //       #ccc,
    //       transparent 55%,
    //       transparent 100%
    //     );
    //   background-size: 0.8em 0.8em;
    //   background-repeat: repeat-x, repeat-x;
    //   color: #ccc;
    // }
    .login_form {
      width: 428px;
      height: 390px;
      margin: 0px auto;
      background-color: #fff;
      box-shadow: 0px 0px 18px 0px rgba(40, 40, 40, 0.25);
      padding: 102px 28px 24px 28px;
      position: relative;
      .showLogin {
        width: 374px;
      }
      .erweima {
        img {
          width: 130px;
        }
        .textSaoyisao {
          margin: 10px 0;
          span {
            color: $btn;
            font-size: 16px;
          }
        }
        text-align: center;
      }
      .loginTitle {
        text-align: center;
        font-size: 24px;
        color: #666;
        width: 428px;
        height: 63px;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 63px;
        margin-bottom: 55px;
        background: #f6f6f6 url(../../assets/images/login-border.png) repeat-x
          bottom center;
      }
      .getEWMBtn {
        position: absolute;
        margin-top: 28px;
        top: 310px;
        left: 50%;
        transform: translateX(-50%);
        bottom: 45px;
        color: $btn;
        font-size: 12px;
        &:hover {
          color: $hover;
        }
      }
      .loginBtn {
        width: 100%;
        background-color: $btn;
        width: 374px;
        border-radius: 0;
        height: 52px;
        border: none;
        font-size: 16px;
        margin-top: 10px;
        margin-bottom: 20px;
      }
      .getNumCd {
        color: $fontColor;
        font-size: 18px;
        width: 60px;
        font-weight: 700;
      }
      .codeIpt,
      .loginPhone {
        &::before {
          content: "";
          display: inline-block;
          position: absolute;
          top: 14px;
          left: 40px;
          width: 9px;
          height: 22px;
          background: url(../../assets/images/login-dash.png) no-repeat center center;
        }
      }
      .getPhoneCd {
        color: $btn;
        cursor: pointer;
        width: 105px;
        font-size: 12px;
        position: absolute;
        right: 4px;
        top: 8px;
        height: 35px;
        line-height: 35px;
        text-align: right;
        &:hover {
          color: $hover;
        }
      }
      .againPhoneCd {
        color: $fontColor;
        font-size: 12px;
        cursor: text;
      }
      .phoneIcon,
      .phonePassword {
        font-size: 24px;
        position: absolute;
        top: 5px;
        left: 12px;
        z-index: 2;
        color: $fontColor;
      }
    }
  }
}
</style>
