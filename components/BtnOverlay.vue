<template>
  <img class="kira-overlay" src="~/assets/kira.png" />
</template>
<script>
import anime from 'animejs/lib/anime.es'
export default {
  mounted() {
    anime({
      targets: ['.kira-overlay'],
      easing: 'easeOutQuint',
      autoplay: true,
      duration: 1000, // 1.2s
      opacity: 0,
      scale: 1.1
    })
    setInterval(() => {
      this.$emit('iineDone')
    }, 1000)
  }
}
</script>
