<template>
    <div class="passive-skill-item">
        <img :src="skillIcon" alt="" class="passive-skill-item-icon">
        <div class="passive-skill-item-name">
            {{data.skillName}}{{data.rank?'['+data.rank+'] ':' '}}
        </div>
        <div class="passive-skill-item-effect">{{data.skillDesc}}</div>
    </div>
</template>

<script>
import { BASE_URL } from '@/conf/image';
export default {
  computed: {
    skillIcon() {
      return BASE_URL + this.data.imgPath;
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

<style scoped lang="scss">
.passive-skill-item {
  position: relative;
  height: 54px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  padding: 0 4px 0 64px;

  &:not(:last-of-type) {
    padding: 0 4px 16px 64px;
    background: linear-gradient(90deg, var(--border-color), var(--border-color))
      right bottom 8px / calc(100% - 64px) 1px no-repeat;
  }
  &-icon {
    width: 54px;
    position: absolute;
    left: 0;
    top: 0;
  }
  &-name {
    display: flex;
    align-items: center;
    font-size: 16px;
    flex-grow: 1;
  }
  .passive-skill-item-effect {
    font-size: 12px;
    line-height: 1.2; 
    color: var(--info-color);
    flex-grow: 1;
  }
}
</style>