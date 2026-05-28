import { PhoneMockup } from "../PhoneMockup";
import type { ProductScreen } from "../PhoneMockup";
import { cn } from "./utils";

type AnimatedPhoneMockupProps = {
  screen: ProductScreen;
  className?: string;
};

export function AnimatedPhoneMockup({ screen, className }: AnimatedPhoneMockupProps) {
  return (
    <div className={cn("animated-phone-mockup", className)}>
      <PhoneMockup screens={[screen]} activeId={screen.id} />
      <span className="phone-halo" aria-hidden="true" />
      <span className="phone-chip chip-a" aria-hidden="true">
        note
      </span>
      <span className="phone-chip chip-b" aria-hidden="true">
        linked
      </span>
    </div>
  );
}
