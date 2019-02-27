<template>
  <div class="detail-table">
    <div class="detail-table-header">
      <slot name="header">
        {{data.name}}*{{data.count}}
      </slot>
    </div>
    <van-cell-group
      :border="false"
      class="detail-table-list"
    >
      <detail-table-item
        v-for="(item,servantId) in data.state"
        :data="item"
        :servantId="servantId"
        :key="servantId"
      />
    </van-cell-group>
    <div class="detail-table-footer">
      <slot name="footer">

      </slot>
    </div>
  </div>
</template>

<script>
import DetailTableItem from './DetailTableItem';
export default {
  components: {
    DetailTableItem
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          count: 0,
          imgPath: '',
          materialId: 0,
          name: '',
          state: {},
          type: ''
        };
      }
    }
  }
};
</script>

<style scoped lang="scss">
.detail-table {
  width: 80vw;
  height: 60vh;
  &-header {
    text-align: center;
    color: var(--muted-color);
    line-height: 2.4em;
    border-bottom: 1px solid var(--border-color);
  }
  &-list {
    height: calc(100% - 2.4em);
    overflow: auto;
  }
}
</style>