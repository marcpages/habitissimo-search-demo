import { shallowMount } from '@vue/test-utils';
import Search from '@/components/Search.vue';
import axios from "axios";

describe('Search.vue', () => {

  it('renders props.label when passed', () => {
    const label = 'new label';
    const wrapper = shallowMount(Search, {
      propsData: { label },
    });
    expect(wrapper.find('.search-label').text()).toMatch(label);
  });

  it('check if results are showing', () => {
    const searchQuery = 'hello';
    const expectedResults = [
      {
        normalized_name: 'hello',
        name: 'hello'
      },
      {
        normalized_name: 'hello',
        name: 'bye'
      },
    ];

    const getResultsFnc = (query: string) => {
      return new Promise( (resolve, reject) => {
        resolve(expectedResults);
      })
    };

    const wrapper = shallowMount(Search, {
      propsData: { getResultsFnc },
    });

    wrapper.find('.input-container input').setValue(searchQuery);

    expect(wrapper.find('.results').text()).toMatch(/hello/)
    expect(wrapper.find('.results').text()).toMatch(/bye/)
  });

  // TODO: Add test to check if it returns results

  // TODO: Add test to check other input params

});
