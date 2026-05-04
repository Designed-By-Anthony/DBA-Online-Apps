import type { ReactNode } from 'react';
import './navbar.css';

export function Navbar({ children }: { children?: ReactNode }) {
  return (
    <nav className="dba-nav">
      <a href="https://designedbyanthony.online" className="dba-nav-brand">
        <span className="dba-nav-prefix">Tools by </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="ANTHONY."
          className="dba-nav-logo"
          height={24}
        />
      </a>
      {children}
    </nav>
  );
}
