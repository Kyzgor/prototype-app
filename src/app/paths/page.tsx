import Link from "next/link";
import { PageWrapper } from "@/components/layouts/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPaths } from "@/data/mock";

export default function PathsPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Path Selection
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Choose your path to continue the experience.
        </p>

        <div className="grid gap-4 w-full max-w-2xl md:grid-cols-3">
          {mockPaths.map((path) => (
            <Card key={path.id} className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{path.name}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Select</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Link href="/platform">
          <Button variant="ghost">← Back to Platform</Button>
        </Link>
      </div>
    </PageWrapper>
  );
}
