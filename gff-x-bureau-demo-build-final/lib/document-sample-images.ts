/**
 * Real sample document images provided by the user.
 * Maps countryCode → docTypeId → { front, back }
 * These are used as card backgrounds in IDCardDocument.
 */

export interface DocSampleImages {
  front: string;
  back: string;
}

export interface CountrySelfieImage {
  selfie: string;
}

// 5 Accepted countries with full image sets (front, back, selfie)
export const ACCEPTED_COUNTRIES = ['AU', 'GB', 'NZ', 'US', 'DE'] as const;

export function isAcceptedCountry(countryCode: string): boolean {
  return ACCEPTED_COUNTRIES.includes(countryCode as typeof ACCEPTED_COUNTRIES[number]);
}

// Selfie images for the 5 accepted countries
const COUNTRY_SELFIES: Record<string, string> = {
  AU: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aus%20Selfie-qqqrpU6KDt5f4dfxTCJVvZJnVbPrYV.png',
  GB: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UK%20selfie-6OyUmIXZx5TH4x8H4j2mna4atuuV63.png',
  NZ: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NZ%20selfie-Cm7cWOYNest9Zx5mpbw1k4edrGApBE.png',
  US: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/US%20Selfie-LdjgLHVZ4g0yqk3MhWBmAmYBoVNE7r.png',
  DE: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Germany%20Selfie-9RjODNBMiiocAuYdOdWuC10enYBuiC.png',
};

/**
 * Returns the selfie image URL for an accepted country.
 */
export function getCountrySelfie(countryCode: string): string | null {
  return COUNTRY_SELFIES[countryCode] ?? null;
}

// Map: countryCode → docTypeId → images
const DOC_SAMPLE_IMAGES: Record<string, Record<string, DocSampleImages>> = {
  SA: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SA%20Front%20%281%29-k3wwwNTQOvV1LIBfzveBUoTfallZQW.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SA%20Back%20%281%29-V8Hj5urYoW5AjeHObc3zmgBMINdftJ.png',
    },
  },
  AE: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UAE%20ID%20front-min-G6HrxoCbAsUxgnUlcAgiA7A09K6EPG.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UAE%20ID%20back-min-WchvTEPRsK1XqXJO3Y3Bf5pshewzc3.png',
    },
    resident_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UAE%20ID%20front-min-G6HrxoCbAsUxgnUlcAgiA7A09K6EPG.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UAE%20ID%20back-min-WchvTEPRsK1XqXJO3Y3Bf5pshewzc3.png',
    },
  },
  TR: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Turkiye%20Front.jpg-EwTUzLuXs1171FHPSfVGISiIRMrwb8.jpeg',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Turkiye%20Back-XaSeowMe7hB868iHqbM5Y10opIcdLj.png',
    },
  },
  VN: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vietnam%20Front.jpg-8KXr6KlB96g7dT8Pj1kxUjGgIOG4ED.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vietnam%20Back.jpg-E5EVoxQv24pJYLvcpoRABFqD0VT6tz.png',
    },
  },
  TH: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thai%20Front-amPVCJWTWIDlovsyOhwLMPHlOJFsyh.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thai%20Back-eYDb4335CuuyWgJnM5OGRhKWIUroOk.png',
    },
  },
  PH: {
    philsys: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHL%20Front-FA2HOpDHQ5XmikySiRzSvI935ZM99h.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHL%20Back-9RxQOseuPIDTQpAkMEtHp5bIeaQ5F2.png',
    },
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHL%20Front-FA2HOpDHQ5XmikySiRzSvI935ZM99h.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHL%20Back-9RxQOseuPIDTQpAkMEtHp5bIeaQ5F2.png',
    },
  },
  SK: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slovakia%20Front-vfe6KCCkaPPuU3tSLxKOaA2X5T1GW3.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slovakia%20Back-wPqYYYyab7hON72ondMYY6bkdFtK5k.png',
    },
  },
  SG: {
    nric: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Singapore%20NID%20Front-MAvIE5U4pBFgXEsA3UzOTTROYxvw2a.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Singapore%20NID%20Back-WHBv1p5Gf4MindBNwoGRFa15CEYtTT.png',
    },
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Singapore%20NID%20Front-MAvIE5U4pBFgXEsA3UzOTTROYxvw2a.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Singapore%20NID%20Back-WHBv1p5Gf4MindBNwoGRFa15CEYtTT.png',
    },
  },
  SE: {
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sweden%20Front-MxYXsilGymQU2RvGymbtKtDN4fuE6g.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sweden%20Back-rHlDYpCPfTOV2lZqBE7LpAOhM3dUnu.png',
    },
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sweden%20Front-MxYXsilGymQU2RvGymbtKtDN4fuE6g.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sweden%20Back-rHlDYpCPfTOV2lZqBE7LpAOhM3dUnu.png',
    },
  },
  ES: {
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spain%20Front-I4Gxu89Swfdi1MD0NlaCr4Gjy13STd.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spain%20Back-DLneCae9dM2IIroHqbxq60SHGb99uw.png',
    },
  },

  // --- Batch 2 ---
  NL: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Neterlands%20Front-o2GUdmeyYrLFaAwD0EwWglHgaki7p0.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Neterlands%20Front-o2GUdmeyYrLFaAwD0EwWglHgaki7p0.png',
    },
  },
  MX: {
    ine: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mexico%20Front-furZ7FgVPdqIKEiS7fT3SQbu1t3IYz.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mexico%20Back-YKHEjuduuWh57KHlBuenXdDn1Vuv1I.png',
    },
  },
  CZ: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Czechia%20Front-ODVo6sOMMYmm5VG1vDWbEo54QBALYz.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Czechia%20Front-ODVo6sOMMYmm5VG1vDWbEo54QBALYz.png',
    },
  },
  IT: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Italy%20Front-LU5w5AWiW1KptfTX0xCTYxHqBeEtre.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Italy%20Back-3mx5VgW8kJayE0bTaYWaU89JZ6ZYd9.png',
    },
  },
  NZ: {
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Newzeland%20Front-7gvjvRi9tR48maLMe0YTqFfSy2eqUz.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Newzeland%20Back-mSpUJTQTdcAcUGT2PE9XM7OYm9id5n.png',
    },
  },
  NG: {
    nin: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nigeria%20Front-En15AWunHN8t3Pw2h2DsSf3TGOFecO.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nigeria%20Back-FpCooRjkP6QSiidLmHDBUaiAFzj2PH.png',
    },
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nigeria%20Front-En15AWunHN8t3Pw2h2DsSf3TGOFecO.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nigeria%20Back-FpCooRjkP6QSiidLmHDBUaiAFzj2PH.png',
    },
  },
  KW: {
    civil_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuwait%201%20Front-Gz9HtbxxAxA9AiKfyqOUwqVilu0DI9.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuwait%201%20Back-SWLBYZuX0uA1KpRtVpXkWgWtpUQwCy.png',
    },
  },
  MY: {
    mykad: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Malaysia%20Front-jTkDNdIU2JxpyR9lUpDyIyF2Y1ZX0c.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Malaysia%20Back-FR04ejw00ny6ZhcUtuhZTRbZSIDsK7.png',
    },
  },
  FR: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/France%20Front-opmhSyrwk00DLxHWXBE2S8qu9DcJZ2.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/France%20back-yddN1HctabxqQxPZOOmFRjzpN6tf1Y.png',
    },
  },
  IE: {
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ireland%20Front-fouANCzbNed8A5peZPzUP4kcl1DSvM.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ireland%20Back-XHgfzm2BOD8xWYugGxYK1SunKbE0NH.png',
    },
  },
  HK: {
    hkid: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HongKong%20Front-cus0sAVnNijyZNKF0Mrr8CjlAqTtA6.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hongkong%20Back-ukjzlvO6XccZmcrIwJ0JHdnSiEQHrF.png',
    },
  },

  // --- Batch 3 ---
  CO: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Columbia%20Front-8jBiNlzqh1XKUQODHpVOYsiWYGEk05.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Columbia%20Back-Ot9LivuC2xlXs6sA3fBIa3HpzyARew.png',
    },
  },
  CA: {
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Canada%20Front-JiV58aq4kCutI5Z5YYzokYwjR5K2U1.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Canada%20Back-5iHjS733BD4ejgQMWJ38rXxVPQYiqi.png',
    },
  },
  BE: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Belgium%20Front-QssrLZNKECQYoiCdQoiQGl75v66neG.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Belgium%20Back-9amcF8cnHEtLA17RCTBmvgfx1QrgyQ.png',
    },
  },
  AT: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Austria%20Front-tkqqnZsfo9sie4vRzAKz3W1zrewrJk.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Austria%20Back-9Bk1J5R1gr3arloYxXPwfCb79I0gqa.png',
    },
  },
  AR: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Argentina%20Front-21rlllNN4B7XLrmLK6kOZI0PkWJZwV.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Argentina%20Back-5NRBDpqVmcFOjLz1JnfGrlL96EdEBm.png',
    },
    dni: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Argentina%20Front-21rlllNN4B7XLrmLK6kOZI0PkWJZwV.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Argentina%20Back-5NRBDpqVmcFOjLz1JnfGrlL96EdEBm.png',
    },
  },
  CY: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyprus%20Front-xZfqVBppAjO66enddKOt1BhYhutozN.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cyprus%20back-Q66frtD0aVMuTRyV1IjtznegdhvTAn.png',
    },
  },
  HR: {
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Croatia%20Front-oERuMPq6SYCrguhsBxGkA4bhMvEBvh.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Croatia%20Back-AfRojFF24NI3DZfDFVGByiJHcREE2B.png',
    },
  },
  AU: {
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aus%20front-f9dvDiYaCmGTrNlifzAyV6JELmIlP2.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aus%20Back-3sGBLbcjUxz2kUJsVZH9rUUuqjMSsS.png',
    },
  },
  // Accepted country: United Kingdom
  GB: {
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UK%20front-QEiI2XzyqeTyGxgZTyMJWkKJLnuiae.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UK%20back-UsBCk5HKDbDoUHAhgPjYhiXbcGEovq.png',
    },
    driving_licence: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UK%20front-QEiI2XzyqeTyGxgZTyMJWkKJLnuiae.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UK%20back-UsBCk5HKDbDoUHAhgPjYhiXbcGEovq.png',
    },
  },
  // Accepted country: New Zealand (update with new images)
  NZ: {
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nz%20front-i3cTUAzoZt2YL8AWhYhrrljt5fkBOA.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nz%20back-hUPJ10IJunUEpFVWrhdZyjw0rrD46R.png',
    },
    driver_licence: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nz%20front-i3cTUAzoZt2YL8AWhYhrrljt5fkBOA.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nz%20back-hUPJ10IJunUEpFVWrhdZyjw0rrD46R.png',
    },
  },
  // Accepted country: United States
  US: {
    identification_card: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Us%20front%20-3mJiSqrek6uMHzmQaCbYRfO2ZHIpiA.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Us%20back-ULIOcMRcvQbnoGcr48EDE3WbOR3bYL.png',
    },
    drivers_license: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Us%20front%20-3mJiSqrek6uMHzmQaCbYRfO2ZHIpiA.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Us%20back-ULIOcMRcvQbnoGcr48EDE3WbOR3bYL.png',
    },
  },
  // Accepted country: Germany
  DE: {
    personalausweis: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Germany%20Front-wNeQEOmOJHPU1JcHIt1B5Twr9OujJk.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Germany%20back-ziqIZXJIpRKkbjYhUn93vLnpSZg5br.png',
    },
    national_id: {
      front: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Germany%20Front-wNeQEOmOJHPU1JcHIt1B5Twr9OujJk.png',
      back:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Germany%20back-ziqIZXJIpRKkbjYhUn93vLnpSZg5br.png',
    },
  },
};

/**
 * Returns the real sample images for a given country + document type, or null if none.
 */
export function getDocSampleImages(countryCode: string, docTypeId: string): DocSampleImages | null {
  const byCountry = DOC_SAMPLE_IMAGES[countryCode];
  if (!byCountry) return null;
  return byCountry[docTypeId] ?? null;
}

/**
 * Returns the first available sample images for a country (fallback).
 */
export function getFirstDocSampleImages(countryCode: string): DocSampleImages | null {
  const byCountry = DOC_SAMPLE_IMAGES[countryCode];
  if (!byCountry) return null;
  const first = Object.values(byCountry)[0];
  return first ?? null;
}

/**
 * Full mapping reference for documentation.
 *
 * Assigned countries & document types:
 * - SA  → National ID (national_id): Front + Back
 * - AE  → National ID / Resident ID Card (national_id, resident_id): Front + Back
 * - TR  → National ID (national_id): Front + Back
 * - VN  → National ID / CMND (national_id): Front + Back
 * - TH  → National ID Card (national_id): Front + Back
 * - PH  → PhilSys / National ID (philsys, national_id): Front + Back
 * - SK  → Občiansky preukaz / National ID (national_id): Front + Back
 * - SG  → NRIC / National ID (nric, national_id): Front + Back
 * - SE  → Körkort / Driver's License (drivers_license, national_id): Front + Back
 * - ES  → Driver's License / Permiso de Conducción (drivers_license): Front + Back
 */
export const DOCUMENT_ASSIGNMENT_SUMMARY = `
Country | Document Type               | ID Used
--------|-----------------------------|---------
SA      | National ID                 | national_id
AE      | Resident Identity Card      | national_id, resident_id
TR      | National ID (Kimlik Kartı)  | national_id
VN      | CMND (National ID)          | national_id
TH      | National ID Card            | national_id
PH      | PhilSys (National ID)       | philsys, national_id
SK      | Občiansky preukaz (ID Card) | national_id
SG      | NRIC                        | nric, national_id
SE      | Körkort (Driver's License)  | drivers_license, national_id
ES      | Permiso de Conducción       | drivers_license
`;
