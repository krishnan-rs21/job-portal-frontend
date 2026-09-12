import React from "react";
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MetadataProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:uuid" element={<h1>Job Details</h1>} />
              <Route path="/applications" element={<h1>Applications</h1>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </MetadataProvider>
    </Provider>
  </React.StrictMode>,
);
