// AppSync peut enregistrer un propriétaire sous la forme "sub::username", "sub" ou
// "username" : on accepte les trois, comme le font ses propres règles d'accès
export function isSameUser(
  value: string | null | undefined,
  identity: { sub?: string; username?: string },
) {
  if (!value || !identity.sub) return false;
  return (
    value.startsWith(`${identity.sub}::`) ||
    value === identity.sub ||
    (!!identity.username && value === identity.username)
  );
}
