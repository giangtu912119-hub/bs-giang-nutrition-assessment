
import { describe, expect, it } from 'vitest';
import { validateMeasurements } from './measurementValidation';

describe('Measurement Validation', () => {
  it('accepts recumbent measurement in a 3-month-old infant', () => {
    const result = validateMeasurements({
      ageDays: 90,
      weightKg: 6,
      lengthCm: 60,
      headCircumferenceCm: 40,
      measureType: 'recumbent'
    });

    expect(result.valid).toBe(true);
    expect(result.canCalculateLengthHeightIndices).toBe(true);
    expect(result.recommendedMeasure).toBe('recumbent');
    expect(result.correctionCm).toBe(0);
    expect(result.standardizedLengthHeightCm).toBe(60);
    expect(result.measurementPositionFlag).toBe(0);
  });

  it('flags standing measurement in an infant under 9 months', () => {
    const result = validateMeasurements({
      ageDays: 90,
      weightKg: 6,
      lengthCm: 60,
      measureType: 'standing'
    });

    expect(result.valid).toBe(true);
    expect(result.canCalculateLengthHeightIndices).toBe(false);
    expect(result.recommendedMeasure).toBe('recumbent');
    expect(result.correctionCm).toBe(0);
    expect(result.standardizedLengthHeightCm).toBe(60);
    expect(result.measurementPositionFlag).toBe(1);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('adds 0.7 cm for standing measurement at 12 months', () => {
    const result = validateMeasurements({
      ageDays: 365,
      weightKg: 9,
      lengthCm: 72,
      measureType: 'standing'
    });

    expect(result.valid).toBe(true);
    expect(result.canCalculateLengthHeightIndices).toBe(true);
    expect(result.recommendedMeasure).toBe('recumbent');
    expect(result.originalLengthHeightCm).toBe(72);
    expect(result.correctionCm).toBe(0.7);
    expect(result.standardizedLengthHeightCm).toBeCloseTo(72.7);
    expect(result.measurementPositionFlag).toBe(0);
  });

  it('does not correct recumbent measurement at 23 months', () => {
    const result = validateMeasurements({
      ageDays: 700,
      weightKg: 11,
      lengthCm: 82,
      measureType: 'recumbent'
    });

    expect(result.valid).toBe(true);
    expect(result.recommendedMeasure).toBe('recumbent');
    expect(result.correctionCm).toBe(0);
    expect(result.standardizedLengthHeightCm).toBe(82);
  });

  it('subtracts 0.7 cm for recumbent measurement at 731 days', () => {
    const result = validateMeasurements({
      ageDays: 731,
      weightKg: 12,
      lengthCm: 88,
      measureType: 'recumbent'
    });

    expect(result.valid).toBe(true);
    expect(result.canCalculateLengthHeightIndices).toBe(true);
    expect(result.recommendedMeasure).toBe('standing');
    expect(result.originalLengthHeightCm).toBe(88);
    expect(result.correctionCm).toBe(-0.7);
    expect(result.standardizedLengthHeightCm).toBeCloseTo(87.3);
    expect(result.measurementPositionFlag).toBe(0);
  });

  it('rejects invalid weight', () => {
    const result = validateMeasurements({
      ageDays: 365,
      weightKg: 0,
      lengthCm: 72,
      measureType: 'recumbent'
    });

    expect(result.valid).toBe(false);
    expect(result.canCalculateLengthHeightIndices).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.standardizedLengthHeightCm).toBeNull();
  });

  it('rejects invalid length or height', () => {
    const result = validateMeasurements({
      ageDays: 365,
      weightKg: 9,
      lengthCm: -1,
      measureType: 'recumbent'
    });

    expect(result.valid).toBe(false);
    expect(result.canCalculateLengthHeightIndices).toBe(false);
    expect(result.standardizedLengthHeightCm).toBeNull();
  });

  it('rejects invalid head circumference when provided', () => {
    const result = validateMeasurements({
      ageDays: 365,
      weightKg: 9,
      lengthCm: 72,
      headCircumferenceCm: 0,
      measureType: 'recumbent'
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects invalid age', () => {
    const result = validateMeasurements({
      ageDays: -1,
      weightKg: 9,
      lengthCm: 72,
      measureType: 'recumbent'
    });

    expect(result.valid).toBe(false);
    expect(result.canCalculateLengthHeightIndices).toBe(false);
  });
});
