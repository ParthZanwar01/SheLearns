import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import HomeDashboard from "pages/home-dashboard";
import LearningPathProgress from "pages/learning-path-progress";
import CommunityForum from "pages/community-forum";
import ResourceLibrary from "pages/resource-library";
import DownloadManager from "pages/download-manager";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/learning-path-progress" element={<LearningPathProgress />} />
        <Route path="/community-forum" element={<CommunityForum />} />
        <Route path="/resource-library" element={<ResourceLibrary />} />
        <Route path="/download-manager" element={<DownloadManager />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;