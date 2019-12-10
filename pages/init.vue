<template>
  <div class="main-container">
    <div class="kira-button"></div>
    <div class="count">
      {{ counter }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 0,
      db: null
    }
  },
  mounted() {
    this.db = this.$firebase.firestore()
    const ref = this.db.collection('counter').doc('fscount')
    this.createCounter(ref, 10)
  },
  methods: {
    createCounter(ref, numShard) {
      const batch = this.db.batch()
      // Initialize the counter document
      batch.set(ref, { numShard })
      // Initialize each shard with count=0
      for (let i = 0; i < numShard; i++) {
        const shardRef = ref.collection('shards').doc(i.toString())
        batch.set(shardRef, { count: 0 })
      }
      // Commit the write batch
      return batch.commit()
    }
  }
}
</script>
