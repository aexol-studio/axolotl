import { Globe, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useSettings } from '../Settings.hook';
import { cn } from '@/lib/utils';
import type { SessionType } from '@/api';

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncateUserAgent = (userAgent: string | null | undefined, maxLength = 50): string => {
  if (!userAgent) return 'Unknown device';
  return userAgent.length > maxLength ? `${userAgent.slice(0, maxLength)}...` : userAgent;
};

const SessionsLoading = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-4 w-4" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    ))}
  </div>
);

const SessionsEmpty = () => <p className="text-sm text-muted-foreground text-center py-6">No active sessions found.</p>;

const SessionRow = ({
  session,
  onRevoke,
  isRevoking,
}: {
  session: SessionType;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className={cn('text-sm', session.isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground')}>
          {truncateUserAgent(session.userAgent)}
        </span>
      </div>
    </TableCell>
    <TableCell className="hidden sm:table-cell">
      <span className="text-sm text-muted-foreground">{formatDate(session.createdAt)}</span>
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <span className="text-sm text-muted-foreground">{formatDate(session.expiresAt)}</span>
    </TableCell>
    <TableCell>
      {session.isCurrent ? (
        <Badge variant="secondary">Current</Badge>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRevoke(session._id)}
          disabled={isRevoking}
          aria-label="Revoke session"
        >
          <Trash2 className="h-4 w-4 text-destructive-foreground" />
        </Button>
      )}
    </TableCell>
  </TableRow>
);

export const SessionsSection = () => {
  const { sessions, isLoadingSessions, revokeSession, revokeAllSessions } = useSettings();

  const otherSessionsCount = sessions?.filter((s) => !s.isCurrent).length ?? 0;
  const isRevoking = revokeSession.isPending || revokeAllSessions.isPending;

  const handleRevoke = (sessionId: string) => {
    revokeSession.mutate(sessionId);
  };

  const handleRevokeAll = () => {
    revokeAllSessions.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Active Sessions</CardTitle>
            <CardDescription>Manage your active sessions across devices.</CardDescription>
          </div>
          {!isLoadingSessions && otherSessionsCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleRevokeAll} disabled={isRevoking}>
              {revokeAllSessions.isPending ? 'Revoking...' : 'Revoke All Others'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingSessions ? (
          <SessionsLoading />
        ) : !sessions || sessions.length === 0 ? (
          <SessionsEmpty />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Expires</TableHead>
                <TableHead className="w-[70px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <SessionRow key={session._id} session={session} onRevoke={handleRevoke} isRevoking={isRevoking} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
