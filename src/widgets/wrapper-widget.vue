<template>
  <b-form-group
    :label="label"
    :class="classNames"
  >
    <slot></slot>

    <div slot="feedback">
      <div v-for="feedback in feedbacks" :key="feedback">{{ feedback }}</div>
    </div>
  </b-form-group>
</template>

<script>
  export default {
    name: 'wrapper-widget',

    props: {
      label: String,
      feedbacks: Array,
      classNames: String,
    },
  }
</script>
