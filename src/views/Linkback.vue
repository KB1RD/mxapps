<template><div/></template>

<script>
import { state } from '@/worker-link'

export default {
  data () {
    return state
  },
  watch: {
    active () {
      if (this.active) {
        const { token } = this.$route.params
        const promise = state.channel.call_obj.net.kb1rd.apps.v0
          .redeemToken[token]()
        promise.then(
          (d) => window.parent.postMessage(['ctx', d, null], '*', [d.port]),
          (e) => window.parent.postMessage(['ctx', null, e], '*')
        )
      }
    }
  }
}
</script>
