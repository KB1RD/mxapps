<template>
  <b-card-text>
    <b-form class="signin-form" @submit="onFormSubmit">
      <b-form-group label-for="mxid-input">
        <b-form-input
          :value="id"
          :disabled="true"
          aria-describedby="login-hs-via-info"
        />
        <b-form-text id="login-hs-via-info">Via {{ hs }}</b-form-text>
      </b-form-group>
      <b-form-group label-for="pass-input">
        <b-form-input
          id="pass-input"
          v-model="pass"
          :disabled="is_busy"
          type="password"
          required
          placeholder="Password"
          :state="error_msg ? false : undefined"
          :aria-describedby="error_msg ? 'login-password-error' : ''"
        />
        <b-form-invalid-feedback v-if="error_msg" id="login-password-error">
          {{ error_msg }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" block variant="primary" :disabled="is_busy">
        <b-spinner v-if="is_busy" small />
        {{ is_busy ? 'Signing In...' : 'Sign In' }}
      </b-button>
    </b-form>

    <b-button block variant="outline-secondary" @click="cancel">
      Cancel
    </b-button>
  </b-card-text>
</template>

<script>
import { state } from '@/worker-link'

export default {
  data () {
    return {
      pass: '',
      is_busy: false,
      error_msg: undefined,
      not_cancelled: true
    }
  },
  watch: {
    pass () {
      this.error_msg = undefined
    }
  },
  computed: {
    id () {
      return this.$route.query?.mxid || ''
    },
    hs () {
      return this.$route.query?.hs || ''
    }
  },
  methods: {
    cancel () {
      this.not_cancelled = false
      const redirect_to = this.$route.query.redirect_to || '/'
      this.$router.push({ path: '/login/', query: { redirect_to } })
    },
    redirectLoginTo (id) {
      const redirect_to = this.$route.query.redirect_to || '/'
      this.$router.replace({ path: `/login/to/${id}`, query: { redirect_to } })
    },

    onFormSubmit (e) {
      e.preventDefault()
      const mxbindings = state.channel.call_obj.net.kb1rd.mxbindings

      const pass = this.pass
      const self = this
      ;(async function () {
        self.is_busy = true
        try {
          const id = await mxbindings.v0.fromPass[self.id](pass, self.hs)
          self.is_busy = true
          if (self.not_cancelled) {
            self.redirectLoginTo(id)
          }
        } catch (e) {
          switch (e.name) {
            case 'M_FORBIDDEN':
              self.error_msg = 'Invalid username or password'
              console.error('Password invalid')
              break
            default:
              self.error_msg = 'Unknown error signing in'
              console.error('Unknown error', e)
              break
          }
          self.is_busy = false
        }
      })()
    }
  }
}
</script>

<style scoped>
  .signin-form {
    margin: 10px 0px;
  }
</style>
