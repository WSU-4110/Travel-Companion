import { expect, test } from 'vitest';
import { convert_kelvin_to_celsius, convert_kelvin_to_fahrenheit, convert_mps_to_mph, getWindDirectionLetter } from '../views/Weather.vue';


test('converts Kelvin to Celsius', () =>
{
    const result = convert_kelvin_to_celsius(300);
    console.log('Result:', result);
    expect(result).toBe('26.85'); 
});

test('converts Kelvin to Fahrenheit', () =>
{
    const result = convert_kelvin_to_fahrenheit(300);
    console.log('Result:', result);
    expect(result).toBe('80.33');
});

test('converts Miles Per Second to Miles Per Hour', () =>
{
    const result = convert_mps_to_mph(10);
    console.log('Result:', result);
    expect(result).toBe('22.37');
});

test('Gets direction from heading', () =>
{
    const result = getWindDirectionLetter(180);
    console.log('Result:', result);
    expect(result).toBe('S');
});