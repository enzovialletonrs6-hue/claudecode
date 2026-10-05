"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  hint?: ReactNode;
};

export function Field({ label, name, error, hint, ...input }: FieldProps) {
  const describedBy = error ? `${name}-erreur` : hint ? `${name}-aide` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-bold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="champ"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...input}
      />
      {error ? (
        <p id={`${name}-erreur`} className="text-[0.95rem] font-bold text-tampon">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-aide`} className="text-[0.9rem] text-crayon">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function PasswordField(props: Omit<FieldProps, "type">) {
  const [visible, setVisible] = useState(false);
  const { label, name, error, hint, ...input } = props;
  const describedBy = error ? `${name}-erreur` : hint ? `${name}-aide` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-bold">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          className="champ pr-24"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-1 right-1 min-w-20 rounded-lg px-3 text-[0.9rem] font-bold text-crayon hover:text-encre"
          aria-pressed={visible}
        >
          {visible ? "Masquer" : "Afficher"}
        </button>
      </div>
      {error ? (
        <p id={`${name}-erreur`} className="text-[0.95rem] font-bold text-tampon">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-aide`} className="text-[0.9rem] text-crayon">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  variant = "plein",
  event,
}: {
  children: ReactNode;
  pendingLabel: string;
  variant?: "plein" | "secondaire" | "danger";
  event?: string;
}) {
  const { pending } = useFormStatus();
  const className =
    variant === "plein"
      ? "bouton w-full"
      : `bouton-secondaire w-full sm:w-auto ${variant === "danger" ? "danger" : ""}`;
  return (
    <button type="submit" className={className} disabled={pending} data-umami-event={event}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border-2 border-tampon bg-feuille px-4 py-3 font-bold text-tampon"
    >
      {message}
    </p>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="rounded-xl border-2 border-encre bg-surligneur/50 px-4 py-3">
      {children}
    </p>
  );
}
