import Vue from 'vue';
import {
  Icon,
  SwitchCell,
  Popup,
  Search,
  Collapse,
  CollapseItem,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Button,
  Tab,
  Tabs,
  NavBar,
  Field,
  List,
  Picker,
  Toast,
  Loading,
  PullRefresh,
  Cell,
  CellGroup,
  Slider,
  Dialog,
  SwipeCell,
  Rate,
  Stepper,
  NumberKeyboard,
  Panel
} from 'vant';
Toast.setDefaultOptions({
  //mask: true,
  forbidClick: true,
  duration: 1500
});

Vue.use(Loading);
Vue.use(PullRefresh);

Vue.use(Toast);
Vue.use(Field);

Vue.use(NavBar);

Vue.use(Button);

Vue.use(Popup);
Vue.use(Icon);

Vue.use(SwitchCell);
Vue.use(Search);
Vue.use(Collapse).use(CollapseItem);
Vue.use(Checkbox).use(CheckboxGroup);
Vue.use(Cell).use(CellGroup);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Tab).use(Tabs);
Vue.use(List);
Vue.use(Picker);
Vue.use(Slider);
Vue.use(Dialog);
Vue.use(SwipeCell);
Vue.use(Rate);
Vue.use(Stepper);
Vue.use(NumberKeyboard);
Vue.use(Panel);
