import Link from "next/link";
import { PageWrapper } from "@/components/layouts/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlatformPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Platform Opens
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Welcome to the platform. The experience unfolds here.
        </p>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Platform Content</CardTitle>
            <CardDescription>Main platform interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Placeholder for platform features and main content area.
            </p>
            <div className="flex gap-2">
              <Link href="/arg" className="flex-1">
                <Button variant="outline" className="w-full">← Back</Button>
              </Link>
              <Link href="/paths" className="flex-1">
                <Button className="w-full">Choose Path →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
