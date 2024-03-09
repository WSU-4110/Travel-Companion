const axios = require('axios');

class TranslationService {
    static #instance = null;

    #apiKey;

    constructor() {
        if (!TranslationService.#instance) {
            this.#apiKey = `${this.$store.getters.getLocationApiKey}`; // Initialize API key
            TranslationService.#instance = this;
        }
        return TranslationService.#instance;
    }

    static getInstance() {
        return this.#instance || new TranslationService();
    }

    setApiKey(apiKey) {
        this.#apiKey = apiKey;
    }

    async translate(inputText, targetLanguage) {
        try {
            const response = await axios.get("https://api-free.deepl.com/v2/translate", {
                params: {
                    auth_key: this.#apiKey,
                    text: inputText,
                    target_lang: targetLanguage
                },
                proxy: {
                    host: "localhost",
                    port: 8080
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error translating:", error);
            throw error;
        }
    }
}

// Usage:
const translationService = TranslationService.getInstance();
translationService.setApiKey(`${this.$store.getters.getLocationApiKey}`);
translationService.translate('Hello', 'es')
    .then(result => console.log(result))
    .catch(error => console.error(error));
