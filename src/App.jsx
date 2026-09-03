import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

import Explore from "@/pages/Explore";
import VenueDetail from "@/pages/VenueDetail";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
      </Route>
    </Routes>
  );
}
