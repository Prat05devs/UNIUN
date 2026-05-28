type GraphLineLayerProps = {
  className?: string;
};

const heroPaths = [
  "M120 130 C170 84 230 82 280 128",
  "M120 130 C174 166 220 196 284 180",
  "M120 130 C92 178 86 230 142 270",
  "M120 130 C110 72 150 42 206 40"
];

export function GraphLineLayer({ className }: GraphLineLayerProps) {
  return (
    <svg className={className} viewBox="0 0 360 310" role="presentation" aria-hidden="true">
      {heroPaths.map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
