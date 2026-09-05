import { NumericRange, TestParameter } from '../types';

export interface EvaluationResult {
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  label: string;
  isAbnormal: boolean;
  isCritical: boolean;
  effectiveRangeText: string;
}

export function evaluateParameterResult(
  param: TestParameter,
  valStr: string | undefined,
  patientGender: 'male' | 'female' | 'other',
  patientAge: number,
  patientAgeUnit: 'years' | 'months' | 'days'
): EvaluationResult {
  if (!valStr || valStr.trim() === '') {
    return {
      flag: 'NORMAL',
      label: 'Normal',
      isAbnormal: false,
      isCritical: false,
      effectiveRangeText: param.refRange || 'Not specified',
    };
  }

  // Determine age in days and years
  let ageYears = patientAge;
  let ageDays = patientAge * 365;
  if (patientAgeUnit === 'months') {
    ageYears = patientAge / 12;
    ageDays = patientAge * 30;
  } else if (patientAgeUnit === 'days') {
    ageYears = patientAge / 365;
    ageDays = patientAge;
  }

  // Determine applicable range
  let targetRange: NumericRange | undefined;
  let rangeText = param.refRange;

  // 1. Age-specific checks
  if (param.ageRanges) {
    if (param.ageRanges.infantDaysMax && ageDays <= param.ageRanges.infantDaysMax && param.ageRanges.infantRange) {
      targetRange = param.ageRanges.infantRange;
      if (param.ageRanges.infantRange.text) rangeText = param.ageRanges.infantRange.text;
    } else if (
      param.ageRanges.pediatricYearsMax &&
      ageYears <= param.ageRanges.pediatricYearsMax &&
      param.ageRanges.pediatricRange
    ) {
      targetRange = param.ageRanges.pediatricRange;
      if (param.ageRanges.pediatricRange.text) rangeText = param.ageRanges.pediatricRange.text;
    } else if (param.ageRanges.adultRange) {
      targetRange = param.ageRanges.adultRange;
      if (param.ageRanges.adultRange.text) rangeText = param.ageRanges.adultRange.text;
    }
  }

  // 2. Gender-specific checks (if no infant override)
  if (!targetRange && param.genderRanges) {
    if (patientGender === 'male' && param.genderRanges.male) {
      targetRange = param.genderRanges.male;
    } else if (patientGender === 'female' && param.genderRanges.female) {
      targetRange = param.genderRanges.female;
    }
  }

  // Parse numeric value
  const num = parseFloat(valStr.replace(/,/g, '').trim());

  if (!isNaN(num)) {
    // Critical value check
    if (param.criticalLow !== undefined && num <= param.criticalLow) {
      return {
        flag: 'CRITICAL',
        label: 'CRITICAL (PANIC LOW)',
        isAbnormal: true,
        isCritical: true,
        effectiveRangeText: rangeText,
      };
    }
    if (param.criticalHigh !== undefined && num >= param.criticalHigh) {
      return {
        flag: 'CRITICAL',
        label: 'CRITICAL (PANIC HIGH)',
        isAbnormal: true,
        isCritical: true,
        effectiveRangeText: rangeText,
      };
    }

    // Normal vs High vs Low range
    if (targetRange) {
      if (targetRange.min !== undefined && num < targetRange.min) {
        return {
          flag: 'LOW',
          label: 'LOW',
          isAbnormal: true,
          isCritical: false,
          effectiveRangeText: rangeText,
        };
      }
      if (targetRange.max !== undefined && num > targetRange.max) {
        return {
          flag: 'HIGH',
          label: 'HIGH',
          isAbnormal: true,
          isCritical: false,
          effectiveRangeText: rangeText,
        };
      }
    }
  }

  // For text/options checks (e.g. "Positive (+)", "Reactive")
  const lower = valStr.toLowerCase();
  if (
    lower.includes('positive') ||
    lower.includes('reactive') ||
    lower.includes('isolated') ||
    lower.includes('turbid') ||
    lower.includes('+++') ||
    lower.includes('++++')
  ) {
    return {
      flag: 'HIGH',
      label: 'ABNORMAL / REACTIVE',
      isAbnormal: true,
      isCritical: false,
      effectiveRangeText: rangeText,
    };
  }

  return {
    flag: 'NORMAL',
    label: 'Normal',
    isAbnormal: false,
    isCritical: false,
    effectiveRangeText: rangeText,
  };
}
