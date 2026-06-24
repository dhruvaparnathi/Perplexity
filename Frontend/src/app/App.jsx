import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useAuth } from "../Features/Auth/hooks/useAuth";

export default function App() {
  const { handleGetMe } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await handleGetMe(true);
      } catch (err) {
        // Silent catch: redirect handles routing
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-zinc-900 border-t-zinc-100 animate-spin" />
        </div>
        <p className="mt-4 text-[10px] tracking-widest text-zinc-600 uppercase font-semibold">
          Connecting
        </p>
      </div>
    );
  }

  return <Outlet />;
}