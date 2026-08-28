export function BureauLogo({ className = "" }: { className?: string }) {
  return (
    <img src="/bureau-logo.png" alt="Bureau" className={className || "h-8"} />
  );
}
