<template>
  <b-list-group-item
    class="d-flex align-items-center ellipsis-flex-overflow"
    :to="`/login/to/${id}`"
  >
    <template v-if="loaded">
      <b-avatar class="mr-3" badge :badge-variant="state_badge"/>
      <span class="mr-auto">{{ this.astate.display_name }}</span>
    </template>
    <template v-else-if="loading">
      <b-avatar class="mr-3"/>
      <span class="text-loading"></span>
    </template>
    <template v-else-if="unauth">
      <b-avatar class="mr-3" variant="warning" text="?"/>
      <span class="mr-auto">Account is not signed in using Matrix.</span>
    </template>
    <template v-else-if="error">
      <b-avatar class="mr-3" variant="danger"/>
      <span class="mr-auto">Internal error</span>
    </template>
  </b-list-group-item>
</template>

<script>
import { state } from '@/worker-link'

export default {
  props: {
    id: String
  },
  genbind: {
    astate: {
      apply: ['id'],
      address: (id) =>
        ['net', 'kb1rd', 'mxbindings', 'v0', id, 'listenUserState'],
      default: []
    }
  },
  data () {
    return {
      workerstate: state,
      astate: {
        state: 'LOADING'
      }
    }
  },
  methods: {
    redirectSigninAccount () {
      const redirect_to = this.$route.query.redirect_to || '/'
      this.$router.push({ path: '/login/new', query: { redirect_to } })
    }
  },
  computed: {
    state_badge () {
      return {
        ACTIVE: 'success',
        OFFLINE: 'warning',
        INACTIVE: 'info',
        STARTING: 'primary'
      }[this.astate.state] || 'secondary'
    },
    loaded () {
      return (
        this.astate.state !== 'LOADING' &&
        this.astate.state !== 'ERROR' &&
        this.astate.state !== 'UNAUTHENTICATED'
      )
    },
    error () {
      return this.astate.state === 'ERROR'
    },
    loading () {
      return this.astate.state === 'LOADING'
    },
    unauth () {
      return this.astate.state === 'UNAUTHENTICATED'
    }
  }
}
</script>

<style scoped>
  .ellipsis-flex-overflow {
    overflow: hidden;
  }
  .ellipsis-flex-overflow > * {
    overflow: hidden;
    /* https://stackoverflow.com/a/26535469/7853604 */
    /**
     * Still, the bootstrap avatar is squishing.
     */
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ellipsis-flex-overflow > .b-avatar {
    overflow: visible;
    min-width: 2.5em;
    min-height: 2.5em;
  }
  @keyframes loading-fade {
    from { opacity: 0.3; }
    50% { opacity: 0.5; }
    to { opacity: 0.3; }
  }
  .text-loading {
    animation: loading-fade 2s infinite;
    background-color: rgb(127, 127, 127);
    height: 15px;
    flex-grow: 1;
  }
</style>
