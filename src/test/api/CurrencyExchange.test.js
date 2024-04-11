import { mount } from '@vue/test-utils';
import CurrencyExchange from '@/views/CurrencyExchange.vue';
import axios from 'axios';
import sinon from 'sinon';
import { expect } from 'chai';

// Mock Vuex store
const mockStore = {
  state: {},
  commit: sinon.stub()
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
    expect(wrapper.exists()).to.be.true;
  });

  it('calls convertCurrency method when convert button is clicked', async () => {
    const convertCurrencyStub = sinon.stub(wrapper.vm, 'convertCurrency');

    await wrapper.find('button').trigger('click');

    expect(convertCurrencyStub.calledOnce).to.be.true;
  });

  it('fetches conversion rates when convertCurrency method is called', async () => {
    const axiosGetStub = sinon.stub(axios, 'get').resolves({
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

    expect(axiosGetStub.calledWith('https://open.er-api.com/v6/latest/USD')).to.be.true;
    expect(wrapper.vm.conversionRate).to.equal(1.5);

    axios.get.restore();
  });

  it('displays alert message when starting currency is not selected', async () => {
    wrapper.setData({
      endingCurrency: 'EUR',
      amount: 100
    });

    await wrapper.vm.convertCurrency();

    expect(mockStore.commit.getCall(0).args[0]).to.equal('setAlertStatus');
    expect(mockStore.commit.getCall(0).args[1]).to.equal('alert-warning');
    expect(mockStore.commit.getCall(1).args[0]).to.equal('setAlertMessage');
    expect(mockStore.commit.getCall(1).args[1]).to.equal('Please select starting and ending currencies, and enter an amount to convert.');
  });

  it('displays alert message when ending currency is not selected', async () => {
    wrapper.setData({
      startingCurrency: 'USD',
      amount: 100
    });

    await wrapper.vm.convertCurrency();

    expect(mockStore.commit.getCall(0).args[0]).to.equal('setAlertStatus');
    expect(mockStore.commit.getCall(0).args[1]).to.equal('alert-warning');
    expect(mockStore.commit.getCall(1).args[0]).to.equal('setAlertMessage');
    expect(mockStore.commit.getCall(1).args[1]).to.equal('Please select starting and ending currencies, and enter an amount to convert.');
  });

  it('displays alert message when amount is not entered', async () => {
    wrapper.setData({
      startingCurrency: 'USD',
      endingCurrency: 'EUR'
    });

    await wrapper.vm.convertCurrency();

    expect(mockStore.commit.getCall(0).args[0]).to.equal('setAlertStatus');
    expect(mockStore.commit.getCall(0).args[1]).to.equal('alert-warning');
    expect(mockStore.commit.getCall(1).args[0]).to.equal('setAlertMessage');
    expect(mockStore.commit.getCall(1).args[1]).to.equal('Please select starting and ending currencies, and enter an amount to convert.');
  });

});
