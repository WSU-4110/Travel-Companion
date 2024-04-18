// AI.test.js

import axios from 'axios';
import AI from '@/views/AI.vue';

vi.mock('axios');

describe('AI', () => {
  test('suggestItinerary method', async () => {
    const aiInstance = new AI(); // Instantiate AI class
    const mockResponse = { data: { result: 'Mock itinerary data' } };
    axios.request.mockResolvedValue(mockResponse);

    const itinerary = await aiInstance.suggestItinerary('Paris', 5);
    expect(axios.request).toHaveBeenCalled();
    expect(itinerary).toEqual(mockResponse.data);
  });

  test('handleSubmit method', async () => {
    const aiInstance = new AI(); // Instantiate AI class
    aiInstance.itinerary = { result: 'Existing itinerary' };

    // Simulate form submission
    await aiInstance.handleSubmit();
    expect(aiInstance.generatingNewItinerary).toBeFalsy();
  });

  test('fetchAndDisplayItinerary method', async () => {
    const aiInstance = new AI(); // Instantiate AI class
    const mockResponse = { data: { result: 'Mock itinerary data' } };
    axios.request.mockResolvedValue(mockResponse);

    await aiInstance.fetchAndDisplayItinerary();
    expect(aiInstance.itinerary).toEqual(mockResponse.data);
  });

  test('displayItinerary method', () => {
    const aiInstance = new AI(); // Instantiate AI class
    const mockItinerary = { result: 'Mock itinerary data' };
    aiInstance.displayItinerary(mockItinerary);
    expect(aiInstance.itinerary).toEqual(mockItinerary);
    expect(aiInstance.generatingNewItinerary).toBeFalsy();
  });

  test('generateDifferentItinerary method', () => {
    const aiInstance = new AI(); // Instantiate AI class
    aiInstance.handleSubmit = vi.fn(); // Mock handleSubmit method

    aiInstance.generateDifferentItinerary();
    expect(aiInstance.handleSubmit).toHaveBeenCalled();
  });
});
