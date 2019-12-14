<template>
  <div class="full-height">
    <!-- SPで見た時 -->
    <template v-if="$device.isMobile">
      <div class="main-container">
        <!-- header -->
        <div class="header">
          <div class="head-logo">
            <a href="https://prickathon.github.io/" target="_blank">
              <img class="logo-image" src="~/assets/plb.png" />
            </a>
          </div>
        </div>
        <!-- キラッとボタン -->
        <div @click="addCount" class="kira-button">
          <img class="kira-image" src="~/assets/kira.png" />
        </div>
        <div class="count-area">
          <p class="myCount">{{ myCounter }}回応援したよ！</p>
          <p class="allCount">全部で{{ counter }}回応援されてるよ！</p>
        </div>
        <div class="twit-button-area">
          <TwitterShare :myCount="myCounter" :totalCount="counter" />
        </div>
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
  height: auto;
  background-image: linear-gradient(
    -225deg,
    #e3fdf5 0%,
    #ffe6fa 56%,
    #ffbac3 100%
  );
  background-size: cover;

  .header {
    background-color: #fff;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    .head-logo {
      height: 36px;
      .logo-image {
        height: 100%;
      }
    }
  }

  .kira-button {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    width: 100vw;
    .kira-image {
      max-width: 500px;
      width: 100%;
    }
  }

  .count-area {
    margin: 8px 32px 16px;
    .myCount {
      text-align: center;
      font-weight: bold;
      font-size: 2rem;
    }
    .allCount {
      margin-top: 4px;
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;
    }
  }

  .twit-button-area {
    width: 100vw;
    display: flex;
    justify-content: center;
    margin: 16px 0px;
  }

  .msg-area {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 50vh;
    margin: auto;
    .msg-box {
      z-index: 20;
      position: absolute;
      width: 95vw;
      left: 3%;
      img {
        width: 100%;
      }
    }
    .msg-text {
      z-index: 30;
      position: absolute;
      width: 80vw;
      font-size: 2rem;
      left: 10%;
      top: 9%;
      font-weight: bold;
      p {
        color: #333;
        text-align: center;
        white-space: nowrap;
      }
    }

    .msg-image {
      right: -30%;
      bottom: -22%;
      z-index: 10;
      position: absolute;
      width: 100vw;
      .daia {
        width: 100%;
      }
    }
  }
}
</style>
