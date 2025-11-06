import React from "react";

function blink(element: HTMLElement | null) {
  if (element?.animate) {
    element.animate(
      [
        { offset: 0, background: "lawngreen" },
        { offset: 0.5, opacity: 0 },
        { offset: 1, opacity: 1 },
      ],
      {
        duration: 500,
        easing: "ease-in-out",
      },
    );
  }
}

interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function CopyButton({ text, children, ...props }: CopyButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      className="copy-button"
      onClick={() =>
        navigator.clipboard.writeText(text).then(() => blink(ref.current))
      }
      {...props}
    >
      {children}
    </button>
  );
}
