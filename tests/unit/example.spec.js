import { expect } from 'chai';
//import { shallowMount } from '@vue/test-utils';
//import { describe } from 'mocha';
/* import HelloWorld from '@/components/HelloWorld.vue' */
/* 
describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})
 */

function add(a, b) {
  return a + b;
}
describe('加法函数的测试', function() {
  it('1 加 1 应该等于 2', function() {
    expect(add(1, 1)).to.be.equal(2);
  });
});
