<template>
  <div class="skill-tab">
    <div class="skills">
      <skill-item v-for="(item, index) in data.skill" :key="index" :data="item"></skill-item>
    </div>
    <div class="passive-skills">
      <passive-skill-item v-for="(item, index) in data.passiveSkill" :key="index" :data="item"></passive-skill-item>
    </div>
  </div>
</template>

<script>
import { BASE_URL } from '@/conf/image';
import SkillItem from './SkillItem';
import PassiveSkillItem from './PassiveSkillItem';
export default {
  data() {
    return {
      imgBase: BASE_URL
    };
  },
  components: {
    SkillItem,
    PassiveSkillItem
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          skill: [],
          passiveSkill: []
        };
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.passive-skills {
  padding: 8px 0 8px 4px;
  border: 1px solid var(--border-color);
}
</style>