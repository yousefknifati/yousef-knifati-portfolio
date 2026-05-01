import React from "react";
import { FiPhoneCall } from "react-icons/fi";
const PHONE = "+963 999 666 333";

const AccountInfo = () => {
  return (
    <div className="hidden md:flex items-center gap-2 text-sm text-white/90">
      <FiPhoneCall className="h-4 w-4" />
      <span className="hover:text-white">{PHONE}</span>
    </div>
  );
};

export default AccountInfo;
