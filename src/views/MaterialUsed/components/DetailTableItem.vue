<template>

  <van-cell
    class="detail-table-item"
    title-class="detail-table-item-left"
    value-class="detail-table-item-right"
  >
    <template #title>
      <img
        :src="servantId|avatar"
        class="detail-table-item-avatar"
      />
      *{{formateUsedData.total}}
    </template>
    <span>
      {{formateUsedData.details}}
    </span>
  </van-cell>
</template>

<script>
import { SERVANT } from '@/library/conf/image';
export default {
  props: {
    servantId: {
      type: Number | String,
      default: 0
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    formateUsedData() {
      return this.data
        .reduce(
          (prev, curr) => {
            let [type, perUsed, count] = curr,
              used = perUsed * count;
            if (type < 20) {
              prev[0] += used;
            } else if (type < 30) {
              prev[1] += used;
            } else {
              prev[2] += used;
            }
            prev[3] += used;
            return prev;
          },
          [0, 0, 0, 0]
        )
        .reduce(
          (prev, curr, currIdx) => {
            if (currIdx === 3) {
              prev.total = curr;
              return prev;
            }
            let map = ['灵基:', '技能:', '灵衣:'];
            if (curr) prev.details += ' ' + map[currIdx] + curr;
            return prev;
          },
          { total: 0, details: '' }
        );
    }
  },
  filters: {
    avatar(id) {
      return `${SERVANT}${id}/icon.jpg?imageMogr2/thumbnail/70/interlace/1`;
    }
  }
};
</script>

<style scoped lang="scss">
.detail-table-item {
  justify-content: space-between;
  &-avatar {
    width: 2em;
    height: 2.1em;
  }
  &-left {
    flex: none;
  }
  &-right {
    flex: none;
  }
}
</style>