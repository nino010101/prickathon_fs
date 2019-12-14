<template>
  <p v-html="daiaMsg"></p>
</template>

<script>
const msgList = [
  'ボタンを押して<br>応援するんだもん！',
  'QRコードの前に<br>立ち止まらないでね！',
  'みんなのライブ、<br>楽しみなんだもん！'
]
const msgList2 = [
  'あなたのいいね、<br>受け取ったんだもん！',
  'いいねゲージ、<br>どんどん上がれー！',
  '私がみんなにいいねを<br>届けてくるんだもん！'
]
const msgList3 = [
  'あなたから、<br>すごいいいねを感じるんだもん！',
  '熱いその気持ち、<br>だいあも分かるんだもん！'
]
const msgList4 = [
  '楽屋でみらいちゃんに<br>会ったんだもん！<br>いい匂いだったもん！',
  'み゛ら゛い゛<br> ち゛ゃ゛ん゛！'
]
const msgSpeed = 4000
export default {
  props: {
    myCount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      daiaMsg: msgList[0],
      msgNum: 0,
      intervalID: null,
      msgList
    }
  },
  watch: {
    myCount(val) {
      if (val > 50) {
        this.msgList = msgList2
      }
      if (val > 100) {
        this.msgList = msgList3
      }
      if (val > 300) {
        this.msgList = msgList4
      }
    }
  },
  mounted() {
    this.intervalID = window.setInterval(() => {
      this.msgNum += 1
      if (this.msgNum === this.msgList.length) this.msgNum = 0
      this.daiaMsg = this.msgList[this.msgNum]
    }, msgSpeed)
  }
}
</script>
