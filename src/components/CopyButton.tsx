import React from "react";

function blink(element: HTMLElement | null, className: string) {
  if (element) {
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), 200);
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
      onClick={() =>
        navigator.clipboard
          .writeText(text)
          .then(() => blink(ref.current, "copied"))
      }
      {...props}
    >
      {children}
    </button>
  );
}
