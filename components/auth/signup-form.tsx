"use client";

import { useActionState } from "react";
import { signUp, type AuthFormState } from "@/lib/auth/actions";
import { Field, FormError, PasswordField, SubmitButton } from "@/components/form/fields";

export function SignupForm() {
  const [state, action] = useActionState<AuthFormState, FormData>(signUp, {});
  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <FormError message={state.error} />
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
        label="Choisis un mot de passe"
        name="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="8 caractères minimum."
        error={state.fieldErrors?.password}
      />
      <SubmitButton pendingLabel="Création du compte…" event="inscription">
        Créer mon compte gratuit
      </SubmitButton>
    </form>
  );
}
