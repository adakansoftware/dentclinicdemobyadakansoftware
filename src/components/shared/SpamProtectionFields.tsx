"use client";

import { useState } from "react";
import Script from "next/script";
import { getTurnstileSiteKey, isTurnstileEnabled } from "@/lib/bot-protection";

export default function SpamProtectionFields() {
  const [startedAt] = useState(() => Date.now().toString());
  const turnstileEnabled = isTurnstileEnabled();
  const siteKey = getTurnstileSiteKey();

  return (
    <>
      <div style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="formStartedAt" value={startedAt} />
      {turnstileEnabled ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="pt-2">
            <div className="cf-turnstile" data-sitekey={siteKey} />
          </div>
        </>
      ) : null}
    </>
  );
}
