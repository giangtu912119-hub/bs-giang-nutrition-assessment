
import { describe, expect, it } from 'vitest';
import { calculateAge } from './ageCalculator';

describe('Age Calculator', () => {
  it('calculates age in days correctly', () => {
    const result = calculateAge({
      dateOfBirth: '2026-01-01',
      assessmentDate: '2026-04-01'
    });

    expect(result.valid).toBe(true);
    expect(result.ageDays).toBe(90);
    expect(result.completedMonths).toBe(3);
    expect(result.measurementRecommendation).toBe('recumbent');
  });

  it('calculates age of 365 days', () => {
    const result = calculateAge({
      dateOfBirth: '2025-01-01',
      assessmentDate: '2026-01-01'
    });

    expect(result.valid).toBe(true);
    expect(result.ageDays).toBe(365);
    expect(result.completedMonths).toBe(12);
  });

  it('recognizes the 731-day boundary', () => {
    const result = calculateAge({
      dateOfBirth: '2024-01-01',
      assessmentDate: '2026-01-01'
    });

    expect(result.valid).toBe(true);
    expect(result.ageDays).toBe(731);
    expect(result.measurementRecommendation).toBe('standing');
  });

  it('rejects assessment before birth', () => {
    const result = calculateAge({
      dateOfBirth: '2026-04-01',
      assessmentDate: '2026-01-01'
    });

    expect(result.valid).toBe(false);
    expect(result.ageDays).toBeNull();
  });

  it('rejects invalid dates', () => {
    const result = calculateAge({
      dateOfBirth: '2026-02-30',
      assessmentDate: '2026-04-01'
    });

    expect(result.valid).toBe(false);
    expect(result.ageDays).toBeNull();
  });
});
