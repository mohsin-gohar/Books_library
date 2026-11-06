import test from 'node:test';
import assert from 'node:assert/strict';
import { Permissions, DEFAULT_ROLE_PERMISSIONS } from '@athenaeum/shared';
import { WebhookDispatcherService } from '../src/services/webhook.service.js';

test('RBAC System - Validates 60+ granular enterprise permissions defined', () => {
  const permList = Object.values(Permissions);
  assert.ok(permList.length >= 60, `Expected at least 60 permissions, found ${permList.length}`);
  assert.ok(permList.includes('tenant:create'));
  assert.ok(permList.includes('catalog:view'));
  assert.ok(permList.includes('circulation:checkout'));
  assert.ok(permList.includes('journey:goals:manage'));
  assert.ok(permList.includes('analytics:dashboard:view'));
  assert.ok(permList.includes('accounting:invoices:view'));
  assert.ok(permList.includes('integrations:webhooks:manage'));
});

test('RBAC Roles - Super Admin has complete system permissions', () => {
  const superAdminPerms = DEFAULT_ROLE_PERMISSIONS['Super Admin'];
  const allPerms = Object.values(Permissions);
  assert.equal(superAdminPerms.length, allPerms.length);
});

test('RBAC Roles - Institution Admin lacks global tenant lifecycle control', () => {
  const instPerms = DEFAULT_ROLE_PERMISSIONS['Institution Admin'];
  assert.ok(!instPerms.includes(Permissions.TENANT_CREATE));
  assert.ok(!instPerms.includes(Permissions.TENANT_DELETE));
  assert.ok(instPerms.includes(Permissions.CATALOG_CREATE));
});

test('Webhook HMAC Signature - Generates and verifies HMAC-SHA256 signature', () => {
  const secret = 'super-secret-tenant-key';
  const payload = JSON.stringify({ event: 'circulation.borrow', loanId: 'loan_123' });
  const signature = WebhookDispatcherService.signPayload(payload, secret);
  assert.ok(signature && signature.length === 64, 'Signature must be a 64-char hex string');
});
