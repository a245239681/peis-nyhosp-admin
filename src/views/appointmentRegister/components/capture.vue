<template>
  <div>
    <Modal class="capture-wrapper"
           v-model="isVisible"
           title="拍照采集"
           draggable
           @on-ok="ok"
           @on-cancel="cancel"
           ok-text="确定"
           cancel-text="关闭"
           width="900">
      <div class="video-area">
        <video id="video"
               width="358px"
               height="441px"
               autoplay="autoplay"></video>
      </div>
      <div class="btns">
        <!-- <Button type="primary" @click="openMedia" size="large">开启摄像头</Button>
                <Button type="primary" @click="closeMedia" size="large">关闭摄像头</Button> -->
        <Button type="primary"
                @click="capture"
                size="large">{{takePhotoText}}</Button>
      </div>
      <div class="photo-area">
        <canvas id="canvas"
                width="358px"
                height="441px"></canvas>
      </div>
    </Modal>
  </div>
</template>

<script>
import { upload } from '@/api/personal_appointment.js';

export default {
  name: 'capture',
  props: {
    visible: Boolean
  },
  data () {
    return {
      picUrl: '',
      cameraStatus: 0 //控制摄像头快关状态， 0是关闭，1是开启
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    },
    takePhotoText: {
      get: function () {
        return this.picUrl == '' ? '拍照' : '重拍';
      },
      set: function () {

      }
    }
  },
  mounted () {
    this.openMedia();
  },
  methods: {
    openMedia () {
      this.cameraStatus = 1; //开启摄像头
      this.getMedia();
    },
    closeMedia () {
      this.cameraStatus = 0; //关闭摄像头
      this.getMedia();
    },
    getMedia () {
      let constraints = {
        video: { width: 358, height: 441 },
        // audio: true
      }
      let promise = navigator.mediaDevices.getUserMedia(constraints);
      if (!promise) return;
      if (this.cameraStatus == 1) {
        //获得video摄像头区域
        let video = document.getElementById('video')
        //这里介绍新的方法，返回一个 Promise对象
        // 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
        // then()是Promise对象里的方法
        // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
        // 避免数据没有获取到
        // promise = navigator.mediaDevices.getUserMedia(constraints)
        promise.then(function (MediaStream) {
          video.srcObject = MediaStream
          video.play();
          // console.log(MediaStream)
        }).catch(err => {
          console.log(err);
          return
        })
      } else {
        let video = document.getElementById('video')
        promise.then(function (MediaStream) {
          // console.log(MediaStream)
          video.srcObject = MediaStream.getTracks()[0].stop();
        }).catch(err => {
          console.log(err);
          return
        })
      }
    },
    capture () {
      //获得Canvas对象
      let video = document.getElementById('video')
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, 358, 441)
      this.picUrl = canvas.toDataURL('image/jpeg', 0.8); //转换图片为dataURL(图片格式,图片质量), base64
      // console.log(this.picUrl);
    },
    // base64ToURL() {
    //     upload({ file: this.picUrl }).then( res => {
    //         let result = res.data;
    //         if (result.code === 0) {
    //             this.imgUrl = `http://192.168.3.70:8087/booking/img/${result.data}`;
    //             // console.log(this.imgUrl);
    //         } else {
    //             this.$Message.error(result.message);
    //         }
    //     });
    // },
    ok () {
      // upload({ file: this.picUrl }).then( res => {
      //     let result = res.data;
      //     if (result.code === 0) {
      //         this.imgUrl = result.data;
      //         // console.log(this.imgUrl);
      //     } else {
      //         this.$Message.error(result.message);
      //     }
      // }).then( () => {
      //     this.$emit('ok', this.imgUrl);
      //     this.$emit('cancel');
      // });
      this.closeMedia();
      this.$emit('ok', this.picUrl);
      this.$emit('cancel');

      this.picUrl = '';
    },
    cancel () {
      this.closeMedia();
      this.$emit('cancel');
      this.picUrl = '';
    }
  }
}
</script>

<style lang="less">
.capture-wrapper {
  .ivu-modal-body {
    display: flex;
    justify-content: space-between;
  }
}
</style>

