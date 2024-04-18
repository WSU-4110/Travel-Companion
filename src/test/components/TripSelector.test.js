import { mount } from '@vue/test-utils';
import store from '@/main';

import TripSelector from '@/components/TripSelector.vue';

const $route = { name: 'test-route' };

const sampleTrip = {
  timestamp: 1710103091000,
  tripName: 'testTrip'
}

describe('TripSelector', () => {
  test('closing modal clears name', () => {
    // mount the vue component to interact with it
    const wrapper = mount(TripSelector, {
      global: {
        plugins: [store]
      },
      mocks: {
        $route
      }
    });

    wrapper.vm.newTripName = "newTrip";
    expect(wrapper.vm.newTripName).toEqual("newTrip");

    wrapper.vm.clearCreateModal();
    expect(wrapper.vm.newTripName).toEqual(null);
  });

  test('set current trip', () => {
    const wrapper = mount(TripSelector, {
      global: {
        plugins: [store]
      },
      mocks: {
        $route
      }
    });

    wrapper.vm.setCurrentTrip(sampleTrip);
    expect(wrapper.vm.currentTrip.tripName).toEqual("testTrip");
  });
});
