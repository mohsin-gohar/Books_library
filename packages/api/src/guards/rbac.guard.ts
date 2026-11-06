import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Permissions, PermissionString, EnterpriseSystemRole, DEFAULT_ROLE_PERMISSIONS } from '@athenaeum/shared';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: EnterpriseSystemRole | string;
  permissions: PermissionString[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'athenaeum-saas-enterprise-secret-key-2025';

export function authGuard(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization bearer header'
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;

    // Verify tenant cross-contamination protection
    if (req.tenant && req.tenant.organizationId !== payload.organizationId && payload.role !== 'Super Admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Cross-tenant access violation detected'
      });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired access token'
    });
  }
}

/**
 * RBAC Guard: Ensures caller possesses at least one or all required permissions
 */
export function requirePermissions(required: PermissionString[], requireAll: boolean = true) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
      return;
    }

    // Super Admin has universal access
    if (user.role === 'Super Admin') {
      next();
      return;
    }

    const userPermissions = new Set(user.permissions || []);
    const hasPermission = requireAll
      ? required.every((p) => userPermissions.has(p))
      : required.some((p) => userPermissions.has(p));

    if (!hasPermission) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient role permissions for this operation',
        requiredPermissions: required
      });
      return;
    }

    next();
  };
}

export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '12h' });
}
