"use client";

import { useActionState } from "react";
import { deleteAccount, updatePassword, type SettingsFormState } from "@/lib/account/actions";
import { FormError, Notice, PasswordField, SubmitButton } from "@/components/form/fields";

export function PasswordForm() {
  const [state, action] = useActionState<SettingsFormState, FormData>(updatePassword, {});
  return (
    <form action={action} noValidate className="flex flex-col gap-4">
      <FormError message={state.error} />
      {state.success && <Notice>{state.success}</Notice>}
      <PasswordField
        label="Nouveau mot de passe"
        name="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="8 caractères minimum."
        error={state.fieldError}
      />
      <SubmitButton variant="secondaire" pendingLabel="Enregistrement…">
        Enregistrer le mot de passe
      </SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action] = useActionState<SettingsFormState, FormData>(deleteAccount, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.error} />
      <label className="flex min-h-11 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="confirmation"
          className="mt-1 h-5 w-5 shrink-0 accent-tampon"
          aria-invalid={state.fieldError ? true : undefined}
        />
        <span>Je comprends que la suppression est immédiate et définitive.</span>
      </label>
      {state.fieldError && (
        <p className="text-[0.95rem] font-bold text-tampon">{state.fieldError}</p>
      )}
      <SubmitButton variant="danger" pendingLabel="Suppression…" event="suppression-compte">
        Supprimer définitivement mon compte
      </SubmitButton>
    </form>
  );
}
