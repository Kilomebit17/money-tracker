import type { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="finance-app">
      <section className="finance-app__view">{children}</section>
      <BottomNav />
    </main>
  );
};

export default Layout;

