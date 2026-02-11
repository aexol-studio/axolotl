export const CodeSnippet = ({ code }: { code: string }) => (
  <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
    <code className="text-muted-foreground">{code}</code>
  </pre>
);
