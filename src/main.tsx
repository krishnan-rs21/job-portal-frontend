import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { store } from "./store";
import "./i18n";
import "./index.css";
import MetadataProvider from "./MetadataProvider";
import Layout from "./Layout";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MetadataProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<h1>Home</h1>} />
              <Route path="/jobs" element={<h1>Jobs</h1>} />
              <Route path="/jobs/:uuid" element={<h1>Job Details</h1>} />
              <Route path="/applications" element={<h1>Applications</h1>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </MetadataProvider>
    </Provider>
  </React.StrictMode>,
);
