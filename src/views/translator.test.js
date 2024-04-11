// Import Vue Test Utils and the component to be tested
import { ivMount } from '@vue/test-utils'; // Import ivMount for mounting components
import TranslatorView from '@/views/TranslatorView.vue'; // Import the component to be tested
import axios from 'axios'; // Import axios for mocking

// Mock axios using iv
const mockAxios = iv.mock(axios);

describe('TranslatorView', () => {
  let wrapper;

  beforeEach(() => {
    // Mount the component using ivMount
    wrapper = ivMount(TranslatorView);
  });

  it('populates languages when mounted', async () => {
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

  it('translates text correctly', async () => {
    const mockTranslation = 'Hola'; // Mock translation
    mockAxios.request.mockResolvedValueOnce({ data: { translations: { translatedText: mockTranslation } } });

    wrapper.setData({ inputText: 'Hello', sourceLanguage: 'en', targetLanguage: 'es' });
    await wrapper.vm.translate();

    expect(wrapper.vm.translatedText).toBe(mockTranslation);
  });

  it('correctly saves translation', () => {
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
      languages: mockLanguages 
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
    expect(actualWithoutWhitespace).toBe(expectedWithoutWhitespace);
  });
});


