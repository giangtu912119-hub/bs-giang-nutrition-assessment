
export type MeasurementInput = {
  ageDays: number;
  weightKg: number;
  lengthCm: number;
  headCircumferenceCm?: number;
  measureType: 'recumbent' | 'standing';
};

export type MeasurementValidationResult = {
  valid: boolean;
  canCalculateLengthHeightIndices: boolean;
  errors: string[];
  warnings: string[];
  recommendedMeasure: 'recumbent' | 'standing' | null;
  originalLengthHeightCm: number | null;
  correctionCm: number;
  standardizedLengthHeightCm: number | null;
  measurementPositionFlag: 0 | 1;
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

  // 1. Validate age
  if (!Number.isInteger(ageDays) || ageDays < 0) {
    errors.push('Tuổi tính theo ngày không hợp lệ.');
  }

  // 2. Validate weight
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    errors.push('Cân nặng phải là số lớn hơn 0 kg.');
  }

  // 3. Validate length / height
  if (!Number.isFinite(lengthCm) || lengthCm <= 0) {
    errors.push('Chiều dài/chiều cao phải lớn hơn 0 cm.');
  }

  // 4. Validate head circumference
  if (
    headCircumferenceCm !== undefined &&
    (!Number.isFinite(headCircumferenceCm) ||
      headCircumferenceCm <= 0)
  ) {
    errors.push('Vòng đầu phải lớn hơn 0 cm nếu được nhập.');
  }

  // 5. Validate measurement position
  if (
    measureType !== 'recumbent' &&
    measureType !== 'standing'
  ) {
    errors.push('Phương pháp đo không hợp lệ.');
  }

  const valid = errors.length === 0;

  if (!valid) {
    return {
      valid: false,
      canCalculateLengthHeightIndices: false,
      errors,
      warnings,
      recommendedMeasure: null,
      originalLengthHeightCm: null,
      correctionCm: 0,
      standardizedLengthHeightCm: null,
      measurementPositionFlag: 0
    };
  }

  // WHO Anthro: <731 days uses recumbent length;
  // >=731 days uses standing height.
  const recommendedMeasure =
    ageDays < 731 ? 'recumbent' : 'standing';

  const originalLengthHeightCm = lengthCm;

  const positionMismatch =
    measureType !== recommendedMeasure;

  // WHO Anthro flags standing measurement below 9 months
  // and excludes the measurement position from length/height
  // based calculations.
  const ageInMonths = ageDays / 30.4375;

  const incorrectPositionUnder9Months =
    ageInMonths < 9 && measureType === 'standing';

  if (incorrectPositionUnder9Months) {
    warnings.push(
      'Trẻ dưới 9 tháng được ghi nhận đo tư thế đứng. WHO Anthro đánh dấu tư thế đo không hợp lý; cần kiểm tra lại số đo và không tính các chỉ số dựa trên chiều dài/chiều cao từ lần đo này.'
    );
  }

  let correctionCm = 0;
  let standardizedLengthHeightCm: number | null =
    originalLengthHeightCm;

  if (positionMismatch && !incorrectPositionUnder9Months) {
    correctionCm =
      recommendedMeasure === 'recumbent' ? 0.7 : -0.7;

    standardizedLengthHeightCm =
      originalLengthHeightCm + correctionCm;

    warnings.push(
      `Đã chuyển đổi số đo ${correctionCm > 0 ? '+' : ''}${correctionCm} cm theo quy tắc WHO Anthro. Cần lưu riêng số đo gốc và số đo chuyển đổi.`
    );
  }

  return {
    valid: true,
    canCalculateLengthHeightIndices:
      !incorrectPositionUnder9Months,
    errors,
    warnings,
    recommendedMeasure,
    originalLengthHeightCm,
    correctionCm,
    standardizedLengthHeightCm,
    measurementPositionFlag:
      incorrectPositionUnder9Months ? 1 : 0
  };
}
