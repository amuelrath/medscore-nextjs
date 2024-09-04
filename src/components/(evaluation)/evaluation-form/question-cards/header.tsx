import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Header({
  text,
  description,
}: {
  text: string | null;
  description: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{text}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
