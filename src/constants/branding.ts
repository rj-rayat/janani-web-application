export interface JananiBranding {
  name: string;
  fullName: string;
  tagline: string;
  logoPath: string;
  address: {
    line1: string;
    line2: string;
    area: string;
    city: string;
    country: string;
    postalCode: string;
  };
  contacts: {
    phone: string;
    phoneSecondary: string;
    whatsapp: string;
    email: string;
    website: string;
  };
  established: string;
  licenseNo: string;
  departments: string[];
}

export const JANANI_INFO: JananiBranding = {
  name: "Janani Diagnostic Center",
  fullName: "JANANI DIAGNOSTIC CENTER",
  tagline: "(Digital Diagnostic and Consultation Center)",
  logoPath: "/fj.png",
  address: {
    line1: "Amin Tower (2nd Floor), Opposite Feni Model Police Station Gate",
    line2: "Trunk Road, Feni",
    area: "Trunk Road",
    city: "Feni",
    country: "Bangladesh",
    postalCode: "3900",
  },
  contacts: {
    phone: "01711-307064",
    phoneSecondary: "",
    whatsapp: "01711-307064",
    email: "info@jananidc.com",
    website: "www.jananidc.com",
  },
  established: "Digital Diagnostic & Consultation Center",
  licenseNo: "DGHS/LAB/FENI/2024-8842",
  departments: [
    "Clinical Biochemistry",
    "Hematology & Hemostasis",
    "Microbiology & Serology",
    "Immunology & Hormones",
    "Clinical Pathology",
    "Digital X-Ray (500mA DR)",
    "4D Color Doppler Ultrasonography",
    "Cardiology (ECG & 2D Echo)",
    "Histopathology & Cytopathology",
  ],
};
