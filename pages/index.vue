<template>
  <div>
    <!-- SPで見た時 -->
    <template v-if="$device.isMobile && isVertical">
      <div class="main-container">
        <div class="count-area">
          <p class="allCount">{{ counter }}</p>
          <p class="iine">いいね</p>
          <p class="myCount">{{ myCounter }}回応援したよ！</p>
        </div>
        <div class="center-content">
          <!-- キラッとボタン -->
          <div @click.prevent="addCount" class="kira-button">
            <img class="kira-image" src="~/assets/kira.png" />
            <BtnOverlay
              v-if="onCountFlg"
              @iineDone="onCountFlg = false"
              class="kira-ovl"
            />
          </div>
          <!--
          <div class="twit-button-area">
            <TwitterShare :myCount="myCounter" :totalCount="counter" />
          </div>
          -->
        </div>
        <!-- footer -->
        <div class="footer">
          <div class="msg-area">
            <div class="msg-text">
              <DaiaMsg :myCount="myCounter" />
            </div>
            <div class="msg-box">
              <img class="box-image" src="~/assets/msgbox.png" />
            </div>
            <div class="msg-image">
              <img class="daia" src="~/assets/daia.png" />
            </div>
          </div>
          <div class="twit-button-area">
            <TwitterShare :myCount="myCounter" :totalCount="counter" />
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
        スマートフォンを縦画面にして見てね
      </div>
    </template>
  </div>
</template>

<script>
import BtnOverlay from '~/components/BtnOverlay'
import TwitterShare from '~/components/TwitterShare'
import DaiaMsg from '~/components/DaiaMsg'
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
      isVertical: true,
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
    window.addEventListener('resize', this.handleResize)
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
    },
    handleResize() {
      this.isVertical = window.innerHeight > window.innerWidth
    }
  }
}
</script>
<style lang="scss" scoped>
.main-container {
  position: relative;
  width: 100%;
  min-height: 640px;
  height: 100vh;
  background-image: linear-gradient(162deg, #ffb7b7 4%, #ffb9fc 96%);
  background-size: cover;

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    .twit-button-area {
      width: 100%;
      position: absolute;
      text-align: center;
      bottom: 64px;
      left: -72px;
    }
    .credit {
      position: absolute;
      margin: auto;
      bottom: 20px;
      right: 0;
      left: 0;
      z-index: 50;
      text-align: center;
      font-weight: bold;
      font-size: 2.4rem;
      line-height: 2.8rem;
      .powerdby {
        color: white;
      }
      .logo-image {
        height: 40px;
        vertical-align: text-bottom;
      }
    }
  }

  /*
  @media (min-height: 640px) {
    .footer {
      height: calc(100vh - 472px);
    }
  }

  @media (max-height: 639px) {
    .footer {
      height: calc(640px - 472px);
    }
  }
  */

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
      display: flex;
      margin: auto;
      width: 250px;
      .kira-image {
        z-index: 60;
        width: 250px;
        height: 250px;
      }
      .kira-ovl {
        z-index: 50;
        width: 250px;
        height: 250px;
        position: absolute;
      }
    }
    .twit-button-area {
      margin-top: 10px;
      text-align: right;
    }
  }

  .count-area {
    padding-top: 48px;
    height: 172px;
    p {
      text-align: center;
      font-weight: bold;
    }
    .allCount {
      font-size: 6.4rem;
      line-height: 6.4rem;
      color: #fff;
    }
    .iine {
      font-size: 2rem;
      color: #fff;
    }
    .myCount {
      color: gray;
      font-size: 2rem;
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
      left: 30px;
      margin: auto;
      img {
        width: 100%;
      }
    }
    .msg-text {
      z-index: 30;
      position: absolute;
      left: 40px;
      top: 10px;
      width: 240px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        font-size: 1.8rem;
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
