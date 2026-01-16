/**
 * Mock data for prototyping
 * All data here is placeholder - no backend integration
 */

export const flowSteps = [
  { id: "landing", label: "Landing", route: "/" },
  { id: "arg", label: "ARG Section", route: "/arg" },
  { id: "platform", label: "Platform", route: "/platform" },
  { id: "paths", label: "Path Selection", route: "/paths" },
] as const;

export type FlowStep = (typeof flowSteps)[number]["id"];

// Add mock data for your prototypes below
export const mockPaths = [
  { id: "path-1", name: "Path One", description: "Description for path one" },
  { id: "path-2", name: "Path Two", description: "Description for path two" },
  { id: "path-3", name: "Path Three", description: "Description for path three" },
];
