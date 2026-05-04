import type { ReactNode } from 'react';
import './navbar.css';

export function Navbar({ children }: { children?: ReactNode }) {
  return (
    <nav className="dba-nav">
      <a href="https://designedbyanthony.online" className="dba-nav-brand">
        <span className="dba-nav-prefix">Tools by </span>
        <span className="dba-nav-name">ANTHONY.</span>
      </a>
      {children}
    </nav>
  );
}
