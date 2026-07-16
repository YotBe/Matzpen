import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isPublicPath, safeInternalPath } from './publicPaths';

describe('isPublicPath', () => {
  it('allows the login page', () => {
    assert.equal(isPublicPath('/login'), true);
  });

  it('allows legal pages linked from the sign-up consent checkbox', () => {
    assert.equal(isPublicPath('/terms'), true);
    assert.equal(isPublicPath('/privacy'), true);
  });

  it('allows anonymous share-token viewers', () => {
    assert.equal(isPublicPath('/share/abc123'), true);
  });

  it('allows envelope invite links so the token survives sign-up', () => {
    assert.equal(isPublicPath('/envelope/join/tok-456'), true);
  });

  it('does not treat prefixes without a token as public', () => {
    // Bare /share (no trailing token) is not a real page — keep it gated.
    assert.equal(isPublicPath('/share'), false);
    assert.equal(isPublicPath('/envelope'), false);
  });

  it('gates everything else', () => {
    assert.equal(isPublicPath('/'), false);
    assert.equal(isPublicPath('/golden-record'), false);
    assert.equal(isPublicPath('/war-room'), false);
    assert.equal(isPublicPath('/vault'), false);
    assert.equal(isPublicPath(''), false);
    assert.equal(isPublicPath(null), false);
    assert.equal(isPublicPath(undefined), false);
  });

  it('does not match lookalike prefixes', () => {
    assert.equal(isPublicPath('/shareholder'), false);
    assert.equal(isPublicPath('/loginx'), false);
  });
});

describe('safeInternalPath', () => {
  it('accepts same-origin absolute paths', () => {
    assert.equal(safeInternalPath('/war-room'), '/war-room');
    assert.equal(safeInternalPath('/envelope/join/tok-1'), '/envelope/join/tok-1');
  });

  it('rejects empty and missing values', () => {
    assert.equal(safeInternalPath(''), null);
    assert.equal(safeInternalPath(null), null);
    assert.equal(safeInternalPath(undefined), null);
  });

  it('rejects open-redirect shapes', () => {
    assert.equal(safeInternalPath('https://evil.example'), null);
    assert.equal(safeInternalPath('//evil.example'), null);
    assert.equal(safeInternalPath('javascript:alert(1)'), null);
    assert.equal(safeInternalPath('/\\evil.example'), null);
    assert.equal(safeInternalPath('relative/path'), null);
  });
});
