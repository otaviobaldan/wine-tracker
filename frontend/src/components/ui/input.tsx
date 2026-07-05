import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldClasses =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldClasses} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClasses} min-h-24 resize-y`} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClasses} {...props} />;
}

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="mb-1.5 block text-sm font-medium text-muted"
      {...props}
    />
  );
}
