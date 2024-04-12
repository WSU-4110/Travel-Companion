<template>
  <button
    class="btn btn-danger"
    data-bs-toggle="modal"
    :data-bs-target="'#' + getModalId"
    :disabled="disabled">
    Delete {{ targetType }}
  </button>
  <div class="modal fade" :id="getModalId" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 v-if="!genericDelete" class="modal-title fs-5" :id="getLabelId">Delete {{ targetType }} "{{ targetName }}"?</h1>
          <h1 v-else class="modal-title fs-5" :id="getLabelId">Delete {{ targetType }}?</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div v-if="!genericDelete" class="modal-body">
          Are you sure you want to delete {{ targetType.toLowerCase() }} "{{ targetName }}"? This action <b>is not reversable</b>.
        </div>
        <div v-else class="modal-body">
          Are you sure you want to delete {{ targetType.toLowerCase() }}? This action <b>is not reversable</b>.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button @click="deleteCallback" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete {{ targetName }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDelete',
  props: {
    targetType: {type: String, required: true},
    targetName: String,
    deleteCallback: Function,
    genericDelete: Boolean | undefined,
    disabled: Boolean | undefined
  },
  computed: {
    getModalId() {
      return 'delete' + this.targetType + 'modal';
    },
    getLabelId() {
      return 'delete' + this.targetType + 'label';
    }
  }
}
</script>

<style scoped>
</style>
