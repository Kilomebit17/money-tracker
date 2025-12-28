import type { ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import { FinanceProvider } from "./providers/FinanceProvider";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TransactionsPage from "./pages/TransactionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import SettingsPage from "./pages/SettingsPage";

function App(): ReactElement {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
