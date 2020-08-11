<template>
  <b-card-text>
    Software written by Matrix users like you. Check it out on
    <a href="https://github.com/KB1RD/matrix-notepad">GitHub</a> and come
    chat on
    <a
      href="https://matrix.to/#/#matrix-collaboration:kb1rd.net?via=kb1rd.net&via=matrix.org&via=matrix.geklautecloud.de"
    >
      #matrix-collaboration:kb1rd.net.
    </a>
    <b-list-group class="account-list-group">
      <AccountOption v-for="a in accounts" :key="a" :id="a" />
    </b-list-group>
    <b-button
      block
      variant="outline-primary"
      @click="redirectNewAccount"
    >+ Add an account</b-button>
  </b-card-text>
</template>

<script>
import AccountOption from '@/components/login/AccountOption'

export default {
  components: { AccountOption },
  genbind: {
    accounts: {
      address: ['net', 'kb1rd', 'accounts', 'v0', 'listenAccounts'],
      default: []
    }
  },
  methods: {
    redirectNewAccount () {
      const redirect_to = this.$route.query.redirect_to || '/'
      this.$router.push({ path: '/login/new', query: { redirect_to } })
    }
  }
}
</script>

<style scoped>
  .account-list-group {
    margin: 10px 0px;
  }
</style>
