<template>
  <router-view id="root" />
</template>

<style lang="scss">
@import '@/scss/glow';
@import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';

html, body {
  height: 100%;
}
#root {
  min-height: 100%;
}

:focus { outline:none; }
::-moz-focus-inner { border:0; }

.b-avatar {
  min-width: 2.5em;
  min-height: 2.5em;
}
</style>
