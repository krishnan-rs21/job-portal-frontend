import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store";
import "./i18n";
import "./index.css";
import MetadataProvider from "./MetadataProvider";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        }
      >
        <MetadataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:uuid" element={<JobDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/my-applications"
                    element={<MyApplicationsPage />}
                  />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </MetadataProvider>
      </Suspense>
    </Provider>
  </React.StrictMode>,
);
