import { mount } from '@vue/test-utils';
import Weather from '@/views/Weather.vue';

const mockStore = {
  state: {},
  commit: vi.fn(),
  getters: {
    getLocationApiKey: vi.fn()
  }
};

describe('Weather', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Weather, {
      global: {
        mocks: {
          $store: mockStore
        }
      }
    });
  });

  test('converts Kelvin to Celsius', () =>
  {
      const result = wrapper.vm.convert_kelvin_to_celsius(300);
      console.log('Result:', result);
      expect(result).toBe('26.85');
  });

  test('converts Kelvin to Fahrenheit', () =>
  {
      const result = wrapper.vm.convert_kelvin_to_fahrenheit(300);
      console.log('Result:', result);
      expect(result).toBe('80.33');
  });

  test('converts Miles Per Second to Miles Per Hour', () =>
  {
      const result = wrapper.vm.convert_mps_to_mph(10);
      console.log('Result:', result);
      expect(result).toBe('22.37');
  });

  test('Gets direction from heading', () =>
  {
      const result = wrapper.vm.getWindDirectionLetter(180);
      console.log('Result:', result);
      expect(result).toBe('S');
  });
})

