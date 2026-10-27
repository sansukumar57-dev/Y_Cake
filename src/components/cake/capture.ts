type CaptureFunction = () => string | null;

let captureFunction: CaptureFunction | null = null;

export function registerCakeCapture(next: CaptureFunction) {
  captureFunction = next;
  return () => {
    if (captureFunction === next) {
      captureFunction = null;
    }
  };
}

export function captureCakeThumbnail(): string | null {
  try {
    return captureFunction?.() ?? null;
  } catch {
    return null;
  }
}
