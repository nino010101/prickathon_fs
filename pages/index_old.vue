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
          <BtnOverlay
            v-if="onCountFlg"
            @iineDone="onCountFlg = false"
            class="kira-ovl"
          />
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
            <DaiaMsg :myCount="myCounter" />
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
import DaiaMsg from '~/components/DaiaMsg'
import BtnOverlay from '~/components/BtnOverlay'
const SHARD_NUM = 20
/* eslint-disable no-console */
export default {
  components: {
    TwitterShare,
    DaiaMsg,
    BtnOverlay
  },
  data() {
    return {
      myCounter: 0,
      counter: 0,
      db: null,
      ref: null,
      onCountFlg: false
    }
  },
  mounted() {
    this.db = this.$firebase.firestore()
    this.ref = this.db.collection('counter').doc('fscount')
    this.getCount(this.ref)
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
      if (this.onCountFlg) {
        this.onCountFlg = false
      }
      this.incrementCounter(this.db, this.ref, SHARD_NUM)
      this.myCounter += 1
      this.$nextTick(() => {
        this.onCountFlg = true
      })
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
      z-index: 60;
      width: 90vw;
      max-width: 500px;
      height: 90vw;
      max-height: 500px;
    }
    .kira-ovl {
      z-index: 55;
      position: absolute;
      width: 90vw;
      max-width: 500px;
      height: 90vw;
      max-height: 500px;
    }
  }

  .count-area {
    margin: 8px 32px 16px;
    .myCount {
      text-align: center;
      font-weight: bold;
      font-size: 2.8rem;
    }
    .allCount {
      margin-top: 4px;
      text-align: center;
      font-weight: bold;
      font-size: 1.6rem;
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
      max-width: 375px;
      left: 0;
      right: 0;
      margin: auto;
      img {
        width: 100%;
      }
    }
    .msg-text {
      z-index: 30;
      position: absolute;
      width: 80vw;
      height: calc(80vw * 8 / 15);
      max-width: 340px;
      max-height: 190px;
      font-size: 2.8rem;
      left: 0;
      right: 0;
      top: 0;
      margin: auto;
      font-weight: bold;
      p {
        color: #333;
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
      }
    }

    .msg-image {
      left: 130px;
      right: 0;
      margin: auto;
      top: 120px;
      z-index: 10;
      position: absolute;
      width: 100vw;
      max-width: 400px;
      .daia {
        width: 100%;
      }
    }
  }
}
</style>
