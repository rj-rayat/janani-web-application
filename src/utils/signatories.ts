/**
 * Signature-block rules for printed / verified reports.
 *
 * USG (Ultrasonography) and X-Ray / plain radiology reports are signed by the
 * reporting radiologist / sonologist alone — a single signature. Every other
 * discipline (Pathology, Biochemistry, Microbiology, Histopathology,
 * Cardiology / Echo, ...) keeps the full 3-way prepared / checked / authorized
 * sign-off.
 */

interface SignatorySubject {
  category?: string;
  testName?: string;
}

/** True for USG & X-Ray style reports that need only the doctor's signature. */
export const isSingleSignatoryReport = ({
  category,
  testName,
}: SignatorySubject): boolean => {
  const c = (category || '').toLowerCase();
  const t = (testName || '').toLowerCase();

  // Explicitly keep the full sign-off for these disciplines.
  if (
    c.includes('cardio') ||
    c.includes('echo') ||
    c.includes('histopath') ||
    c.includes('patho') ||
    c.includes('biochem') ||
    c.includes('micro') ||
    c.includes('hemato') ||
    c.includes('haemato')
  ) {
    return false;
  }

  return (
    c.includes('ultrason') ||
    c.includes('usg') ||
    c.includes('sonogra') ||
    c.includes('radiolog') ||
    c.includes('x-ray') ||
    c.includes('x ray') ||
    t.includes('ultrason') ||
    t.includes('usg') ||
    t.includes('x-ray') ||
    t.includes('x ray')
  );
};

/** Default number of printed signature slots for a report. */
export const getDefaultSignatoryCount = (
  subject: SignatorySubject
): 1 | 2 | 3 => (isSingleSignatoryReport(subject) ? 1 : 3);

/**
 * Given the full ordered signatory list ([prepared, checked, authorized]),
 * pick which slot indices to actually show for a requested count. The
 * authorizing signatory (last entry) is always kept, so "1 signatory" always
 * means the doctor — never the technician who happens to sit in slot 1.
 */
export const pickSignatoryIndices = (total: number, count: number): number[] => {
  if (total <= 0) return [];
  const n = Math.max(1, Math.min(count || 1, total));
  if (n >= total) return Array.from({ length: total }, (_, i) => i);
  if (n === 1) return [total - 1];
  // Always keep the authorizing signatory (last), fill the rest from the front.
  const front = Array.from({ length: n - 1 }, (_, i) => i);
  return [...front, total - 1];
};

/** Convenience: apply {@link pickSignatoryIndices} to an actual list. */
export const pickSignatories = <T,>(ordered: T[], count: number): T[] =>
  pickSignatoryIndices(ordered.length, count).map((i) => ordered[i]);
