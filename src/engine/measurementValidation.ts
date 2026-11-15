
export type MeasurementInput = {
  ageDays: number;
  weightKg: number;
  lengthCm: number;
  headCircumferenceCm?: number;
  measureType: 'recumbent' | 'standing';
};

export type MeasurementValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  recommendedMeasure: 'recumbent' | 'standing';
  correctionCm: number;
  whoAdjustedLengthCm: number | null;
};

export function validateMeasurements(
  input: MeasurementInput
): MeasurementValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const {
    ageDays,
    weightKg,
    lengthCm,
    headCircumferenceCm,
    measureType
  } = input;

  if (!Number.isInteger(ageDays) || ageDays < 0) {
    errors.push('Tuổi tính theo ngày không hợp lệ.');
  }

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    errors.push('Cân nặng phải là số lớn hơn 0 kg.');
  }

  if (!Number.isFinite(lengthCm) || lengthCm <= 0) {
    errors.push('Chiều dài/chiều cao phải lớn hơn 0 cm.');
  }

  if (
    headCircumferenceCm !== undefined &&
    (!Number.isFinite(headCircumferenceCm) ||
      headCircumferenceCm <= 0)
  ) {
    errors.push('Vòng đầu phải lớn hơn 0 cm nếu được nhập.');
  }

  const recommendedMeasure =
    ageDays < 731 ? 'recumbent' : 'standing';

  let correctionCm = 0;

  if (measureType !== recommendedMeasure) {
    warnings.push(
      'Tư thế đo không phù hợp với nhóm tuổi theo quy tắc WHO Anthro. Cần kiểm tra và áp dụng quy tắc chuyển đổi trước khi tính Z-score.'
    );

    correctionCm =
      recommendedMeasure === 'recumbent' ? 0.7 : -0.7;
  }

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    warnings,
    recommendedMeasure,
    correctionCm,
    whoAdjustedLengthCm:
      valid ? lengthCm + correctionCm : null
  };
}
