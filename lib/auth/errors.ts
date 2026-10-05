import { isAuthError } from "@supabase/supabase-js";

// Traduit les erreurs Supabase en messages clairs, sans jargon.
const messages: Record<string, string> = {
  invalid_credentials: "Email ou mot de passe incorrect.",
  user_already_exists: "Un compte existe déjà avec cet email. Connecte-toi plutôt.",
  email_exists: "Un compte existe déjà avec cet email. Connecte-toi plutôt.",
  weak_password: "Ce mot de passe est trop facile à deviner. Choisis-en un plus long.",
  same_password: "C'est déjà ton mot de passe actuel.",
  email_not_confirmed:
    "Ton adresse n'est pas encore confirmée : ouvre l'email qu'on t'a envoyé.",
  email_address_invalid: "Cette adresse email n'est pas valide.",
  otp_expired: "Ce code a expiré ou n'est pas le bon. Demande un nouveau code.",
  over_email_send_rate_limit:
    "Trop d'emails envoyés d'un coup. Réessaie dans quelques minutes.",
  over_request_rate_limit: "Trop de tentatives. Réessaie dans quelques minutes.",
  email_address_not_authorized:
    "L'envoi d'emails n'est pas encore activé. Connecte-toi avec ton mot de passe.",
  signup_disabled: "Les inscriptions sont fermées pour le moment.",
};

export function authErrorMessage(error: unknown): string {
  if (isAuthError(error) && error.code && messages[error.code]) {
    return messages[error.code];
  }
  console.error("Erreur d'authentification inattendue", error);
  return "Ça n'a pas marché. Réessaie dans un instant.";
}

export const NOT_CONFIGURED_MESSAGE =
  "Les comptes ne sont pas encore activés sur ce site (configuration Supabase manquante).";
