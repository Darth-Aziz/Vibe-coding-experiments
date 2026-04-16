import { createBrowserRouter } from "react-router";
import { DesignSystemRoot } from "./pages/DesignSystemRoot";
import { ColorGuide } from "./pages/ColorGuide";
import { ComponentGuide } from "./pages/ComponentGuide";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminServices } from "./pages/AdminServices";
import { AdminFormBuilder } from "./pages/AdminFormBuilder";
import { AdminWorkflow } from "./pages/AdminWorkflow";
import { RequesterLayout } from "./layouts/RequesterLayout";
import { PortalSelector } from "./pages/PortalSelector";
import { RequesterCatalog } from "./pages/RequesterCatalog";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PortalSelector,
  },
  {
    path: "/design-system",
    Component: DesignSystemRoot,
    children: [
      { index: true, Component: ColorGuide },
      { path: "colors", Component: ColorGuide },
      { path: "components", Component: ComponentGuide },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "services", Component: AdminServices },
      { path: "services/:id/form", Component: AdminFormBuilder },
      { path: "services/new", Component: AdminFormBuilder },
      { path: "workflows", Component: AdminWorkflow },
    ],
  },
  {
    path: "/requester",
    Component: RequesterLayout,
    children: [
      { index: true, Component: RequesterCatalog },
    ],
  },
]);
