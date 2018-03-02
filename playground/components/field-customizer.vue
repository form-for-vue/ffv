<template>
  <div class="card">
    <div class="card-header">{{ key }}</div>
    <div class="form-group row justify-content-around">
      <label for="field-key" class="col-2 col-form-label">key</label>
      <div class="col">
        <input class="form-control"
               type="text"
               v-model="value.key"
               :placeholder="`Enter a key for field`"
               @input="key = (value.key || value.id).slice()"
               id="field-key">
      </div>
    </div>
    <div class="form-group row justify-content-around">
      <label for="field-label" class="col-2 col-form-label">Label</label>
      <div class="col">
        <input class="form-control"
               type="text"
               v-model="value.label"
               :placeholder="`Enter a label for ${key}`"
               id="field-label">
      </div>
    </div>
    <div class="form-group row justify-content-around">
      <label for="field-description" class="col-2 col-form-label">Description</label>
      <div class="col">
        <input class="form-control"
               type="text"
               v-model="value.description"
               :placeholder="`Enter a description for ${key}`"
               id="field-description">
      </div>
    </div>
    <div class="form-group row justify-content-around">
      <label for="field-type" class="col-2 col-form-label">Type</label>
      <div class="col">
        <select class="form-control" id="field-type" v-model="value.type">
          <option value="text">Text</option>
          <option value="password">Password</option>
          <option value="textarea">Text Area</option>
          <option value="file">File</option>
          <option value="select">Select</option>
          <option value="radio">Radio</option>
          <option value="number">Number</option>
        </select>
      </div>
    </div>
    <div class="form-group row justify-content-start">
      <label for="field-required" class="col-2 col-form-label">Required</label>
      <div class="row col-1 align-items-center">
        <input class="form-control"
               type="checkbox"
               v-model="value.required"
               id="field-required">
      </div>
    </div>
    <div class="form-group row justify-content-around">
      <label for="field-size" class="col-2 col-form-label">Size</label>
      <div class="col">
        <input class="form-control"
               type="number"
               v-model="value.size"
               :placeholder="`Enter number of bootstrap columns for ${key}`"
               id="field-size">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
      }
    },
    data () {
      return {
        key: (this.value.key || this.value.id).slice(),
      }
    },
  }
</script>
