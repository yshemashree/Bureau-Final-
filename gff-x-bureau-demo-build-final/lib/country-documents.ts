/**
 * Country document configuration.
 * This file is a server-side only config — it is NOT exposed as an API route.
 * Add or edit per-country document types and sample data here directly.
 */

export interface DocumentType {
  id: string;
  label: string;
}

export interface CountryDocumentConfig {
  countryCode: string;
  countryName: string;
  documentTypes: DocumentType[];
  /** Sample front image path under /public/samples/{countryCode}/ */
  sampleFront?: string;
  /** Sample back image path under /public/samples/{countryCode}/ */
  sampleBack?: string;
}

export const COUNTRY_DOCUMENT_CONFIG: Record<string, CountryDocumentConfig> = {
  AR: {
    countryCode: 'AR',
    countryName: 'Argentina',
    documentTypes: [
      { id: 'national_id', label: 'National ID (DNI)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/AR/front.jpg',
    sampleBack: '/samples/AR/back.jpg',
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia',
    documentTypes: [
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'medicare', label: 'Medicare Card' },
    ],
    sampleFront: '/samples/AU/front.jpg',
    sampleBack: '/samples/AU/back.jpg',
  },
  AT: {
    countryCode: 'AT',
    countryName: 'Austria',
    documentTypes: [
      { id: 'national_id', label: 'National ID Card' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/AT/front.jpg',
    sampleBack: '/samples/AT/back.jpg',
  },
  BE: {
    countryCode: 'BE',
    countryName: 'Belgium',
    documentTypes: [
      { id: 'national_id', label: 'National ID Card (eID)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/BE/front.jpg',
    sampleBack: '/samples/BE/back.jpg',
  },
  BR: {
    countryCode: 'BR',
    countryName: 'Brazil',
    documentTypes: [
      { id: 'cpf', label: 'CPF' },
      { id: 'rg', label: 'RG (Registro Geral)' },
      { id: 'passport', label: 'Passport' },
      { id: 'cnh', label: 'CNH (Driver\'s License)' },
    ],
    sampleFront: '/samples/BR/front.jpg',
    sampleBack: '/samples/BR/back.jpg',
  },
  KH: {
    countryCode: 'KH',
    countryName: 'Cambodia',
    documentTypes: [
      { id: 'national_id', label: 'National ID Card' },
      { id: 'passport', label: 'Passport' },
    ],
    sampleFront: '/samples/KH/front.jpg',
    sampleBack: '/samples/KH/back.jpg',
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    documentTypes: [
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'health_card', label: 'Provincial Health Card' },
      { id: 'pr_card', label: 'Permanent Resident Card' },
    ],
    sampleFront: '/samples/CA/front.jpg',
    sampleBack: '/samples/CA/back.jpg',
  },
  CL: {
    countryCode: 'CL',
    countryName: 'Chile',
    documentTypes: [
      { id: 'cedula', label: 'Cédula de Identidad' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/CL/front.jpg',
    sampleBack: '/samples/CL/back.jpg',
  },
  CN: {
    countryCode: 'CN',
    countryName: 'China',
    documentTypes: [
      { id: 'resident_id', label: 'Resident Identity Card (二代身份证)' },
      { id: 'passport', label: 'Passport' },
    ],
    sampleFront: '/samples/CN/front.jpg',
    sampleBack: '/samples/CN/back.jpg',
  },
  CZ: {
    countryCode: 'CZ',
    countryName: 'Czech Republic',
    documentTypes: [
      { id: 'national_id', label: 'National ID Card' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/CZ/front.jpg',
    sampleBack: '/samples/CZ/back.jpg',
  },
  DK: {
    countryCode: 'DK',
    countryName: 'Denmark',
    documentTypes: [
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'health_card', label: 'Health Insurance Card (Sundhedskort)' },
    ],
    sampleFront: '/samples/DK/front.jpg',
    sampleBack: '/samples/DK/back.jpg',
  },
  FI: {
    countryCode: 'FI',
    countryName: 'Finland',
    documentTypes: [
      { id: 'national_id', label: 'National ID Card' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/FI/front.jpg',
    sampleBack: '/samples/FI/back.jpg',
  },
  FR: {
    countryCode: 'FR',
    countryName: 'France',
    documentTypes: [
      { id: 'national_id', label: 'Carte Nationale d\'Identité' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: 'Permis de Conduire' },
    ],
    sampleFront: '/samples/FR/front.jpg',
    sampleBack: '/samples/FR/back.jpg',
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    documentTypes: [
      { id: 'national_id', label: 'Personalausweis (National ID)' },
      { id: 'passport', label: 'Reisepass (Passport)' },
      { id: 'drivers_license', label: 'Führerschein (Driver\'s License)' },
    ],
    sampleFront: '/samples/DE/front.jpg',
    sampleBack: '/samples/DE/back.jpg',
  },
  GR: {
    countryCode: 'GR',
    countryName: 'Greece',
    documentTypes: [
      { id: 'national_id', label: 'National ID Card (Ταυτότητα)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/GR/front.jpg',
    sampleBack: '/samples/GR/back.jpg',
  },
  HK: {
    countryCode: 'HK',
    countryName: 'Hong Kong',
    documentTypes: [
      { id: 'hkid', label: 'Hong Kong Identity Card (HKID)' },
      { id: 'passport', label: 'Passport' },
    ],
    sampleFront: '/samples/HK/front.jpg',
    sampleBack: '/samples/HK/back.jpg',
  },
  ID: {
    countryCode: 'ID',
    countryName: 'Indonesia',
    documentTypes: [
      { id: 'ktp', label: 'KTP (Kartu Tanda Penduduk)' },
      { id: 'passport', label: 'Passport' },
      { id: 'sim', label: 'SIM (Driver\'s License)' },
    ],
    sampleFront: '/samples/ID/front.jpg',
    sampleBack: '/samples/ID/back.jpg',
  },
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    documentTypes: [
      { id: 'aadhaar', label: 'Aadhaar Card' },
      { id: 'pan', label: 'PAN Card' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'voter_id', label: 'Voter ID' },
    ],
    sampleFront: '/samples/IN/front.jpg',
    sampleBack: '/samples/IN/back.jpg',
  },
  IT: {
    countryCode: 'IT',
    countryName: 'Italy',
    documentTypes: [
      { id: 'national_id', label: 'Carta d\'Identità' },
      { id: 'passport', label: 'Passaporto' },
      { id: 'drivers_license', label: 'Patente di Guida' },
      { id: 'codice_fiscale', label: 'Codice Fiscale' },
    ],
    sampleFront: '/samples/IT/front.jpg',
    sampleBack: '/samples/IT/back.jpg',
  },
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    documentTypes: [
      { id: 'national_id', label: 'National ID Card' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/KE/front.jpg',
    sampleBack: '/samples/KE/back.jpg',
  },
  MY: {
    countryCode: 'MY',
    countryName: 'Malaysia',
    documentTypes: [
      { id: 'mykad', label: 'MyKad (National ID)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/MY/front.jpg',
    sampleBack: '/samples/MY/back.jpg',
  },
  MX: {
    countryCode: 'MX',
    countryName: 'Mexico',
    documentTypes: [
      { id: 'ine', label: 'INE / IFE (Voter ID)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'curp', label: 'CURP' },
    ],
    sampleFront: '/samples/MX/front.jpg',
    sampleBack: '/samples/MX/back.jpg',
  },
  MA: {
    countryCode: 'MA',
    countryName: 'Morocco',
    documentTypes: [
      { id: 'national_id', label: 'Carte Nationale d\'Identité (CIN)' },
      { id: 'passport', label: 'Passport' },
    ],
    sampleFront: '/samples/MA/front.jpg',
    sampleBack: '/samples/MA/back.jpg',
  },
  NL: {
    countryCode: 'NL',
    countryName: 'Netherlands',
    documentTypes: [
      { id: 'national_id', label: 'Identiteitskaart (ID Card)' },
      { id: 'passport', label: 'Paspoort' },
      { id: 'drivers_license', label: 'Rijbewijs (Driver\'s License)' },
    ],
    sampleFront: '/samples/NL/front.jpg',
    sampleBack: '/samples/NL/back.jpg',
  },
  NZ: {
    countryCode: 'NZ',
    countryName: 'New Zealand',
    documentTypes: [
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'birth_certificate', label: 'Birth Certificate' },
    ],
    sampleFront: '/samples/NZ/front.jpg',
    sampleBack: '/samples/NZ/back.jpg',
  },
  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    documentTypes: [
      { id: 'nin', label: 'National Identification Number (NIN)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'voters_card', label: "Voter's Card (PVC)" },
    ],
    sampleFront: '/samples/NG/front.jpg',
    sampleBack: '/samples/NG/back.jpg',
  },
  PE: {
    countryCode: 'PE',
    countryName: 'Peru',
    documentTypes: [
      { id: 'dni', label: 'DNI (Documento Nacional de Identidad)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/PE/front.jpg',
    sampleBack: '/samples/PE/back.jpg',
  },
  PH: {
    countryCode: 'PH',
    countryName: 'Philippines',
    documentTypes: [
      { id: 'philsys', label: 'PhilSys (National ID)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'sss', label: 'SSS ID' },
      { id: 'umid', label: 'UMID Card' },
    ],
    sampleFront: '/samples/PH/front.jpg',
    sampleBack: '/samples/PH/back.jpg',
  },
  PL: {
    countryCode: 'PL',
    countryName: 'Poland',
    documentTypes: [
      { id: 'national_id', label: 'Dowód Osobisty (National ID)' },
      { id: 'passport', label: 'Paszport' },
      { id: 'drivers_license', label: 'Prawo Jazdy (Driver\'s License)' },
    ],
    sampleFront: '/samples/PL/front.jpg',
    sampleBack: '/samples/PL/back.jpg',
  },
  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    documentTypes: [
      { id: 'nric', label: 'NRIC (National Registration ID Card)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'fin', label: 'FIN (Foreign ID Number)' },
    ],
    sampleFront: '/samples/SG/front.jpg',
    sampleBack: '/samples/SG/back.jpg',
  },
  SK: {
    countryCode: 'SK',
    countryName: 'Slovakia',
    documentTypes: [
      { id: 'national_id', label: 'Občiansky preukaz (ID Card)' },
      { id: 'passport', label: 'Cestovný pas (Passport)' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/SK/front.jpg',
    sampleBack: '/samples/SK/back.jpg',
  },
  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    documentTypes: [
      { id: 'smart_id', label: 'Smart ID Card' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/ZA/front.jpg',
    sampleBack: '/samples/ZA/back.jpg',
  },
  ES: {
    countryCode: 'ES',
    countryName: 'Spain',
    documentTypes: [
      { id: 'dni', label: 'DNI (Documento Nacional de Identidad)' },
      { id: 'passport', label: 'Pasaporte' },
      { id: 'drivers_license', label: 'Carné de Conducir' },
      { id: 'nie', label: 'NIE (Foreigners ID)' },
    ],
    sampleFront: '/samples/ES/front.jpg',
    sampleBack: '/samples/ES/back.jpg',
  },
  SE: {
    countryCode: 'SE',
    countryName: 'Sweden',
    documentTypes: [
      { id: 'national_id', label: 'Nationellt ID-kort' },
      { id: 'passport', label: 'Pass (Passport)' },
      { id: 'drivers_license', label: 'Körkort (Driver\'s License)' },
    ],
    sampleFront: '/samples/SE/front.jpg',
    sampleBack: '/samples/SE/back.jpg',
  },
  CH: {
    countryCode: 'CH',
    countryName: 'Switzerland',
    documentTypes: [
      { id: 'national_id', label: 'Identitätskarte (ID Card)' },
      { id: 'passport', label: 'Reisepass (Passport)' },
      { id: 'drivers_license', label: 'Führerausweis (Driver\'s License)' },
    ],
    sampleFront: '/samples/CH/front.jpg',
    sampleBack: '/samples/CH/back.jpg',
  },
  TH: {
    countryCode: 'TH',
    countryName: 'Thailand',
    documentTypes: [
      { id: 'national_id', label: 'บัตรประชาชน (National ID Card)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
    sampleFront: '/samples/TH/front.jpg',
    sampleBack: '/samples/TH/back.jpg',
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    documentTypes: [
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'biometric_residence', label: 'Biometric Residence Permit' },
    ],
    sampleFront: '/samples/GB/front.jpg',
    sampleBack: '/samples/GB/back.jpg',
  },
  CO: {
    countryCode: 'CO',
    countryName: 'Colombia',
    documentTypes: [
      { id: 'national_id', label: 'Cédula de Ciudadanía' },
      { id: 'passport', label: 'Pasaporte' },
      { id: 'drivers_license', label: "Licencia de Conducción" },
    ],
  },
  CY: {
    countryCode: 'CY',
    countryName: 'Cyprus',
    documentTypes: [
      { id: 'national_id', label: 'Δελτίο Ταυτότητας (Identity Card)' },
      { id: 'passport', label: 'Passport' },
    ],
  },
  HR: {
    countryCode: 'HR',
    countryName: 'Croatia',
    documentTypes: [
      { id: 'national_id', label: 'Osobna Iskaznica (Identity Card)' },
      { id: 'passport', label: 'Putovnica (Passport)' },
      { id: 'drivers_license', label: "Vozačka Dozvola (Driver's License)" },
    ],
  },
  IE: {
    countryCode: 'IE',
    countryName: 'Ireland',
    documentTypes: [
      { id: 'drivers_license', label: 'Ceadúnas Tiomána (Driving Licence)' },
      { id: 'passport', label: 'Passport' },
      { id: 'public_services_card', label: 'Public Services Card' },
    ],
  },
  KW: {
    countryCode: 'KW',
    countryName: 'Kuwait',
    documentTypes: [
      { id: 'civil_id', label: 'Civil ID Card (بطاقة مدنية)' },
      { id: 'passport', label: 'Passport' },
    ],
  },
  SA: {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    documentTypes: [
      { id: 'national_id', label: 'National ID (Hawia Wataniya)' },
      { id: 'passport', label: 'Passport' },
      { id: 'iqama', label: 'Iqama (Residence Permit)' },
    ],
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    documentTypes: [
      { id: 'national_id', label: 'Emirates ID (National ID)' },
      { id: 'resident_id', label: 'Resident Identity Card' },
      { id: 'passport', label: 'Passport' },
    ],
  },
  TR: {
    countryCode: 'TR',
    countryName: 'Turkey',
    documentTypes: [
      { id: 'national_id', label: 'Kimlik Kartı (National ID)' },
      { id: 'passport', label: 'Pasaport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
  },
  VN: {
    countryCode: 'VN',
    countryName: 'Vietnam',
    documentTypes: [
      { id: 'national_id', label: 'CCCD / CMND (National ID)' },
      { id: 'passport', label: 'Passport' },
      { id: 'drivers_license', label: "Driver's License" },
    ],
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    documentTypes: [
      { id: 'drivers_license', label: "Driver's License" },
      { id: 'passport', label: 'Passport' },
      { id: 'state_id', label: 'State ID Card' },
      { id: 'passport_card', label: 'Passport Card' },
    ],
    sampleFront: '/samples/US/front.jpg',
    sampleBack: '/samples/US/back.jpg',
  },
};

/** Get the document config for a given country code, with a safe fallback. */
export function getCountryDocumentConfig(countryCode: string): CountryDocumentConfig {
  return (
    COUNTRY_DOCUMENT_CONFIG[countryCode] ?? {
      countryCode,
      countryName: countryCode,
      documentTypes: [
        { id: 'passport', label: 'Passport' },
        { id: 'national_id', label: 'National ID' },
        { id: 'drivers_license', label: "Driver's License" },
      ],
    }
  );
}
