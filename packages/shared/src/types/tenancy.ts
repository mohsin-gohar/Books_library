/**
 * Multi-tenant Organization Hierarchy & White-Labeling Contracts
 */

export interface TenantOrganization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  plan: 'Starter' | 'Professional' | 'Enterprise' | 'Consortium';
  status: 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
  branchesCount: number;
  totalMembers: number;
  createdAt: string;
  settings: TenantSettings;
}

export interface TenantBranch {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
  isMainCampus: boolean;
  departments: TenantDepartment[];
}

export interface TenantDepartment {
  id: string;
  branchId: string;
  name: string;
  code: string;
  floorLocation?: string;
}

export interface WhiteLabelConfig {
  organizationId: string;
  brandName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: 'Instrument Serif' | 'Inter' | 'Cinzel' | 'Playfair Display' | 'System';
  customDomain?: string;
  faviconUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  removeAthenaeumBranding: boolean;
  customEmailTemplates: {
    welcomeSubject?: string;
    overdueNoticeSubject?: string;
    clubInviteSubject?: string;
  };
}

export interface TenantSettings {
  maxRenewals: number;
  defaultLoanPeriodDays: number;
  finePerDayCents: number;
  enablePublicPortal: boolean;
  enableSso: boolean;
  enableBookClubs: boolean;
  enableAccounting: boolean;
  whiteLabel: WhiteLabelConfig;
}
