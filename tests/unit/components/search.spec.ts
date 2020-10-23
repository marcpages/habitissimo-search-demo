import { shallowMount } from '@vue/test-utils';
import Search from '@/components/Search.vue';

describe('Search.vue', () => {

  it('renders props.label when passed', () => {
    const label = 'new label';
    const wrapper = shallowMount(Search, {
      propsData: { label },
    });
    expect(wrapper.find('.search-label').text()).toMatch(label);
  });

  // TODO: Add test to check if it returns results

  // TODO: Add test to check other input params

});
