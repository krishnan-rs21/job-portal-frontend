import React, { useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon } from "./Icons";

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  hasError?: boolean;
};

const PasswordInput: React.FC<PasswordInputProps> = ({ hasError, className = "", ...props }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`input pl-9 pr-10 ${hasError ? "border-rose-400" : ""} ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-600"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default PasswordInput;
