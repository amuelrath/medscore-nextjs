export function FormErrorMessage({ message }: { message: string | undefined }) {
  return <p className="text-sm text-destructive">{message || ""}</p>;
}
