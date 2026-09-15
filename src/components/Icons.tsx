import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const base = (children: React.ReactNode) => {
  const Icon: React.FC<IconProps> = ({ className = "h-5 w-5", ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
  return Icon;
};

export const DashboardIcon = base(
  <>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </>,
);

export const BriefcaseIcon = base(
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 13h18" />
  </>,
);

export const PlusIcon = base(<path d="M12 5v14M5 12h14" />);

export const LogoutIcon = base(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </>,
);

export const SearchIcon = base(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </>,
);

export const EditIcon = base(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </>,
);

export const TrashIcon = base(
  <>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </>,
);

export const MenuIcon = base(<path d="M4 6h16M4 12h16M4 18h16" />);

export const CloseIcon = base(<path d="M18 6 6 18M6 6l12 12" />);

export const MapPinIcon = base(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>,
);

export const CheckCircleIcon = base(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </>,
);

export const ArchiveIcon = base(
  <>
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </>,
);

export const LayersIcon = base(
  <>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </>,
);

export const ChevronLeftIcon = base(<path d="m15 18-6-6 6-6" />);

export const ChevronRightIcon = base(<path d="m9 18 6-6-6-6" />);

export const ArrowLeftIcon = base(<path d="M19 12H5M12 19l-7-7 7-7" />);

export const AlertIcon = base(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </>,
);

export const MailIcon = base(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>,
);

export const UserIcon = base(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </>,
);

export const ClockIcon = base(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);

export const WalletIcon = base(
  <>
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
    <path d="M16 15h2" />
  </>,
);

export const CalendarIcon = base(
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18" />
  </>,
);

export const ChartIcon = base(
  <>
    <path d="M3 3v18h18" />
    <path d="m7 14 4-4 3 3 5-6" />
  </>,
);

export const FileTextIcon = base(
  <>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
    <path d="M14 3v6h6M8 13h8M8 17h5" />
  </>,
);

export const SparklesIcon = base(
  <>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="m6 6 2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
  </>,
);

export const EyeIcon = base(
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);

export const EyeOffIcon = base(
  <>
    <path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20" />
  </>,
);

export const LockIcon = base(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>,
);
