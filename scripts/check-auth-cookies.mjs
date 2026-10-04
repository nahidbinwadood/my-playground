// Run: pnpm check:auth. Guards the proxy's expiry decisions — if these break,
// users get stuck with dead sessions again (or logged out on every request).
import assert from 'node:assert/strict';
import { decodeJwt, secondsLeft } from '../lib/auth-cookies.ts';

const b64url = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString('base64url');
const jwt = (payload) => `${b64url({ alg: 'HS256' })}.${b64url(payload)}.sig`;
const now = Math.floor(Date.now() / 1000);

assert.equal(decodeJwt(jwt({ role: 'admin' }))?.role, 'admin');
assert.equal(decodeJwt('garbage'), null);
assert.equal(decodeJwt(undefined), null);

assert.equal(secondsLeft(undefined), 0); // no cookie
assert.equal(secondsLeft(jwt({ exp: now - 10 })), 0); // expired
assert.equal(secondsLeft(jwt({ exp: now + 20 })), 0); // inside the 30s margin → refresh early
assert.ok(secondsLeft(jwt({ exp: now + 3600 })) > 3500); // valid
assert.equal(secondsLeft(jwt({})), 0); // no exp claim

console.log('auth-cookies: ok');
