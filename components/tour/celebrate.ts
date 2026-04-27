import confetti from "canvas-confetti";

export const celebrateTourComplete = () => {
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
    });

    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();

  confetti({
    particleCount: 140,
    spread: 120,
    origin: { y: 0.6 },
  });
};
