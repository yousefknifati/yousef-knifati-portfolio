"use client";

import Link from "next/link";

import Button from "@/components/shared/Button";
import SectionContainer from "@/components/shared/SectionContainer";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";
import { PiPhoneCallFill } from "react-icons/pi";

function QuestionsCtaSection() {
  const { t } = useI18n();

  return (
    <SectionContainer
      id="questions-cta"
      maxWidth="full"
      padded={false}
      className="py-8 sm:py-10 md:py-14 bg-primary-normal"
    >
      <div>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight text-white">
              {t("footer.questions.title")}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white">
              {t("footer.questions.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center md:justify-end">
            <Link href="/jobs" className="inline-flex w-full sm:w-auto">
              <Button
                size="md"
                type="button"
                className={cn(
                  "h-11 w-full px-6 text-sm font-semibold rounded-sm sm:h-12 sm:w-auto sm:px-8",
                  "bg-transparent text-white",
                  "border border-white "
                )}
              >
                {t("footer.questions.browseJobs")}
              </Button>
            </Link>

            <Link href="/" className="inline-flex w-full sm:w-auto">
              <Button
                size="md"
                type="button"
                className={cn(
                  "h-11 w-full px-6 text-sm font-semibold rounded-sm gap-2 bg-white text-primary-normal sm:h-12 sm:w-auto sm:px-8"
                )}
              >
                <PiPhoneCallFill className="h-4 w-4" />
                {t("footer.questions.contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default QuestionsCtaSection;
