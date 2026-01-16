import Link from "next/link";
import { PageWrapper } from "@/components/layouts/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArgPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          ARG Section
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-md">
          The alternate reality game experience begins here.
        </p>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>ARG Content</CardTitle>
            <CardDescription>Design your ARG experience here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Placeholder for ARG puzzles, clues, and interactive elements.
            </p>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">← Back</Button>
              </Link>
              <Link href="/platform" className="flex-1">
                <Button className="w-full">Continue →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
