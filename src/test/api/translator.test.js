// Import Vue Test Utils and the component to be tested
import { mount } from '@vue/test-utils';
import TranslatorPage from '@/components/TranslatorPage.vue';
import axios from 'axios';

// Mock axios to prevent actual HTTP requests during testing
jest.mock('axios', () => ({
  request: jest.fn()
}));

// Mock store getters
const mockStoreGetters = {
  getTranslationApiKey: 'mock-api-key'
};

// Mock Vue store
const mockStore = {
  getters: mockStoreGetters
};

// Mount the component with mocked dependencies
const wrapper = mount(TranslatorPage, {
  global: {
    mocks: {
      $store: mockStore,
      // Mocking window object for speech recognition
      window: {
        webkitSpeechRecognition: jest.fn(() => ({
          lang: '',
          continuous: true,
          start: jest.fn(),
          onresult: jest.fn(),
          onerror: jest.fn()
        }))
      }
    }
  }
});

// Unit tests for TranslatorPage component
describe('TranslatorPage', () => {
  // Test fetching languages
  it('fetches languages when mounted', async () => {
    const response = {
      data: {
        languages: [
          { language: 'EN', name: 'English' },
          { language: 'ES', name: 'Spanish' }
        ]
      }
    };
    axios.request.mockResolvedValueOnce(response);
    await wrapper.vm.fetchLanguages();
    expect(wrapper.vm.languages).toEqual([
      { code: 'EN', name: 'English' },
      { code: 'ES', name: 'Spanish' }
    ]);
  });

  // Test translation functionality
  it('translates text when Translate button is clicked', async () => {
    const response = {
      data: {
        data: {
          translations: {
            translatedText: 'Hola Mundo'
          }
        }
      }
    };
    axios.request.mockResolvedValueOnce(response);
    wrapper.setData({ inputText: 'Hello World' });
    await wrapper.vm.translate();
    expect(wrapper.vm.translatedText).toBe('Hola Mundo');
  });

  // Test saving translation
  it('saves translation when Save Translation button is clicked', () => {
    wrapper.setData({
      inputText: 'Hello World',
      translatedText: 'Hola Mundo',
      sourceLanguage: 'EN',
      targetLanguage: 'ES'
    });
    wrapper.vm.saveTranslation();
    expect(wrapper.vm.savedTranslations).toContain('Source Language: English');
    expect(wrapper.vm.savedTranslations).toContain('Input Text: Hello World');
    expect(wrapper.vm.savedTranslations).toContain('Target Language: Spanish');
    expect(wrapper.vm.savedTranslations).toContain('Translated Text: Hola Mundo');
  });

  // Test speech recognition
  it('starts speech recognition when Speech To Text button is clicked', () => {
    wrapper.vm.startSpeechToText();
    expect(window.webkitSpeechRecognition).toHaveBeenCalled();
  });
});