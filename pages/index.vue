<template>
  <div>
    <!-- SPで見た時 -->
    <template v-if="$device.isMobile">
      <div class="main-container">
        <div class="count-area">
          <p class="allCount">{{ counter }}</p>
          <p class="iine">いいね</p>
          <p class="myCount">{{ myCounter }}回応援したよ！</p>
        </div>
        <div class="center-content">
          <!-- キラッとボタン -->
          <div @click="addCount" class="kira-button">
            <img class="kira-image" src="~/assets/kira.png" />
          </div>
          <div class="twit-button-area">
            <TwitterShare :myCount="myCounter" :totalCount="counter" />
          </div>
        </div>
        <!-- footer -->
        <div class="footer">
          <div class="msg-area">
            <div class="msg-text">
              <p v-html="daiaMsg"></p>
            </div>
            <div class="msg-box">
              <img class="kira-image" src="~/assets/msgbox.png" />
            </div>
            <div class="msg-image">
              <img class="daia" src="~/assets/daia.png" />
            </div>
          </div>
          <p class="credit">
            <span class="powerdby">Powered by</span>
            <a href="https://prickathon.github.io/" target="_blank">
              <img class="logo-image" src="~/assets/plb.png" />
            </a>
          </p>
        </div>
      </div>
    </template>
    <!-- PCで見た時 -->
    <template v-else>
      <div>
        スマートフォンで見てね
      </div>
    </template>
  </div>
</template>

<script>
// import anime from 'animejs/lib/anime.es'
import TwitterShare from '~/components/TwitterShare'
/* eslint-disable no-console */
const msgList = [
  'ボタンを押して<br>応援するんだもん！',
  'QRコードの前に<br>立ち止まらないでね！',
  'みんなのライブ、<br>楽しみなんだもん！'
]
const msgSpeed = 4000
export default {
  components: {
    TwitterShare
  },
  data() {
    return {
      myCounter: 0,
      counter: 0,
      db: null,
      ref: null,
      intervalID: null,
      daiaMsg: msgList[0],
      msgNum: 0
    }
  },
  mounted() {
    this.db = this.$firebase.firestore()
    this.ref = this.db.collection('counter').doc('fscount')
    this.getCount(this.ref)
    this.intervalID = window.setInterval(() => {
      this.msgNum += 1
      if (this.msgNum === 3) this.msgNum = 0
      this.daiaMsg = msgList[this.msgNum]
    }, msgSpeed)
    this.ref
      .collection('shards')
      .where('count', '>=', 1)
      .onSnapshot((snapshot) => {
        let total = 0
        snapshot.forEach((doc) => {
          total += doc.data().count
        })
        this.counter = total
      })
  },
  methods: {
    addCount() {
      this.incrementCounter(this.db, this.ref, 10)
      this.myCounter += 1
    },
    incrementCounter(db, ref, num) {
      // Select a shard of the counter at random
      const shardId = Math.floor(Math.random() * num).toString()
      const shardRef = ref.collection('shards').doc(shardId)
      // Update count
      return shardRef.update(
        'count',
        this.$firebase.firestore.FieldValue.increment(1)
      )
    },
    async getCount(ref) {
      const result = await ref
        .collection('shards')
        .get()
        .then((snapshot) => {
          let total = 0
          snapshot.forEach((doc) => {
            total += doc.data().count
          })
          return total
        })
      this.counter = result
    }
  }
}
</script>
<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(162.58deg, #ffb7b7 3.26%, #ffb9fc 96.63%);
  background-size: cover;
  font-family: Roboto;
  font-style: normal;

  .footer {
    position: absolute;
    bottom: 0px;
    width: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    .credit {
      position: absolute;
      margin: auto;
      bottom: 20px;
      right: 0;
      left: 0;
      z-index: 50;
      text-align: center;
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      .powerdby {
        color: white;
      }
      .logo-image {
        height: 40px;
        vertical-align: text-bottom;
      }
    }
  }

  .center-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 300px;
    height: 300px;
    margin: auto;
    z-index: 50;
    .kira-button {
      margin: auto;
      width: 250px;
      .kira-image {
        width: 100%;
      }
    }
    .twit-button-area {
      margin-top: 10px;
      text-align: right;
    }
  }

  .count-area {
    padding-top: 60px;
    margin: 8px 32px 16px;
    p {
      text-align: center;
      font-weight: bold;
    }
    .allCount {
      font-size: 72px;
      line-height: 55px;
      color: white;
    }
    .iine {
      font-size: 20px;
      color: white;
    }
    .myCount {
      color: gray;
      font-size: 20px;
    }
  }

  .msg-area {
    position: relative;
    height: 200px;
    width: 300px;
    left: 50%;
    transform: translateX(-200px);
    margin: auto 0;
    .msg-box {
      position: absolute;
      z-index: 20;
      width: 250px;
      left: 10px;
      margin: auto;
      img {
        width: 100%;
      }
    }
    .msg-text {
      z-index: 30;
      position: absolute;
      left: 20px;
      top: 30px;
      width: 230px;
      height: 100px;
      p {
        font-size: 20px;
        font-weight: bold;
        color: #333;
        text-align: center;
        white-space: nowrap;
      }
    }

    .msg-image {
      position: absolute;
      top: 20px;
      left: 200px;
      z-index: 10;
      width: 320px;
      .daia {
        width: 100%;
      }
    }
  }
}
</style>
