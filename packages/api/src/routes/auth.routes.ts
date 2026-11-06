import { Router, Request, Response } from 'express';
import { generateToken } from '../guards/rbac.guard';
import { DEFAULT_ROLE_PERMISSIONS } from '@athenaeum/shared';

export const authRouter = Router();

// Demo users database
const DEMO_USERS = [
  {
    id: 'usr_superadmin_01',
    email: 'superadmin@athenaeum.io',
    name: 'Eleanor Vance',
    role: 'Super Admin',
    organizationId: 'org-athenaeum-main',
  },
  {
    id: 'usr_instadmin_01',
    email: 'admin@oxford.library',
    name: 'Prof. Alistair Finch',
    role: 'Institution Admin',
    organizationId: 'org-athenaeum-main',
  },
  {
    id: 'usr_librarian_01',
    email: 'librarian@oxford.library',
    name: 'Clara Oswald',
    role: 'Librarian',
    organizationId: 'org-athenaeum-main',
  },
  {
    id: 'usr_member_01',
    email: 'patron@oxford.library',
    name: 'Julian Hayes',
    role: 'Member',
    organizationId: 'org-athenaeum-main',
  }
];

// POST /api/v1/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = DEMO_USERS.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
  }
  const permissions = (DEFAULT_ROLE_PERMISSIONS as any)[user.role] || [];

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    organizationId: req.tenant?.organizationId || user.organizationId,
    role: user.role,
    permissions
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions
    }
  });
});

// GET /api/v1/auth/sso/metadata (SAML/OAuth2 metadata endpoint)
authRouter.get('/sso/metadata', (req: Request, res: Response) => {
  res.json({
    entityId: `https://api.athenaeum.io/saml/${req.tenant?.organizationSlug}`,
    assertionConsumerService: `https://api.athenaeum.io/api/v1/auth/saml/callback`,
    supportedProviders: ['SAML 2.0', 'OAuth2 Google Workspace', 'Azure AD / Entra ID', 'LDAP OpenDirectory'],
    tenant: req.tenant
  });
});
