/**
 * Athenaeum Enterprise RBAC: 60+ Granular Permissions
 * Across 7 Core Modules + Tenancy + Security
 */

export const Permissions = {
  // 1. Tenancy & Organization Management (7)
  TENANT_CREATE: 'tenant:create',
  TENANT_READ: 'tenant:read',
  TENANT_UPDATE: 'tenant:update',
  TENANT_DELETE: 'tenant:delete',
  BRANCH_MANAGE: 'branch:manage',
  DEPARTMENT_MANAGE: 'department:manage',
  TENANT_BILLING_VIEW: 'tenant:billing:view',

  // 2. Identity & Access Control (RBAC) (8)
  USER_INVITE: 'user:invite',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',

  // 3. Module 1: Catalog Module (10)
  CATALOG_VIEW: 'catalog:view',
  CATALOG_CREATE: 'catalog:create',
  CATALOG_UPDATE: 'catalog:update',
  CATALOG_DELETE: 'catalog:delete',
  CATALOG_IMPORT_API: 'catalog:import:api',
  CATALOG_EXPORT: 'catalog:export',
  CATALOG_BATCH_UPDATE: 'catalog:batch:update',
  CATALOG_INVENTORY_MANAGE: 'catalog:inventory:manage',
  CATALOG_CLASSIFICATION_EDIT: 'catalog:classification:edit',
  CATALOG_BARCODE_GENERATE: 'catalog:barcode:generate',

  // 4. Module 2: Circulation Module (9)
  CIRCULATION_CHECKOUT: 'circulation:checkout',
  CIRCULATION_CHECKIN: 'circulation:checkin',
  CIRCULATION_RENEW: 'circulation:renew',
  CIRCULATION_HOLD_CREATE: 'circulation:hold:create',
  CIRCULATION_HOLD_CANCEL: 'circulation:hold:cancel',
  CIRCULATION_FINE_ASSESS: 'circulation:fine:assess',
  CIRCULATION_FINE_WAIVE: 'circulation:fine:waive',
  CIRCULATION_INTERLIBRARY_LOAN: 'circulation:interlibrary:loan',
  CIRCULATION_COURIER_DISPATCH: 'circulation:courier:dispatch',

  // 5. Module 3: Members Module (8)
  MEMBER_VIEW: 'member:view',
  MEMBER_CREATE: 'member:create',
  MEMBER_UPDATE: 'member:update',
  MEMBER_SUSPEND: 'member:suspend',
  MEMBER_CARD_ISSUE: 'member:card:issue',
  MEMBER_KYC_VERIFY: 'member:kyc:verify',
  MEMBER_NOTES_MANAGE: 'member:notes:manage',
  MEMBER_EXPORT_GDPR: 'member:export:gdpr',

  // 6. Module 4: Reading Journeys & Premium (9)
  JOURNEY_GOALS_MANAGE: 'journey:goals:manage',
  JOURNEY_RECOMMENDATIONS_VIEW: 'journey:recommendations:view',
  JOURNEY_BOOK_CLUBS_CREATE: 'journey:bookclubs:create',
  JOURNEY_BOOK_CLUBS_MODERATE: 'journey:bookclubs:moderate',
  JOURNEY_CHALLENGES_CREATE: 'journey:challenges:create',
  JOURNEY_BADGES_AWARD: 'journey:badges:award',
  JOURNEY_STREAKS_OVERRIDE: 'journey:streaks:override',
  JOURNEY_CURATION_PUBLISH: 'journey:curation:publish',
  JOURNEY_REVIEWS_MODERATE: 'journey:reviews:moderate',

  // 7. Module 5: Analytics & Intelligence (6)
  ANALYTICS_DASHBOARD_VIEW: 'analytics:dashboard:view',
  ANALYTICS_REPORTS_GENERATE: 'analytics:reports:generate',
  ANALYTICS_EXPORTS_RAW: 'analytics:exports:raw',
  ANALYTICS_AI_INSIGHTS: 'analytics:ai:insights',
  ANALYTICS_AUDIT_LOG_VIEW: 'analytics:auditlog:view',
  ANALYTICS_INVENTORY_FORECAST: 'analytics:inventory:forecast',

  // 8. Module 6: Accounting & Finance (7)
  ACCOUNTING_INVOICES_VIEW: 'accounting:invoices:view',
  ACCOUNTING_INVOICES_CREATE: 'accounting:invoices:create',
  ACCOUNTING_PAYMENTS_CAPTURE: 'accounting:payments:capture',
  ACCOUNTING_REFUND_PROCESS: 'accounting:refund:process',
  ACCOUNTING_SUBSCRIPTION_MANAGE: 'accounting:subscription:manage',
  ACCOUNTING_BUDGET_ALLOCATE: 'accounting:budget:allocate',
  ACCOUNTING_FINANCIAL_REPORTS: 'accounting:financial:reports',

  // 9. Module 7: Integrations & Webhooks (7)
  INTEGRATIONS_CONFIG_VIEW: 'integrations:config:view',
  INTEGRATIONS_CONFIG_MANAGE: 'integrations:config:manage',
  INTEGRATIONS_API_KEYS_GENERATE: 'integrations:apikeys:generate',
  INTEGRATIONS_WEBHOOKS_MANAGE: 'integrations:webhooks:manage',
  INTEGRATIONS_SSO_CONFIGURE: 'integrations:sso:configure',
  INTEGRATIONS_CRM_SYNC: 'integrations:crm:sync',
  INTEGRATIONS_WHITELABEL_EDIT: 'integrations:whitelabel:edit',
} as const;

export type PermissionKey = keyof typeof Permissions;
export type PermissionString = typeof Permissions[PermissionKey];

export type EnterpriseSystemRole =
  | 'Super Admin'
  | 'Institution Admin'
  | 'Librarian'
  | 'Member'
  | 'Viewer';

export interface CustomRoleDefinition {
  id: string;
  name: string;
  organizationId: string;
  description: string;
  isSystem: boolean;
  permissions: PermissionString[];
  userCount?: number;
  createdAt: string;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<EnterpriseSystemRole, PermissionString[]> = {
  'Super Admin': Object.values(Permissions),
  'Institution Admin': Object.values(Permissions).filter(
    (p) => p !== Permissions.TENANT_CREATE && p !== Permissions.TENANT_DELETE
  ),
  'Librarian': [
    Permissions.CATALOG_VIEW,
    Permissions.CATALOG_CREATE,
    Permissions.CATALOG_UPDATE,
    Permissions.CATALOG_IMPORT_API,
    Permissions.CATALOG_EXPORT,
    Permissions.CATALOG_INVENTORY_MANAGE,
    Permissions.CATALOG_BARCODE_GENERATE,
    Permissions.CIRCULATION_CHECKOUT,
    Permissions.CIRCULATION_CHECKIN,
    Permissions.CIRCULATION_RENEW,
    Permissions.CIRCULATION_HOLD_CREATE,
    Permissions.CIRCULATION_HOLD_CANCEL,
    Permissions.CIRCULATION_FINE_ASSESS,
    Permissions.CIRCULATION_COURIER_DISPATCH,
    Permissions.MEMBER_VIEW,
    Permissions.MEMBER_CREATE,
    Permissions.MEMBER_UPDATE,
    Permissions.MEMBER_CARD_ISSUE,
    Permissions.MEMBER_NOTES_MANAGE,
    Permissions.JOURNEY_RECOMMENDATIONS_VIEW,
    Permissions.JOURNEY_BOOK_CLUBS_MODERATE,
    Permissions.JOURNEY_REVIEWS_MODERATE,
    Permissions.JOURNEY_CURATION_PUBLISH,
    Permissions.ANALYTICS_DASHBOARD_VIEW,
    Permissions.ANALYTICS_REPORTS_GENERATE,
    Permissions.ACCOUNTING_INVOICES_VIEW,
    Permissions.ACCOUNTING_PAYMENTS_CAPTURE,
  ],
  'Member': [
    Permissions.CATALOG_VIEW,
    Permissions.CIRCULATION_HOLD_CREATE,
    Permissions.CIRCULATION_RENEW,
    Permissions.JOURNEY_GOALS_MANAGE,
    Permissions.JOURNEY_RECOMMENDATIONS_VIEW,
    Permissions.JOURNEY_BOOK_CLUBS_CREATE,
    Permissions.ACCOUNTING_INVOICES_VIEW,
  ],
  'Viewer': [
    Permissions.CATALOG_VIEW,
    Permissions.JOURNEY_RECOMMENDATIONS_VIEW,
    Permissions.ANALYTICS_DASHBOARD_VIEW,
  ],
};
