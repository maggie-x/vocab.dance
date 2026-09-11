import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): React.ReactElement => (
  <div className="w-full max-w-7xl px-6 sm:px-10 mb-20">{children}</div>
);
