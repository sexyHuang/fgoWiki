<template>
  <div class="treasure-calc">
    <van-collapse
      v-model="activeName"
      accordion
    >
      <van-cell
        is-link
        @click="showEnemyPicker('enemy','敌对目标')"
        center
        class="main-cell"
      >
        <div slot="title">敌对目标</div>
        <img
          :src="img_base+enemy.imgPath+small_pic"
          alt=""
          v-if="enemy.imgPath"
          class="avatar"
        >

        <span class="sub-text">
          {{enemy.name||'未选择'}}
        </span>
      </van-cell>
      <van-collapse-item name="1">
        <div
          slot="title"
          class="collapse-title"
        ><span class="main-text">附加BUFF</span>
          <span class="sub-text dot-1">{{extra_buff_abstract}}</span>
        </div>
        <van-switch-cell
          v-model="custom_mode"
          title="自定义模式"
          size="20px"
          class="van-hairline"
        />
        <template v-if="!custom_mode">
          <van-cell
            is-link
            title="拐配置"
            @click="onNormalPickerShow('extra_buffs.support',support_column,'拐配置')"
          >
            <span class="sub-text">{{support_abstract}}</span>
          </van-cell>
          <van-cell
            is-link
            title="衣服"
            @click="onNormalPickerShow('extra_buffs.clothes',clothes_column,'拐配置')"
          >
            <span class="sub-text">{{extra_buffs.clothes.name||'无'}}</span>
          </van-cell>
          <van-cell
            is-link
            title="礼装"
            @click="onNormalPickerShow('extra_buffs.craft_essence',ce_column,'拐配置')"
          >
            <span class="sub-text">{{extra_buffs.craft_essence.name||'无'}}</span>
          </van-cell>

        </template>

        <van-field
          pattern="\d*"
          :value="extra_buffs.costom.value.atk"
          @input="InputHandler($event,`extra_buffs.costom.value.atk`)"
          label="ATK"
          input-align="right"
          type="number"
          icon="edit"
          max="2400"
        />
        <template v-if="custom_mode">

          <van-field
            pattern="\d*"
            :value="extra_buffs.costom.value[item[0]]"
            @input="InputHandler($event,`extra_buffs.costom.value.${item[0]}`)"
            :label="item[1]"
            input-align="right"
            type="number"
            icon="edit"
            max="100"
            v-for="(item, index) in costom_column"
            :key="index"
          />

        </template>
      </van-collapse-item>
      <van-collapse-item name="2">
        <div
          slot="title"
          class="collapse-title"
        >
          <span class="main-text">从者设定<van-checkbox
              v-model="noSkill"
              @click.native.stop
            >不开技能</van-checkbox></span>
          <span>
            <img
              :src="img_base+servant.imgPath+small_pic"
              alt=""
              v-if="servant.imgPath"
              class="avatar"
            >
            <span class="sub-text">{{servant_setting_abstract}}</span>
          </span>

        </div>

        <van-switch-cell
          v-model="appoint_servant"
          title="指定英灵"
          size="20px"
          class="van-hairline"
        />
        <template v-if="appoint_servant">
          <van-cell
            is-link
            title="宝具等级"
            @click="showNormalPicker('servant_setting.treasure_lv',lvs,'宝具等级')"
          >
            <span class="sub-text">{{servant_setting.treasure_lv}}宝</span>
          </van-cell>
          <van-cell
            is-link
            title="OC"
            @click="showNormalPicker('servant_setting.treasure_oc',lvs,'宝具OC')"
          >
            <span class="sub-text">{{servant_setting.treasure_oc}}00%</span>
          </van-cell>
          <van-cell
            is-link
            @click="onNormalPickerShow('servant_setting.skill_lvs',skill_options,'技能等级')"
            v-show="!noSkill"
          >
            <span slot="title">
              <span>技能等级</span>
              <van-button
                size="mini"
                style="margin-left:0.6em; width: 3em;"
                round
                @click.stop="InputHandler([10,10,10],'servant_setting.skill_lvs')"
              >310</van-button>
            </span>
            <span class="sub-text">{{servant_setting.skill_lvs.join('/')}}</span>
          </van-cell>
          <van-cell
            is-link
            @click="showServantPicker('servant','从者')"
            center
            class="main-cell"
          >
            <div slot="title">从者</div>
            <img
              :src="img_base+servant.imgPath+small_pic"
              alt=""
              v-if="servant.imgPath"
              class="avatar"
            >

            <span class="sub-text">
              {{servant.name||'未选择'}}
            </span>
          </van-cell>
        </template>
        <template v-else>
          <van-cell
            is-link
            title="4星-宝具等级"
            @click="showNormalPicker('servant_setting.sr_treasure_lv',lvs,'宝具等级')"
          >
            <span class="sub-text">{{servant_setting.sr_treasure_lv}}宝</span>
          </van-cell>
          <van-cell
            is-link
            title="5星-宝具等级"
            @click="showNormalPicker('servant_setting.ssr_treasure_lv',lvs,'宝具等级')"
          >
            <span class="sub-text">{{servant_setting.ssr_treasure_lv}}宝</span>
          </van-cell>
          <van-cell
            is-link
            title="OC"
            @click="showNormalPicker('servant_setting.treasure_oc',lvs,'宝具OC')"
          >
            <span class="sub-text">{{servant_setting.treasure_oc}}00%</span>
          </van-cell>
          <van-cell title="技能等级">
            <van-radio-group v-model="servant_setting.skill_mode">
              <van-radio name="2">按当前练度</van-radio>
              <van-radio name="1">310</van-radio>
            </van-radio-group>
          </van-cell>
          <van-cell title="3星&活动英灵5宝"></van-cell>
        </template>
      </van-collapse-item>
    </van-collapse>

    <van-button
      block
      type="primary"
      @click="calc"
    >计算</van-button>
    <van-collapse
      v-model="dactiveName"
      accordion
    >
      <van-cell v-show="damage_list.length>0&&!appoint_servant">
        <van-radio-group v-model="effectType">
          <van-radio name="1">光炮</van-radio>
          <van-radio name="2">单体</van-radio>
        </van-radio-group>
      </van-cell>
      <van-collapse-item
        v-for="({servant,damage,buffs,treaEffect}, index) in damage_list"
        :key="index"
        :name="index"
        v-show="appoint_servant||effectType == treaEffect"
      >
        <div
          slot="title"
          class="collapse-title"
        >
          <span>
            <img
              :src="img_base+servant.imgPath+small_pic"
              alt=""
              v-show="servant.imgPath"
              class="avatar"
            >
            {{damage.min}}~{{damage.max}} 平均伤害：{{damage.avg}}
          </span>

        </div>
        <van-cell>
          <div slot="title">ATK{{buffs.atk}}</div>
          攻击提升{{buffs.atk_buff|percentage}}
        </van-cell>
        <van-cell>
          <div slot="title">{{treaEffect==2?'单体':'光炮'}}</div>
          宝具倍率{{buffs.treasure_rate|percentage}} 宝具提升{{buffs.trea_buff|percentage}}
        </van-cell>
        <van-cell>
          <div slot="title"><img
              style="height: 0.5rem;"
              :src="img_base+'/fgo/'+buffs.treasure_type+'.png'"
              alt=""
            ></div>
          性能提升{{buffs.card_buff|percentage}}
        </van-cell>
        <van-cell>
          <div slot="title">职阶补正{{buffs.class_fix}}</div>
          职阶克制{{buffs.class_comp_fix}} 阵营克制{{buffs.party_fix}}
        </van-cell>
        <van-cell>
          <div slot="title">特攻</div>
          技能{{buffs.extra_damage|percentage}} 宝具{{buffs.trea_extra_damage|percentage}}
        </van-cell>
      </van-collapse-item>
    </van-collapse>
    <van-popup
      v-model="picker_show"
      position="bottom"
    >
      <muti-picker
        :picker_styles="picker_styles"
        :c_data='picking_columns'
        @confirm="onConfirm"
        @cancel="onCancel"
        :defaultIndex="default_index"
        :title="picker_title"
      ></muti-picker>
    </van-popup>
    <van-popup
      v-model="normal_picker.show"
      position="bottom"
    >
      <van-picker
        ref="normal_picker"
        :columns="normal_picker.columns"
        valueKey="name"
        show-toolbar
        :title="normal_picker.title"
        @confirm="onNormalPickerConfirm"
        @cancel="onNormalPickerCancel"
      />
    </van-popup>
  </div>
</template>

<script>
let picker_buff = {};
let enemy_list,
  servant_list,
  skill_setting = [1, 1, 1];
import MutiPicker from '@/components/MutiPicker';
import {
  ENEMY_PICKER_MODEL,
  SUPPORT,
  CRAFT_CSSENCE,
  CLOTHES
} from './conf';
import { BASE_URL } from '@/library/conf/image';
import { mapState, mapMutations } from 'vuex';
import TreasureCalc from '@/library/treasureCalc';
let treaCalcObj = new TreasureCalc().setServantConfig({
  treasure_lv: 1,
  skill_lvs: [1, 1, 1],
  treasure_oc: 1
});

export default {
  name: 'treasureCalc', 
  components: {
    MutiPicker
  },
  data() {
    return {
      support_column: [
        {
          values: SUPPORT.slice()
        },
        {
          values: SUPPORT.slice()
        }
      ],
      ce_column: CRAFT_CSSENCE,
      clothes_column: CLOTHES,
      normal_picker: {
        show: false,
        columns: [],
        title: '',
        target: ''
      },
      custom_mode: false,
      small_pic: '?imageView2/0/w/48',
      skill_default: [1, 1, 1],
      skill_options: new Array(3).fill(1).map((val, _idx) => {
        return {
          values: new Array(11).fill(1).map((val, idx) => {
            if (idx == 0) {
              return {
                name: `技能${_idx + 1}`,
                disabled: true
              };
            } else return idx;
          }),
          className: 'column1'
        };
      }),
      picker_styles: [],
      lvs: [1, 2, 3, 4, 5],
      appoint_servant: false,
      noSkill: false,
      effectType: '1',
      activeName: 0,
      dactiveName: -1,
      picker_show: false,
      picker_title: '',
      picking_columns: [],
      target_name: '',
      default_index: [],
      enemy: {},
      img_base: BASE_URL,
      servant_setting: {
        treasure_lv: 1,
        skill_lvs: [1, 1, 1],
        treasure_oc: 1,
        sr_treasure_lv: 1,
        ssr_treasure_lv: 1,
        else_treasure_lv: 5,
        skill_mode: '1'
      },
      servant: {},
      extra_buffs: {
        support: [],
        craft_essence: [],
        clothes: [],
        costom: {
          value: {
            atk: 0,
            atk_buff: 0,
            def_debuff: 0,
            extra_damage: 0,
            trea_buff: 0,
            buster_buff: 0,
            quick_buff: 0,
            arts_buff: 0
          }
        }
      },
      costom_column: [
        ['atk_buff', '攻击力提升'],
        ['buster_buff', '红魔放'],
        ['quick_buff', '绿魔放'],
        ['arts_buff', '蓝魔放'],
        ['def_debuff', '防御力下降'],
        ['extra_damage', '特攻'],
        ['trea_buff', '宝具威力提升']
      ],
      extra_buffs_calc: {
        atk: 0,
        atk_buff: 0,
        def_debuff: 0,
        extra_damage: 0,
        trea_buff: 0,
        buster_buff: 0,
        quick_buff: 0,
        arts_buff: 0
      },
      damage_list: []
    };
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      // vm.$store.commit('setShowTitle', false);
      vm.$setTitle('宝具伤害计算');
    });
  },
  computed: {
    ...mapState('servant', {
      servant_list: state => state.list,
      servant_treasure_list: state => state.list4Treasure
    }),
    ...mapState('userData', [
      'servant_map',
      'tc_custom_mode',
      'tc_extra_buffs',
      'tc_servant_setting',
      'tc_appoint_servant',
      'tc_enemy'
    ]),
    servant_setting_abstract() {
      if (this.appoint_servant) {
        let { treasure_lv, treasure_oc, skill_lvs } = this.servant_setting;
        return `${treasure_lv}宝 ${
          this.noSkill ? '' : skill_lvs.join('/')
        } OC${treasure_oc}`;
      }
      let {
        sr_treasure_lv,
        ssr_treasure_lv,
        treasure_oc,
        skill_mode
      } = this.servant_setting;
      let skill_mode_text = {
        1: '310',
        2: '按练度'
      };
      return `四星${sr_treasure_lv}宝 五星${ssr_treasure_lv}宝 OC${treasure_oc} ${
        skill_mode_text[skill_mode]
      }`;
    },
    support_abstract() {
      let list = this.extra_buffs.support;
      let reg = /(明|狐|CBA|梅)/;
      let output = '';
      list.map(val => {
        let text = val.name.match(reg) ? val.name.match(reg)[1] : '';
        if (!text && output.indexOf('单') < 0) output = `单${output}`;
        else if (output === text) {
          output = `双${output}`;
        } else {
          output += text;
        }
      });
      return !output || output === '单' ? '无' : output;
    },
    extra_buff_abstract() {
      let nameMap = {
        atk: 'atk',
        arts_buff: '蓝放',
        quick_buff: '绿放',
        buster_buff: '红放',
        atk_buff: '攻击提升',
        def_debuff: '防御下降',
        trea_buff: '宝具提升',
        extra_damage: '特攻'
      };
      return Object.entries(this.extra_buffs_calc)
        .filter(val => val[1])
        .map(
          val =>
            `${nameMap[val[0]]}:${
              val[0] !== 'atk' ? val[1] * 100 + '%' : val[1]
            }`
        )
        .join(' ');
    }
    /* extra_buffs: {
      get() {
        return this.tc_extra_buffs;
      },
      set(data) {
        let key = 'extra_buffs';

        this.updateTreasureCalcSetting({ key, data });
      }
    } */
  },
  mounted() {
    this.extra_buffs = this.tc_extra_buffs;
    this.custom_mode = this.tc_custom_mode;
    this.appoint_servant = this.tc_appoint_servant;
    this.servant_setting = this.tc_servant_setting;
    this.enemy = this.tc_enemy;
  },
  methods: {
    ...mapMutations('userData', ['updateTreasureCalcSetting']),
    showEnemyPicker(target_name, title = '') {
      if (!enemy_list) {
        enemy_list = JSON.parse(ENEMY_PICKER_MODEL);
        this.servant_list.map(val => {
          enemy_list[val.class]['英灵'].push(val);
          return val;
        });
      }

      this.picking_columns = enemy_list;
      this.default_index = picker_buff[target_name];
      this.picker_show = true;
      this.picker_title = title;
      this.target_name = target_name;
      this.picker_styles = ['longer-text', '', 'longest-text'];
    },
    showServantPicker(target_name, title = '') {
      if (!servant_list) {
        servant_list = {};
        this.servant_treasure_list.map(val => {
          if (!servant_list[val.class]) servant_list[val.class] = [];
          servant_list[val.class].push(val);
          return val;
        });
      }
      this.picking_columns = servant_list;
      this.default_index = picker_buff[target_name];
      this.picker_show = true;
      this.target_name = target_name;
      this.picker_title = title;
      this.picker_styles = ['longer-text', 'longest-text'];
    },

    showNormalPicker(target_name, options, title = '') {
      this.picking_columns = options;
      this.default_index = picker_buff[target_name];
      this.picker_title = title;
      this.picker_show = true;
      this.target_name = target_name;
    },
    onConfirm(values, indexs) {
      let _names = this.target_name.split('.');

      let TarName = _names.shift(),
        Tar = JSON.parse(JSON.stringify(this[TarName])),
        _tar = Tar;
      while (_names.length > 1) {
        _tar = _tar[_names.shift()];
      }
      if (_names.length > 0) _tar[_names.shift()] = values.pop();
      else Tar = values.pop();
      this[TarName] = Tar;
      picker_buff[this.target_name] = indexs;
      this.picker_show = false;
    },
    onCancel() {
      this.picker_show = false;
    },
    percentAgeInput(val, event) {
      console.log(event);
    },
    calc() {
      if (JSON.stringify(this.enemy) === '{}') {
        this.$toast.fail('未选敌对目标');
        return false;
      } else if (this.appoint_servant) {
        if (JSON.stringify(this.servant) === '{}') {
          this.$toast.fail('未选从者');
          return false;
        }

        let res = treaCalcObj.calcFun()(this.servant, {});
        this.damage_list = [res];
        this.dactiveName = 0;
      } else {
        let _output = this.servant_treasure_list.map(val => {
          let treasure_lv,
            skill_lvs = {
              1: [10, 10, 10],
              2: this.servant_map[val.id]
                ? this.servant_map[val.id].lvs
                : [10, 10, 10]
            };
          let rarity_map = {
            4: 'sr_treasure_lv',
            5: 'ssr_treasure_lv'
          };
          if (val.getWay === 1 || val.rarity - 4 < 0)
            treasure_lv = this.servant_setting.else_treasure_lv;
          else treasure_lv = this.servant_setting[rarity_map[val.rarity]];
          skill_lvs = this.noSkill
            ? [0, 0, 0]
            : skill_lvs[this.servant_setting.skill_mode];

          return treaCalcObj
            .setServantConfig({ treasure_lv, skill_lvs })
            .calcFun()(val, {});
        });
        _output.sort((a, b) => b.damage.avg - a.damage.avg);
        this.damage_list = _output;

        this.dactiveName = -1;
      }

      this.activeName = 0;
    },
    onNormalPickerShow(target, options, title = '') {
      this.normal_picker.columns = options;
      this.normal_picker.title = title;
      this.normal_picker.target = target;
      this.normal_picker.show = true;
      this.$nextTick(() => {
        let _names = target.split('.');
        let tar = this;
        while (_names.length > 0) {
          tar = tar[_names.shift()];
        }
        Array.isArray(tar) || (tar = [tar]);
        this.$refs.normal_picker.setValues(tar);
      });
    },
    onNormalPickerConfirm(values) {
      let { target } = this.normal_picker;
      let _names = target.split('.');
      let TarName = _names.shift(),
        Tar = JSON.parse(JSON.stringify(this[TarName])),
        _tar = Tar;
      while (_names.length > 1) {
        _tar = _tar[_names.shift()];
      }
      if (_names.length > 0) _tar[_names.shift()] = values;
      else Tar = values;
      this[TarName] = Tar;
      this.normal_picker.show = false;
    },
    onNormalPickerCancel() {
      this.normal_picker.show = false;
    },
    InputHandler(value, key) {
      value = value * 1 || value;
      let _names = key.split('.');
      let TarName = _names.shift(),
        Tar = JSON.parse(JSON.stringify(this[TarName])),
        _tar = Tar;
      while (_names.length > 1) {
        _tar = _tar[_names.shift()];
      }
      if (_names.length > 0) _tar[_names.shift()] = value;
      else Tar = value;
      this[TarName] = Tar;
    }
  },
  watch: {
    noSkill(val) {
      if (val) {
        skill_setting = [...this.servant_setting.skill_lvs];
        this.servant_setting.skill_lvs = [0, 0, 0];
      } else if (
        !val &&
        JSON.stringify(this.servant_setting.skill_lvs) ==
          JSON.stringify([0, 0, 0])
      ) {
        this.servant_setting.skill_lvs = skill_setting;
      }
    },
    enemy(val) {
      treaCalcObj = treaCalcObj.setEnemy(val);
      this.updateTreasureCalcSetting({
        key: 'enemy',
        data: val && JSON.parse(JSON.stringify(val))
      });
    },
    servant_setting: {
      deep: true,
      handler(val) {
        let { treasure_lv, treasure_oc, skill_lvs } = val;
        this.updateTreasureCalcSetting({
          key: 'servant_setting',
          data: JSON.parse(JSON.stringify(val))
        });
        treaCalcObj = treaCalcObj.setServantConfig({
          treasure_lv,
          treasure_oc,
          skill_lvs
        });
      }
    },
    extra_buffs: {
      deep: true,
      handler(val) {
        let buffs;
        let _obj = JSON.parse(JSON.stringify(val));
        this.updateTreasureCalcSetting({ key: 'extra_buffs', data: _obj });
        let custom_mode = this.custom_mode;
        this.extra_buffs_calc = {
          atk: 0,
          atk_buff: 0,
          def_debuff: 0,
          extra_damage: 0,
          trea_buff: 0,
          buster_buff: 0,
          quick_buff: 0,
          arts_buff: 0
        };
        buffs = Object.entries(_obj).reduce((perv, [key, val]) => {
          if (!custom_mode) {
            if (key === 'costom') {
              perv.push({ value: { atk: val.value.atk } });
            } else if (Array.isArray(val)) perv.push(...val);
            else perv.push(val);
          } else if (key === 'costom') {
            perv.push(val);
          }

          return perv;
        }, []);
        buffs.map(val => {
          val = val.value || {};
          for (let _key of Object.keys(val)) {
            let _val = _key === 'atk' ? val[_key] * 100 : val[_key] * 1;
            let _o_val = this.extra_buffs_calc[_key] * 100;
            this.extra_buffs_calc[_key] = (_val + _o_val) / 100;
          }
        });
      }
    },
    custom_mode(val) {
      this.updateTreasureCalcSetting({ key: 'custom_mode', data: val });
    },
    extra_buffs_calc(val) {
      treaCalcObj = treaCalcObj.setExtraBuffs(val);
    },
    appoint_servant(val) {
      this.updateTreasureCalcSetting({ key: 'appoint_servant', data: val });
    },
    servant(val) {
      let _id = val.id;
      this.servant_setting.skill_lvs = this.servant_map[_id]
        ? this.servant_map[_id].lvs
        : [10, 10, 10];
    }
  },
  filters: {
    percentage(val) {
      return (val * 100).toFixed(0) + '%';
    }
  }
};
</script>

<style lang="scss">
.treasure-calc {
  .van-cell__value {
    flex: 2;
  }
}
</style>
<style scoped lang="scss">
.main-cell:not(:last-child)::after {
  left: 0;
}
.avatar {
  height: 0.6rem;
  margin-right: 0.2em;
}
.collapse-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .van-checkbox {
    margin: 0 0.8em;
  }
  .main-text {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding-right: 2em;
  }
}
.sub-text {
  color: var(--muted-color);
  font-size: 0.8em;
}
.dot-1 {
  height: 1.2em;
  line-height: 1.2em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.van-radio-group {
  display: flex;
  justify-content: flex-end;
}
.van-radio {
  line-height: 2em;
  padding-right: 0.5em;
}
</style>