import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { verifyTelegramInitData } from "./verify-init-data.ts";

function signPayload(
  params: Record<string, string>,
  botToken: string
): string {
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const pairs = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`);

  const dataCheckString = pairs.join("\n");
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const searchParams = new URLSearchParams(params);
  searchParams.set("hash", hash);
  return searchParams.toString();
}

describe("verifyTelegramInitData", () => {
  const testToken = "123456789:ABCdefGHIjklMNOpqrsTUVwxyz";
  const now = 1700000000;

  it("validates authentic signed initData with user and start_param", () => {
    const raw = signPayload(
      {
        auth_date: String(now - 100),
        query_id: "AAHdF6IQAAAAAN0XohDhrOrc",
        user: JSON.stringify({
          id: 99912345,
          first_name: "Elena",
          last_name: "Recruiter",
          username: "elena_hr",
          language_code: "ru",
        }),
        start_param: "case_dkmline",
      },
      testToken
    );

    const result = verifyTelegramInitData(raw, testToken, 86400, now);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.user?.id, 99912345);
      assert.equal(result.user?.first_name, "Elena");
      assert.equal(result.user?.username, "elena_hr");
      assert.equal(result.startParam, "case_dkmline");
      assert.equal(result.authDate, now - 100);
    }
  });

  it("rejects payload when verified against wrong bot token", () => {
    const raw = signPayload(
      {
        auth_date: String(now - 10),
        query_id: "test",
      },
      testToken
    );

    const result = verifyTelegramInitData(raw, "wrong_token", 86400, now);
    assert.deepEqual(result, { ok: false, reason: "hash_mismatch" });
  });

  it("rejects tampered data fields", () => {
    const raw = signPayload(
      {
        auth_date: String(now - 10),
        user: JSON.stringify({ id: 1, first_name: "Original" }),
      },
      testToken
    );

    // Tamper with user parameter while keeping old hash
    const tampered = raw.replace("Original", "Hacker");
    const result = verifyTelegramInitData(tampered, testToken, 86400, now);
    assert.deepEqual(result, { ok: false, reason: "hash_mismatch" });
  });

  it("rejects missing, empty, or non-hex hashes", () => {
    assert.deepEqual(verifyTelegramInitData("auth_date=100", testToken), {
      ok: false,
      reason: "missing_hash",
    });

    assert.deepEqual(
      verifyTelegramInitData("auth_date=100&hash=invalid_short_hash", testToken),
      {
        ok: false,
        reason: "invalid_hash_format",
      }
    );

    assert.deepEqual(
      verifyTelegramInitData("auth_date=100&hash=" + "g".repeat(64), testToken),
      {
        ok: false,
        reason: "invalid_hash_format",
      }
    );
  });

  it("rejects expired auth_date (> 86400 seconds ago)", () => {
    const raw = signPayload(
      {
        auth_date: String(now - 86401),
      },
      testToken
    );

    const result = verifyTelegramInitData(raw, testToken, 86400, now);
    assert.deepEqual(result, { ok: false, reason: "expired" });
  });

  it("rejects future auth_date (> 60 seconds ahead)", () => {
    const raw = signPayload(
      {
        auth_date: String(now + 61),
      },
      testToken
    );

    const result = verifyTelegramInitData(raw, testToken, 86400, now);
    assert.deepEqual(result, { ok: false, reason: "future_auth_date" });
  });

  it("rejects null, undefined, and missing tokens", () => {
    assert.deepEqual(verifyTelegramInitData(null, testToken), {
      ok: false,
      reason: "missing_data",
    });
    assert.deepEqual(verifyTelegramInitData("hash=123", null), {
      ok: false,
      reason: "missing_token",
    });
  });
});
