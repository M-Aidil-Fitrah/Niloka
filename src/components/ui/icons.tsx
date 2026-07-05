import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function SearchIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 6h15l-2 8H8L6 3H3m6 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.5 8.25V6.6c0-.72.48-.9.82-.9h2.1V2.08L14.53 2C11.32 2 10.6 4.4 10.6 5.94v2.31H8v3.74h2.6V22h3.9V11.99h2.63l.36-3.74H14.5Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="16"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
        width="16"
        x="4"
        y="4"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" fill="currentColor" r="1.1" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6.94 8.98H3.5V20h3.44V8.98ZM5.22 4A1.99 1.99 0 1 0 5.2 7.98 1.99 1.99 0 0 0 5.22 4ZM20.5 13.68c0-3.28-1.75-4.8-4.08-4.8a3.5 3.5 0 0 0-3.16 1.74h-.05V8.98H9.9V20h3.44v-5.45c0-1.44.27-2.83 2.06-2.83 1.76 0 1.78 1.65 1.78 2.92V20h3.44l-.12-6.32Z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 8.2a3 3 0 0 0-2.1-2.12C17.05 5.6 12 5.6 12 5.6s-5.05 0-6.9.48A3 3 0 0 0 3 8.2 31.2 31.2 0 0 0 2.5 12c0 1.28.17 2.55.5 3.8a3 3 0 0 0 2.1 2.12c1.85.48 6.9.48 6.9.48s5.05 0 6.9-.48A3 3 0 0 0 21 15.8c.33-1.25.5-2.52.5-3.8 0-1.28-.17-2.55-.5-3.8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m10.4 14.8 4.2-2.8-4.2-2.8v5.6Z" fill="currentColor" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
