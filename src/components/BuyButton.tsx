import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function BuyButton({ href, label, variant = "primary", className = "" }: Props) {
  const buttonVariant = variant === "primary" ? "default" : "secondary";
  
  return (
    <Button asChild variant={buttonVariant} className={cn(className)}>
      <Link href={href}>
        {label}
      </Link>
    </Button>
  );
}
