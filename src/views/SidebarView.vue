<template>
  <!-- Eventually, this UI will actually have a sidebar :P -->
  <div>
    <div v-if="show_loading" class="fullscreen-spinner-overlay">
      <b-spinner
        style="width: 3rem; height: 3rem;"
        variant="primary"
        label="Starting core..."
      />
    </div>
    <div v-if="!show_loading">
      <b-navbar toggleable="lg" type="dark" variant="dark" :sticky="true">
        <b-navbar-brand href="#">
          <SimpleSVG
            id="logo-svg"
            filepath="/logo/notepad logo.svg"
            fill="#fff"
            stroke="#fff"
            height="50px"
            style="height: 50px; margin-top: -65px;"
          />
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <b-avatar class="mr-3" badge :badge-variant="state_badge"/>
                <span>{{ state.display_name }}</span>
              </template>
              <b-dropdown-item @click="modalShow = !modalShow">
                Manage Apps
              </b-dropdown-item>
              <b-dropdown-item to="/login">
                Switch Users
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <AppListModal v-model="modalShow" :account="id"/>

      <router-view />
    </div>
  </div>
</template>

<script>
import { SimpleSVG } from 'vue-simple-svg'
import AppListModal from '@/components/apps/AppListModal'

export default {
  components: { SimpleSVG, AppListModal },
  genbind: {
    state: {
      apply: ['id'],
      address: (id) =>
        ['net', 'kb1rd', 'mxbindings', 'v0', id, 'listenUserState'],
      default: { state: 'LOADING' },
      error: { state: 'ERROR' }
    }
  },
  data () {
    return {
      modalShow: false
    }
  },
  computed: {
    id () {
      return this.$route.query.account
    },
    show_loading () {
      return this.state.state === 'LOADING' || this.state.state === 'STARTING'
    },
    state_badge () {
      return {
        ACTIVE: 'success',
        OFFLINE: 'warning',
        INACTIVE: 'info',
        STARTING: 'primary'
      }[this.state.state] || 'secondary'
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
