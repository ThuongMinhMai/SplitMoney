const BAR_PATTERN = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2];

export function Barcode() {
  let x = 0;
  return (
    <svg
      width="80"
      height="20"
      viewBox="0 0 80 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {BAR_PATTERN.map((w, i) => {
        const bar = (
          <rect
            key={i}
            x={x}
            y={0}
            width={w}
            height={20}
            fill={i % 2 === 0 ? "currentColor" : "transparent"}
          />
        );
        x += w + 1;
        return bar;
      })}
    </svg>
  );
}
