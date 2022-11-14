import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): React.ReactElement => (
  <div className="mx-10 mb-20 max-w-sm">{children}</div>
);
