import * as React from "react";

type Pad = "sm" | "md" | "lg";
const padMap: Record<Pad, string> = { sm: "py-12", md: "py-20", lg: "py-28" };

export function Section({
  id,
  pad = "md",
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { pad?: Pad; id?: string }) {
  return (
    <section id={id} className={[padMap[pad], className].join(" ").trim()} {...rest}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeading({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={["font-heading text-3xl md:text-4xl text-foreground tracking-tight", className].join(" ").trim()} {...props} />;
}

export function SectionSubtitle({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["mt-3 text-lg text-muted max-w-2xl", className].join(" ").trim()} {...props} />;
}
