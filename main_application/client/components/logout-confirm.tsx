import * as React from "react";
import { useLocation } from "wouter";
import { usePlayerSession } from "@/lib/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function LogoutConfirm({ children, onConfirm }: { children: React.ReactNode, onConfirm?: () => void }) {
  const [, setLocation] = useLocation();
  const { clearSession } = usePlayerSession();

  const handleLogout = () => {
    clearSession();
    setLocation('/join');
    if (onConfirm) onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-ink-900 border-ink-800 text-white w-[85vw] max-w-[320px] rounded-lg p-5">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-sans text-[20px] text-white">End Session</AlertDialogTitle>
          <AlertDialogDescription className="text-[14px] leading-snug text-[var(--text-on-dark-muted)]">
            Are you sure you want to end your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-mono uppercase text-eyebrow-micro tracking-[0.03em] border-ink-800 text-white hover:bg-ink-800 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className="font-mono uppercase text-eyebrow-micro tracking-[0.03em] bg-violet-700 text-white hover:bg-violet-600">
            End Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
