<template>
  <div>
    <div v-if="show_loading" class="fullscreen-spinner-overlay">
      <b-spinner
        style="width: 3rem; height: 3rem;"
        variant="primary"
        label="Starting core..."
      />
    </div>
    <router-view v-if="!show_loading" />
  </div>
</template>

<script>
export default {
  genbind: {
    state: {
      apply: ['id'],
      address: (id) =>
        ['net', 'kb1rd', 'mxbindings', 'v0', id, 'listenUserState'],
      default: { state: 'LOADING' },
      error: { state: 'ERROR' }
    }
  },
  computed: {
    id () {
      return this.$route.query.account
    },
    show_loading () {
      return this.state.state === 'LOADING' || this.state.state === 'STARTING'
    }
  },
  watch: {
    state () {
      if (
        this.state.state === 'ERROR' ||
        this.state.state === 'UNAUTHENTICATED' ||
        this.state.state === 'INACTIVE'
      ) {
        const redirect_to = this.$route.path
        this.$router.replace({ path: '/login', query: { redirect_to } })
      }
    }
  }
}
</script>

<style scoped>
  .fullscreen-spinner-overlay {
    background-color: rgb(255, 255, 255);
    position: absolute;

    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
