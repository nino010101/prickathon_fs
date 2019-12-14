<template>
  <div>
    <a :href="twitterUrl()" target="_blank" class="twitter-button">
      Twitterでシェアする
    </a>
  </div>
</template>

<script>
export default {
  props: {
    myCount: {
      type: Number,
      required: true,
      default: 0
    },
    totalCount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {}
  },
  mounted() {
    if (!document.getElementById('twitter-wjs')) {
      ;(function(d, s, id) {
        const fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) return
        const js = d.createElement(s)
        js.id = id
        js.src = 'https://platform.twitter.com/widgets.js'
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'twitter-wjs')
    }
  },
  methods: {
    formatByArr(msg) {
      let args = []
      for (let i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i]
      }
      args = args.map((x) => encodeURIComponent(x))
      return msg.replace(/\{(\d+)\}/g, function(m, k) {
        return args[k]
      })
    },
    twitterUrl() {
      const base =
        'https://twitter.com/intent/tweet?url={0}&text={1}&hashtags={2}'
      const url = 'https://prickathon-flower.web.app/'
      const title = `キラッとボタンを押して、${this.myCount}回ライブを応援したんだもん！合計で${this.totalCount}回応援されているんだもん！`
      const hashTag = `プリッカソン`
      return this.formatByArr(base, url, title, hashTag)
    }
  }
}
</script>
<style lang="scss" scoped>
.twitter-button {
  color: #fff;
  background-color: #e856ba;
  padding: 8px;
  text-decoration: none;
  border-radius: 3px;
}
</style>
