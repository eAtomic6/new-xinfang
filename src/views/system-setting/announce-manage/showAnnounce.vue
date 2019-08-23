<!-- 公告详情展示 -->
<template>
  <div class="container" id="showAnnounceCss">
      <div class="ann_header">
          <i class="icon icon-fanhui"></i><input type="button" value="返回公告列表" @click="backAnnounce">
      </div>
      <div class="announceContent">
          <div class="contentHeader">
                <h3>{{announceData.title}}</h3>
                <span>{{announceData.create_dep}}：&nbsp;&nbsp;&nbsp; {{announceData.create_time}}</span>
          </div>
          <div class="announceMain">
              <h1>{{announceData.title}}</h1>
              <p>各位同事:</p>
              <div>&nbsp;&nbsp;&nbsp;{{announceData.context}}</div>
          </div>
          <div class="announceFooter">
              <span>数据范围： {{announceData.readers}}</span>
          </div>
      </div>
  </div>
</template>

<script>
import {getAnnounceInfo} from '@/api';
export default {
  data () {
    return {
        announceData: {

        }
    };
  },
  created(){
        getAnnounceInfo({params: {noticeId: this.$route.query.noticeId}}).then(res => {
            this.announceData = res.data
            // this.announceTitle = res.data.title
            
        })
    },
  methods: {
      backAnnounce(){
          this.$router.push({name: 'announceManage'})
      }
  }
}

</script>
<style lang='scss'>
#showAnnounceCss{
    padding: 0 90px;
    // 头部样式
    .ann_header{
        position: relative;
        top: -10px;
        input{
            width: 136px;
            height: 36px;
            background-color: #72a0d1;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
        }
        i{
            position: absolute;
            left: 10px;
            top: 10px;
            color:#fff;
        }
    }
    // 内容样式
    .announceContent{
        background-color: #fff;
        padding: 37px 102px;
        span {
                display: inline-block;
                margin: 11px 0;
                color: #999999;
            }
        .contentHeader{
            h3{
                color: #333333;
            }   
        }
        .announceMain{
            border-top: 1px solid #d3d3d3;
            border-bottom: 1px solid #d3d3d3;
            padding: 60px 0 105px 0;
            line-height: 30px;
            h1{
                text-align: center;
                margin-bottom: 90px;
            }
        }
    }
}
</style>