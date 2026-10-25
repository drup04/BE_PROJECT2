export interface BrandConfig {
  productName: string;
  tagline: string;
  companyName: string;
  location: string;
  industry: string;
  currencySymbol: string;
  currencyCode: string;
  defaultGstRate: number;
  demoLabel: string;
  reportingPeriod: {
    current: string;
    previous: string;
    asOfDate: string;
  };
}

export const BRAND_CONFIG: BrandConfig = {
  productName: 'KaryaDesk',
  tagline: 'Agentic Operations & Verified Ledger Intelligence',
  companyName: 'Sahyadri Precision Works',
  location: 'MIDC Bhosari, Pune, Maharashtra',
  industry: 'Industrial Component Manufacturing & Precision Engineering',
  currencySymbol: '₹',
  currencyCode: 'INR',
  defaultGstRate: 18,
  demoLabel: 'Demo workspace • Sample data',
  reportingPeriod: {
    current: 'October 2026',
    previous: 'September 2026',
    asOfDate: '2026-10-25',
  },
};
