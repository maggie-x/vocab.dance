import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): React.ReactElement => (
  <div className="mx-10 max-w-sm">{children}</div>
);
