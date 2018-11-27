<template>
  <div class="skill-tab">
    <div class="skills">
      <skill-item v-for="(item, index) in data.skill" :key="index" :data="item" v-model="value_copy[index]" @input="handleInput" @clickIcon="clickSkillIcon"></skill-item>
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
      imgBase: BASE_URL,
      value_copy: []
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
    },
    value: {
      type: Array,
      default() {
        return [1, 1, 1];
      }
    }
  },
  created() {
    this.value_copy = this.value.slice();
  },
  methods: {
    clickSkillIcon(ev) {
      this.$emit('clickSkillIcon', ev);
    },
    handleInput(val) {
      this.$emit('input', this.value_copy);
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