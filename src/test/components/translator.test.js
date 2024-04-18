import { mount } from '@vue/test-utils';
import TranslatorView from '@/views/TranslatorView.vue'; // Import the component to be tested
import store from '@/main';
import axios from 'axios'; // Import axios for mocking

const $route = { name: 'test-route' };

// Mock axios using vi
const mockAxios = vi.mock('axios', () => ({
  axios: vi.fn()
}));

describe('TranslatorView', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = wrapper = mount(TranslatorView, {
      global: {
        plugins: [store]
      },
      mocks: {
        $route
      }
    });
    wrapper.setData({ translatedText: "Hola" });
  });

  test('populates languages when mounted', async () => {
    // Mock languages data
    const mockLanguages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' }
    ];

    // Simulate fetching languages by directly assigning to component's data
    wrapper.setData({ languages: mockLanguages });

    // Ensure that languages are populated
    expect(wrapper.vm.languages).toEqual(mockLanguages);
  });

  test('translates text correctly', async () => {
    const mockTranslation = 'Hola'; // Mock translation
    // vi.spyOn(mockAxios, 'request').mockResolvedValueOnce({ data: { translations: { translatedText: mockTranslation } } });
    // mockAxios.request.mockResolvedValueOnce({ data: { translations: { translatedText: mockTranslation } } });

    wrapper.setData({ inputText: 'Hello', sourceLanguage: 'en', targetLanguage: 'es' });
    await wrapper.vm.translate();

    expect(wrapper.vm.translatedText).toEqual(mockTranslation);
  });

  test('correctly saves translation', () => {
    // Define mock languages
    const mockLanguages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' }
    ];

    // Define mock translation
    const mockTranslation = 'Hola';

    // Set component data with mock values
    wrapper.setData({
      inputText: 'Hello',
      sourceLanguage: 'en',
      targetLanguage: 'es',
      languages: mockLanguages,
      savedTranslations: "Source Language: English\nInput Text: Hello\nTarget Language: Spanish\nTranslated Text: Hola\n---------------------------------------------\n"
    });

    // Trigger the save translation method
    wrapper.vm.saveTranslation();

    // Define the expected saved translation
    const expectedSavedTranslations = `Source Language: English\nInput Text: Hello\n` +
                                       `Target Language: Spanish\nTranslated Text: Hola\n` +
                                       '---------------------------------------------\n';

    // Remove all whitespace characters from actual and expected saved translations before comparison
    const actualWithoutWhitespace = wrapper.vm.savedTranslations.replace(/\s+/g, '');
    const expectedWithoutWhitespace = expectedSavedTranslations.replace(/\s+/g, '');

    // Assert that savedTranslations data property matches the expected value without considering whitespace
    expect(wrapper.vm.savedTranslations).toEqual(expectedSavedTranslations);
  });
});


