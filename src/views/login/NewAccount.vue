<template>
  <b-card-text>
    <b-form class="signin-form" @submit="onFormSubmit">
      <b-form-group label-for="mxid-input">
        <b-form-input
          id="mxid-input"
          v-model="form.id"
          :disabled="is_busy"
          :state="id_valid && (lookup_error_msg ? false : undefined)"
          required
          placeholder="@name:server.org"
          @input="onUserIdChange"
          :aria-describedby="lookup_error_msg ? 'login-mxid-error' : ''"
        />
        <b-form-invalid-feedback v-if="lookup_error_msg" id="login-mxid-error">
          {{ lookup_error_msg }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group>
        <b-form-checkbox v-model="form.checked" :disabled="is_busy">
          Infer homeserver URL
        </b-form-checkbox>
      </b-form-group>
      <transition name="hs-url">
        <div v-if="!form.checked" class="hs-url">
          <b-form-group label-for="mxid-input">
            <b-form-input
              id="mxid-input"
              v-model="form.url"
              :required="!form.checked"
              :disabled="is_busy"
              placeholder="https://matrix.server.org"
            />
          </b-form-group>
        </div>
      </transition>
      <b-alert
        :show="!form.checked && form.url.toLowerCase().startsWith('http:')"
        variant="warning"
      >
        Warning: This server address is using insecure HTTP. You should always
        use HTTPS to connect to your server. HTTP support is for development
        and testing purposes only.
      </b-alert>

      <b-button type="submit" block variant="primary" :disabled="is_busy">
        <b-spinner v-if="is_busy" small />
        {{ is_busy ? 'Loading...' : 'Next' }}
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
      form: {
        id: '',
        checked: true,
        url: ''
      },
      infer_hs: true,
      is_busy: false,
      not_cancelled: true,
      lookup_error_msg: undefined
    }
  },
  computed: {
    id_valid  () {
      const res = /^[@][^@:]*:[^@:]*(:[0-9]+)?$/gm.exec(this.form.id)
      return this.form.id.length ? (res && res.index === 0) || false : undefined
    }
  },
  watch: {
    form: {
      deep: true,
      handler () {
        // Clear when the user updates the form
        this.lookup_error_msg = undefined
      }
    }
  },
  methods: {
    cancel () {
      this.not_cancelled = false
      const redirect_to = this.$route.query.redirect_to || '/'
      this.$router.push({ path: '/login/', query: { redirect_to } })
    },
    redirectPassAuth (mxid, hs) {
      const redirect_to = this.$route.query.redirect_to || '/'
      this.$router.push({
        path: '/login/pass',
        query: { redirect_to, mxid, hs }
      })
    },

    onUserIdChange () {
      if (this.form.id.length) {
        while (this.form.id.lastIndexOf('@') > 0) {
          this.form.id =
            this.form.id.slice(0, this.form.id.lastIndexOf('@')) +
            ':' +
            this.form.id.slice(
              this.form.id.lastIndexOf('@') + 1,
              this.form.id.length
            )
        }
        if (!this.form.id.startsWith('@')) {
          this.form.id = '@' + this.form.id
        }
      }
    },

    onFormSubmit (e) {
      e.preventDefault()
      if (!this.id_valid) {
        return
      }
      const mxbindings = state.channel.call_obj.net.kb1rd.mxbindings

      const { id, url, checked } = this.form
      const self = this
      ;(async function () {
        let true_url = url
        if (checked) {
          self.is_busy = true
          try {
            true_url = await mxbindings.v0.getHsUrl[id]()
            self.is_busy = false
          } catch (e) {
            self.is_busy = false
            console.error('Failed to run .well-known discovery', e)
            self.lookup_error_msg = 'Failed to auto-discover homeserver URL'
            return
          }
        }
        if (self.not_cancelled) {
          self.redirectPassAuth(id, true_url)
        }
      })()
    }
  }
}
</script>

<style scoped>
  .hs-url {
    height: 64px;
  }
  .hs-url-enter-active, .hs-url-leave-active {
    transition: height 0.5s, opacity 0.3s;
    height: 64px;
    opacity: 1;
  }
  .hs-url-enter, .hs-url-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0px;
    opacity: 0;
  }
  .signin-form {
    margin: 10px 0px;
  }
</style>
