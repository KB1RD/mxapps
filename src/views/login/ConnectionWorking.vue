<template>
  <b-card-text>
    <b-spinner
      v-if="!failed"
      style="width: 3rem; height: 3rem; margin: 10px 0px;"
      variant="primary"
      label="Starting core..."
    />

    <p v-if="failed">
      Failed to sign in. Is your server online and is your internet working?
    </p>

    <b-button
      block
      variant="outline-secondary"
      @click="cancel"
    >Cancel</b-button>
  </b-card-text>
</template>

<script>
import { state } from '@/worker-link'

export default {
  methods: {
    cancel () {
      this.not_cancelled = false
      const redirect_to = this.$route.query.redirect_to || '/'
      this.$router.replace({ path: '/login/', query: { redirect_to } })
    },
    onDone () {
      const path = this.$route.query.redirect_to || '/'
      this.$router.replace({ path, query: { account: this.$route.params.id } })
    }
  },
  data () {
    return {
      failed: false,
      not_cancelled: true
    }
  },
  mounted () {
    const mxbindings = state.channel.call_obj.net.kb1rd.mxbindings

    const id = this.$route.params.id
    const self = this
    ;(async function () {
      try {
        await mxbindings.v0[id].start()
        self.onDone()
      } catch (e) {
        self.failed = true
        console.error('Failed to sign in', e)
      }
    })()
  }
}
</script>
