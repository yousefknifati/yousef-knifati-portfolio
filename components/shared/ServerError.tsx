"use client";

import * as React from "react";
import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw, FiHome, FiRotateCcw } from "react-icons/fi";
import AppImage from "@/components/shared/AppImage";
import { cn } from "@/lib/utils/cn";

type Props = {
  error?: (Error & { digest?: string }) | null;
  onRetry?: (() => void) | null;

  title?: string;
  description?: string;

  homeHref?: string;
  logoSrc?: string;

  className?: string;
};

export default function ServerError({
  error,
  onRetry,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  homeHref = "/",
  logoSrc = "/circleLogo.png",
  className,
}: Props) {
  const isDev = process.env.NODE_ENV !== "production";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const digest = (error as any)?.digest as string | undefined;


  return (
    <main
      dir="ltr"
      className={cn(
        "relative min-h-screen overflow-hidden  text-black",
        className
      )}
    >


      <section className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-14">
        <div className="w-full max-w-xl rounded-xl border border-secondary-light-hover bg-white/70 p-6 shadow-[0_18px_50px_var(--color-shadow-md)] backdrop-blur md:p-8">
          <div className="flex items-center gap-3">
            <AppImage
              src={logoSrc}
              alt="Logo"
              width={44}
              height={44}
              priority
              className="shrink-0 rounded-full"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-secondary-400">
                Server Error
              </p>
              <h1 className="font-display mt-1 truncate text-xl font-extrabold text-secondary-500 md:text-2xl">
                {title}
              </h1>
            </div>

            <FiAlertTriangle className="ml-auto h-5 w-5 text-secondary-400" />
          </div>

          <div
            role="alert"
            className="mt-4 rounded-lg bg-primary-light p-4 text-sm text-secondary-500"
          >
            <p className="font-semibold">{description}</p>
            <p className="mt-1 text-xs text-secondary-400">
              If the issue persists, try reloading the page.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-primary-normal px-4 text-sm font-semibold text-white transition hover:bg-primary-normal-hover focus:outline-none focus:ring-2 focus:ring-primary-normal/25"
              >
                <FiRefreshCw className="h-4 w-4" />
                Try again
              </button>
            ) : null}

            <Link
              href={homeHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-secondary-light-hover bg-white px-4 text-sm font-semibold text-secondary-500 transition hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-primary-normal/25"
            >
              <FiHome className="h-4 w-4" />
              Go to Home
            </Link>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-secondary-light-hover bg-white px-4 text-sm font-semibold text-secondary-500 transition hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-primary-normal/25"
            >
              <FiRotateCcw className="h-4 w-4" />
              Reload
            </button>
          </div>

          {isDev ? (
            <details className="mt-6 rounded-lg border border-secondary-light-hover bg-white/70 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-secondary-500">
                Debug details
              </summary>
              <div className="mt-3 space-y-2">
                {digest ? (
                  <p className="text-xs text-secondary-400">
                    <span className="font-semibold text-secondary-500">Digest:</span>{" "}
                    <span className="font-mono">{digest}</span>
                  </p>
                ) : null}

                {error?.message ? (
                  <pre className="max-h-40 overflow-auto rounded-md bg-secondary-50 p-3 text-xs text-secondary-500">
                    {String(error.message)}
                  </pre>
                ) : null}
              </div>
            </details>
          ) : null}
        </div>
      </section>
    </main>
  );
}
