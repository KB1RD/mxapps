<template>
  <b-list-group-item
    class="d-flex flex-column justify-items-center ellipsis-flex-overflow"
  >
    <b>{{ id }}</b>
    <b-spinner
      v-if="app === 'LOADING'"
      style="width: 1rem; height: 1rem;"
      variant="primary"
      label="Loading..."
    />
    <div v-else class="d-flex flex-row align-items-center ml-2 mt-2">
      <b-avatar class="mr-3"><BIconBox /></b-avatar>
      <small>{{ app.title }}</small>
      <b-button
        class="ml-auto circle-btn"
        pill
        variant="outline-danger"
        :disabled="busy"
        @click="clear"
      >
        <b-spinner v-if="busy" small />
        <BIconX v-else />
      </b-button>
    </div>
  </b-list-group-item>
</template>

<script>
import { state } from '@/worker-link'
import { BIconBox, BIconX } from 'bootstrap-vue'

export default {
  components: { BIconBox, BIconX },
  props: {
    account: String,
    id: String,
    assoc: Object
  },
  genbind: {
    app: {
      apply: ['account', 'assoc'],
      address: (ac, assoc) =>
        ['net', 'kb1rd', 'apps', 'v0', ac, 'userapp', assoc.to, 'listen'],
      default: 'LOADING'
    }
  },
  data () {
    return { busy: false }
  },
  methods: {
    clear () {
      const promise = state.channel.call_obj.net.kb1rd.apps
        .v0[this.account]
        .assoc[this.id]
        .set(undefined)
      this.busy = true
      promise.then(
        () => {
          this.$bvModal.msgBoxOk('The association was removed.', {
            title: 'Association Removed',
            okVariant: 'success',
            centered: true
          })
        },
        (e) => {
          this.$bvModal.msgBoxOk(
            'An error occured while trying to remove the assocation.',
            {
              title: 'Error',
              okVariant: 'danger',
              centered: true
            }
          )
          console.error('Failed remove association', e)
        }
      ).then(() => (this.busy = false))
    }
  }
}
</script>
