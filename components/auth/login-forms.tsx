"use client";

import { useActionState } from "react";
import {
  sendLoginCode,
  signInWithPassword,
  verifyLoginCode,
  type AuthFormState,
} from "@/lib/auth/actions";
import { Field, FormError, Notice, PasswordField, SubmitButton } from "@/components/form/fields";

export function PasswordLoginForm({ suite }: { suite: string }) {
  const [state, action] = useActionState<AuthFormState, FormData>(signInWithPassword, {});
  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormError message={state.error} />
      <input type="hidden" name="suite" value={suite} />
      <Field
        label="Ton email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        required
        defaultValue={state.email}
        error={state.fieldErrors?.email}
      />
      <PasswordField
        label="Ton mot de passe"
        name="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />
      <SubmitButton pendingLabel="Connexion…" event="connexion-mot-de-passe">
        Me connecter
      </SubmitButton>
    </form>
  );
}

export function CodeLoginForm({ suite }: { suite: string }) {
  const [sent, sendAction] = useActionState<AuthFormState, FormData>(sendLoginCode, {});
  const [verified, verifyAction] = useActionState<AuthFormState, FormData>(verifyLoginCode, {});

  if (!sent.codeSent) {
    return (
      <form action={sendAction} noValidate className="flex flex-col gap-5">
        <FormError message={sent.error} />
        <Field
          label="Ton email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          defaultValue={sent.email}
          error={sent.fieldErrors?.email}
        />
        <SubmitButton pendingLabel="Envoi…" event="connexion-demande-code">
          Recevoir mon code
        </SubmitButton>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Notice>
        On t&apos;a envoyé un code à <strong>{sent.email}</strong>. Il arrive en général en
        moins d&apos;une minute (pense à regarder dans les indésirables).
      </Notice>
      <form action={verifyAction} noValidate className="flex flex-col gap-5">
        <FormError message={verified.error} />
        <input type="hidden" name="email" value={sent.email} />
        <input type="hidden" name="suite" value={suite} />
        <Field
          label="Code reçu par email"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={10}
          required
          autoFocus
          className="champ font-mono text-[1.4rem] tracking-[0.3em]"
          error={verified.fieldErrors?.code}
        />
        <SubmitButton pendingLabel="Vérification…" event="connexion-code">
          Me connecter
        </SubmitButton>
      </form>
      <form action={sendAction} className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <input type="hidden" name="email" value={sent.email} />
        <button type="submit" className="lien min-h-11 font-bold">
          Renvoyer un code
        </button>
        {/* Rechargement complet volontaire : on repart d'un formulaire vierge. */}
        <a href="/connexion?mode=code" className="lien min-h-11 content-center">
          Changer d&apos;adresse
        </a>
      </form>
    </div>
  );
}
