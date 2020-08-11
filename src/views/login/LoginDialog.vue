<template>
  <div class="gradient-container">
    <SimpleSVG
      id="logo-svg"
      filepath="/logo/notepad logo.svg"
      fill="#fff"
      stroke="#fff"
    />
    <b-card id="signin-dialog" title="Sign In">
      <b-card-text v-if="workerstate.failed">
        Failed to start core. Make sure your browser can support either service
        or shared workers.
      </b-card-text>
      <b-card-text v-else-if="!workerstate.active">
        <b-spinner
          style="width: 3rem; height: 3rem;"
          variant="primary"
          label="Starting core..."
        />
      </b-card-text>

      <router-view v-else/>
    </b-card>
  </div>
</template>

<script>
import { SimpleSVG } from 'vue-simple-svg'

import { state } from '@/worker-link'

export default {
  components: { SimpleSVG },
  data () {
    return {
      workerstate: state
    }
  }
}
</script>

<style>
.gradient-container {
  width: 100%;
  min-height: 100%;

  background-image: linear-gradient(
    170deg,
    #2c4be8 0%,
    #352ce8 60%,
    #d52ce8 150%
  );

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#signin-dialog {
  margin: 10px;

  width: 100%;
  max-width: 300px;

  text-align: center;

  border-radius: 10px;
  box-shadow: 0px 0px 20px #fff7;
}

#logo-svg {
  max-width: 300px;
  margin: 40px 10px;
  filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.5));
}
</style>
