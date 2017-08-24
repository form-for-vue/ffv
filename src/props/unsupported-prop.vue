<template>
  <div>
    Unsupported prop schema {{ JSON.stringify(schema, null, 2) }}.
  </div>
</template>

<script>
  export default {
    props: {
      schema: Object
    }
  }
</script>
