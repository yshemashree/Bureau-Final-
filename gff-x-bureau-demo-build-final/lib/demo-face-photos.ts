/**
 * Face photo URLs for demo identity documents.
 *
 * For ACCEPTED countries (AU, GB, NZ, US, DE):
 * - Uses the actual selfie images from blob storage (same face as document)
 *
 * For REJECTED countries (all others):
 * - Uses a mismatched randomuser.me portrait (different face = face match fails)
 */

import { getCountrySelfie, isAcceptedCountry, getFirstDocSampleImages } from './document-sample-images';

export interface FacePhotos {
  /** Photo shown on the ID document front (small photo area) */
  documentFace: string;
  /** Photo shown in the selfie capture — matches document for approved, different for rejected */
  selfieFace: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MISMATCHED SELFIE FOR REJECTED COUNTRIES
// ─────────────────────────────────────────────────────────────────────────────

/** Generic mismatched selfie for rejected countries — clearly different person */
const MISMATCHED_SELFIE = 'https://randomuser.me/api/portraits/men/32.jpg';

/** Fallback document face for countries without real images */
const FALLBACK_DOCUMENT_FACE = 'https://randomuser.me/api/portraits/men/75.jpg';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function getDemoFacePhotos(countryCode: string, scenario: 'success' | 'failure'): FacePhotos {
  const isAccepted = isAcceptedCountry(countryCode);
  
  if (isAccepted) {
    // ACCEPTED COUNTRIES: Use country's actual selfie (same face as document)
    const selfie = getCountrySelfie(countryCode);
    return {
      documentFace: selfie || FALLBACK_DOCUMENT_FACE,
      selfieFace: selfie || FALLBACK_DOCUMENT_FACE,
    };
  } else {
    // REJECTED COUNTRIES: Use mismatched selfie (different person = face match fails)
    // The document face comes from the country's document image if available
    const docImages = getFirstDocSampleImages(countryCode);
    return {
      documentFace: docImages?.front || FALLBACK_DOCUMENT_FACE,
      selfieFace: MISMATCHED_SELFIE, // Different person = mismatch!
    };
  }
}

/**
 * Get selfie URL for a country — accepted countries get their real selfie,
 * rejected countries get the mismatched selfie.
 */
export function getSelfieUrl(countryCode: string): string {
  if (isAcceptedCountry(countryCode)) {
    return getCountrySelfie(countryCode) || MISMATCHED_SELFIE;
  }
  return MISMATCHED_SELFIE;
}
