import { Link, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { HiHome, HiDocumentText, HiCog6Tooth } from "react-icons/hi2";

const navigation: Array<{ path: string; label: string; icon: ReactElement }> = [
  { path: "/", label: "Overview", icon: <HiHome /> },
  { path: "/transactions", label: "Transactions", icon: <HiDocumentText /> },
  // { path: "/categories", label: "Budgets", icon: <BudgetsIcon /> },
  { path: "/settings", label: "Settings", icon: <HiCog6Tooth /> },
];

const BottomNav = (): ReactElement => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      {navigation.map((nav) => {
        const isActive = location.pathname === nav.path;

        return (
          <Link
            key={nav.path}
            to={nav.path}
            className={`bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`}
            aria-pressed={isActive}
          >
            <span className="bottom-nav__icon">{nav.icon}</span>
            <span className="bottom-nav__label">{nav.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;

