import Link from "next/link";
import React from "react";
import { PiArrowBendDownRightBold } from "react-icons/pi";
import type { IconType } from "react-icons";
import Button from "../shared/Button";

type CtaButtonProps = {
  href: string;
  label: React.ReactNode;

  icon?: IconType;
  iconSize?: number;

  containerClassName?: string;
  buttonClassName?: string;

  size?: "sm" | "md" | "register" | undefined;

  prefetch?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;

  disabled?: boolean;
};

const DefaultIcon: IconType = PiArrowBendDownRightBold;

const CtaButton: React.FC<CtaButtonProps> = ({
  href,
  label,
  icon: Icon = DefaultIcon,
  iconSize = 16,
  containerClassName = "w-full flex items-center justify-center mt-16",
  buttonClassName = "group bg-transparent text-secondary-normal hover:text-primary-normal hover:bg-transparent   px-7 py-5 flex gap-2.5",
  size = "md",
  prefetch,
  target,
  rel,
  disabled = false,
}) => {
  const buttonNode = (
    <Button size={size} className={buttonClassName} disabled={disabled}>
      <span className="group-hover:-translate-x-1 transition-all duration-300">
        {label}
      </span>
      <Icon
        className="group-hover:translate-x-1 transition-all duration-300"
        size={iconSize}
      />
    </Button>
  );

  if (disabled) {
    return <div className={containerClassName}>{buttonNode}</div>;
  }

  return (
    <div className={containerClassName}>
      <Link href={href} prefetch={prefetch} target={target} rel={rel}>
        {buttonNode}
      </Link>
    </div>
  );
};

export default CtaButton;
