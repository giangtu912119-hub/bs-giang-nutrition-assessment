
export type AgeCalculationInput = {
  dateOfBirth: string;
  assessmentDate: string;
};

export type AgeCalculationResult = {
  valid: boolean;
  ageDays: number | null;
  completedMonths: number | null;
  ageYears: number | null;
  measurementRecommendation: 'recumbent' | 'standing' | null;
  message: string;
};

/**
 * Parse date-only string as UTC.
 * Avoid timezone shifts caused by local Date parsing.
 */
function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Calculate exact chronological age in days.
 *
 * WHO measurement-position rule used by this module:
 * - Age < 731 days: recumbent length reference.
 * - Age >= 731 days: standing height reference.
 *
 * This is not a corrected-age calculator for preterm infants.
 */
export function calculateAge(
  input: AgeCalculationInput
): AgeCalculationResult {
  const birthDate = parseDateOnly(input.dateOfBirth);
  const assessmentDate = parseDateOnly(input.assessmentDate);

  if (!birthDate || !assessmentDate) {
    return {
      valid: false,
      ageDays: null,
      completedMonths: null,
      ageYears: null,
      measurementRecommendation: null,
      message: 'Ngày sinh hoặc ngày đánh giá không hợp lệ.'
    };
  }

  const ageDays = Math.round(
    (assessmentDate.getTime() - birthDate.getTime()) /
      (24 * 60 * 60 * 1000)
  );

  if (ageDays < 0) {
    return {
      valid: false,
      ageDays: null,
      completedMonths: null,
      ageYears: null,
      measurementRecommendation: null,
      message: 'Ngày đánh giá không được trước ngày sinh.'
    };
  }

  const completedMonths =
    (assessmentDate.getUTCFullYear() - birthDate.getUTCFullYear()) * 12 +
    assessmentDate.getUTCMonth() -
    birthDate.getUTCMonth() -
    (assessmentDate.getUTCDate() < birthDate.getUTCDate() ? 1 : 0);

  const ageYears = Math.floor(completedMonths / 12);

  return {
    valid: true,
    ageDays,
    completedMonths,
    ageYears,
    measurementRecommendation:
      ageDays < 731 ? 'recumbent' : 'standing',
    message:
      ageDays < 731
        ? 'Ưu tiên đo chiều dài nằm theo quy tắc phân nhóm tuổi của WHO Anthro.'
        : 'Ưu tiên đo chiều cao đứng theo quy tắc phân nhóm tuổi của WHO Anthro.'
  };
}
