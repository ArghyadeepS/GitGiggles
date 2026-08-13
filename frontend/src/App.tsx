import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { HalftoneTrail } from "@/components/ui/halftone-trail";

// Lazy load route components for better code splitting
const Home = lazy(() => import("./pages/Home.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Analyze = lazy(() => import("./pages/Analyze.tsx"));
const RoastResult = lazy(() => import("./pages/RoastResult.tsx"));
const Catalog = lazy(() => import("./pages/Catalog.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse font-mono text-xs tracking-widest text-muted-foreground uppercase">
        Loading evidence...
      </div>
    </div>
  );
}

/** Keeps the hosting parent in sync with SPA route changes. */
function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      {/* Global halftone */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HalftoneTrail
          cellSize={11}
          decay={0.968}
          brushSize={0.043}
          hoverBrushSize={0.012}
          opacity={0.9}
          hoverOpacity={0.22}
          speedScale={37}
          color="var(--foreground)"
        />
      </div>

      {/* Website */}
      <div className="relative z-10">
        <RouteSyncer />

        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/analyze"
              element={
                <RequireAuth>
                  <Analyze />
                </RequireAuth>
              }
            />

            <Route path="/roast" element={<RoastResult />} />

            <Route
              path="/catalog"
              element={
                <RequireAuth>
                  <Catalog />
                </RequireAuth>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}