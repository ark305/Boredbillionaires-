"use client";

import { useEffect, useState } from "react";
import type { PledgeMessages } from "@/components/pledge/messages";
import { buildXShareUrl, copyText } from "./share";

type Props = {
  text: string;
  url: string;
  m: PledgeMessages;
};

export function ShareButtons({ text, url, m }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  async function onCopy() {
    setStatus((await copyText(`${text} ${url}`)) ? "copied" : "failed");
  }

  return (
    <div className="mx-auto mt-5 grid w-full max-w-sm grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onCopy}
        className="rounded-full border border-navy/20 bg-white px-4 py-3 text-sm font-semibold text-navy transition hover:border-navy/40"
      >
        <span aria-live="polite">
          {status === "copied" ? m.share.copied : status === "failed" ? m.share.copyFailed : m.share.copy}
        </span>
      </button>
      <a
        href={buildXShareUrl(text, url)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-cream transition hover:bg-navy/90"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        {m.share.x}
      </a>
    </div>
  );
}
