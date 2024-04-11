import { mount } from '@vue/test-utils';
import CurrencyExchange from '@/views/CurrencyExchange.vue';
import axios from 'axios';

// Mock Vuex store
const mockStore = {
  state: {},
  commit: vi.fn()
};

describe('CurrencyExchange', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CurrencyExchange, {
      global: {
        mocks: {
          $store: mockStore
        }
      }
    });
  });

  it('renders the component properly', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('calls convertCurrency method when convert button is clicked', async () => {
    const convertCurrencyMock = vi.spyOn(wrapper.vm, 'convertCurrency');

    await wrapper.find('button').trigger('click');

    expect(convertCurrencyMock).toHaveBeenCalledTimes(1);
  });

  it('fetches conversion rates when convertCurrency method is called', async () => {
    const axiosGetMock = vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        rates: {
          USD: 1.2,
          EUR: 1.5
        }
      }
    });

    wrapper.setData({
      startingCurrency: 'USD',
      endingCurrency: 'EUR',
      amount: 100
    });

    await wrapper.vm.convertCurrency();

    expect(axiosGetMock).toHaveBeenCalledWith('https://open.er-api.com/v6/latest/USD');
    expect(wrapper.vm.conversionRate).toEqual(1.5);

    axios.get.mockRestore();
  });

  it('displays alert message when starting currency is not selected', async () => {
    wrapper.setData({
      endingCurrency: 'EUR',
      amount: 100
    });

    await wrapper.vm.convertCurrency();

    expect(mockStore.commit.mock.calls[0][0]).toEqual('setAlertStatus');
    expect(mockStore.commit.mock.calls[0][1]).toEqual('alert-warning');
    expect(mockStore.commit.mock.calls[1][0]).toEqual('setAlertMessage');
    expect(mockStore.commit.mock.calls[1][1]).toEqual('Please select starting and ending currencies, and enter an amount to convert.');
  });

  it('displays alert message when ending currency is not selected', async () => {
    wrapper.setData({
      startingCurrency: 'USD',
      amount: 100
    });
  
    await wrapper.vm.convertCurrency();
  
    expect(mockStore.commit.mock.calls[0][0]).toEqual('setAlertStatus');
    expect(mockStore.commit.mock.calls[0][1]).toEqual('alert-warning');
    expect(mockStore.commit.mock.calls[1][0]).toEqual('setAlertMessage');
    expect(mockStore.commit.mock.calls[1][1]).toEqual('Please select starting and ending currencies, and enter an amount to convert.');
  });



  it('accurately calculates the converted amount based on the conversion rate', async () => {
    const axiosGetMock = vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        rates: {
          USD: 1.2,
          EUR: 1.5
        }
      }
    });

    wrapper.setData({
      startingCurrency: 'USD',
      endingCurrency: 'EUR',
      amount: 100
    });

    await wrapper.vm.convertCurrency();

    // Expected converted amount: amount * conversion rate
    const expectedConvertedAmount = 100 * 1.5;

    // Assert that the converted amount matches the expected value
    expect(wrapper.vm.convertedAmount).toEqual(expectedConvertedAmount.toFixed(2));

    axios.get.mockRestore();
  });
});
