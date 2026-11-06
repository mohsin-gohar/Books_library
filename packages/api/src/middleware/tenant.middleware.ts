import { Request, Response, NextFunction } from 'express';

export interface TenantContext {
  organizationId: string;
  organizationSlug: string;
  branchId?: string;
  departmentId?: string;
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

/**
 * Enterprise Multi-Tenant Extraction Middleware
 * Resolves tenant from:
 * 1. Subdomain: e.g. oxford.librarysaas.com -> slug="oxford"
 * 2. Header: X-Tenant-ID / X-Organization-Slug
 * 3. Fallback: Default system demo tenant
 */
export function tenantMiddleware(req: Request, res: Response, next: NextFunction): void {
  let orgId = (req.headers['x-tenant-id'] as string) || '';
  let orgSlug = (req.headers['x-organization-slug'] as string) || '';
  const branchId = (req.headers['x-branch-id'] as string) || undefined;
  const departmentId = (req.headers['x-department-id'] as string) || undefined;

  // Domain/subdomain fallback resolution
  const host = req.hostname || req.headers.host || '';
  const hostParts = host.split('.');
  if (!orgSlug && hostParts.length >= 3) {
    orgSlug = hostParts[0];
  }

  // Default fallback for development
  if (!orgId && !orgSlug) {
    orgId = 'org-athenaeum-main';
    orgSlug = 'athenaeum';
  } else if (!orgId && orgSlug) {
    orgId = `org-${orgSlug}`;
  }

  req.tenant = {
    organizationId: orgId,
    organizationSlug: orgSlug,
    branchId,
    departmentId,
  };

  res.setHeader('X-Tenant-Resolved', orgId);
  next();
}
