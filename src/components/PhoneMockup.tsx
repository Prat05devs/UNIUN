import { cn } from "./uniun/utils";

export type ProductScreen = {
  id: string;
  src: string;
  alt: string;
};

type PhoneMockupProps = {
  screens: ProductScreen[];
  activeId: string;
  size?: "hero" | "large";
  className?: string;
};

export function PhoneMockup({
  screens,
  activeId,
  size = "large",
  className
}: PhoneMockupProps) {
  return (
    <div className={cn("phone-shell", size === "large" && "large", className)}>
      <div className="phone-notch" />
      {screens.map((screen) => (
        <img
          key={screen.id}
          className={cn("phone-screen", screen.id === activeId && "active")}
          src={screen.src}
          alt={screen.alt}
          decoding="async"
          draggable={false}
          loading={size === "hero" ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
