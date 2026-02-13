import { AlertCircle, Bot, CheckCircle2, KeyRound, ListTodo, Loader2, LogIn, Timer, User } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { Separator } from '@/components/ui/Separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

import { CodeSnippet } from '@/components/atoms';

import { useGraphQLShowcase } from './useGraphQLShowcase';

export const GraphQLShowcaseTab = () => {
  const {
    isAuthenticated,
    userData,
    isUserLoading,
    userError,
    fetchProfile,
    todos,
    isTodosLoading,
    todosError,
    fetchTodos,
    changePasswordForm,
    onChangePasswordSubmit,
    startFrom,
    setStartFrom,
    currentValue,
    isCountdownRunning,
    isCountdownDone,
    startCountdown,
    stopCountdown,
    countdownProgress,
    aiMessage,
    setAiMessage,
    aiResponse,
    isAiStreaming,
    aiError,
    sendAiMessage,
    stopAiStreaming,
  } = useGraphQLShowcase();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Live GraphQL Demos</h3>
        <p className="text-sm text-muted-foreground">
          Interactive demos of <span className="font-medium text-foreground">queries</span>,{' '}
          <span className="font-medium text-foreground">mutations</span>, and{' '}
          <span className="font-medium text-foreground">subscriptions</span> powered by{' '}
          <span className="font-medium text-foreground">Zeus</span> type-safe GraphQL client.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Query Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              User Query
            </CardTitle>
            <CardDescription>Fetch your profile using a Zeus query.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeSnippet code={`query()({ user: { me: { _id: true, email: true } } })`} />

            {!isAuthenticated ? (
              <Alert>
                <LogIn className="h-4 w-4" />
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>Log in to try this demo.</AlertDescription>
              </Alert>
            ) : (
              <>
                <Button onClick={fetchProfile} disabled={isUserLoading}>
                  {isUserLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                  Fetch My Profile
                </Button>

                {userError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{userError}</AlertDescription>
                  </Alert>
                )}

                {userData && (
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">ID:</span>
                      <Badge variant="outline">{userData._id}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm font-medium text-foreground">{userData.email}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Todos Query Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListTodo className="h-5 w-5" />
              Todos Query
            </CardTitle>
            <CardDescription>Fetch your todos list using a Zeus query.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeSnippet code={`query()({ user: { todos: { _id: true, content: true, done: true } } })`} />

            {!isAuthenticated ? (
              <Alert>
                <LogIn className="h-4 w-4" />
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>Log in to try this demo.</AlertDescription>
              </Alert>
            ) : (
              <>
                <Button onClick={fetchTodos} disabled={isTodosLoading}>
                  {isTodosLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListTodo className="h-4 w-4" />}
                  Fetch My Todos
                </Button>

                {todosError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{todosError}</AlertDescription>
                  </Alert>
                )}

                {todos.length > 0 && (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Content</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {todos.map((todo) => (
                          <TableRow key={todo._id}>
                            <TableCell className="font-medium">{todo.content}</TableCell>
                            <TableCell>
                              <Badge variant={todo.done ? 'default' : 'secondary'}>
                                {todo.done ? 'Done' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Change Password Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5" />
            Change Password Mutation
          </CardTitle>
          <CardDescription>Update your password using a Zeus mutation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeSnippet code={`mutation()({ user: { changePassword: [{ oldPassword, newPassword }, true] } })`} />

          {!isAuthenticated ? (
            <Alert>
              <LogIn className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>Log in to try this demo.</AlertDescription>
            </Alert>
          ) : (
            <Form {...changePasswordForm}>
              <form onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)} className="space-y-4">
                <FormField
                  control={changePasswordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={changePasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={changePasswordForm.formState.isSubmitting}>
                  {changePasswordForm.formState.isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="h-4 w-4" />
                  )}
                  Change Password
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Countdown Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="h-5 w-5" />
              Countdown Subscription
            </CardTitle>
            <CardDescription>Live countdown using a GraphQL SSE subscription. No auth required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeSnippet code={`subscription()({ countdown: [{ from: ${startFrom} }, true] })`} />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="countdown-start" className="text-sm text-muted-foreground whitespace-nowrap">
                  Start from:
                </label>
                <Input
                  id="countdown-start"
                  type="number"
                  min={1}
                  max={100}
                  value={startFrom}
                  onChange={(e) => setStartFrom(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20"
                  disabled={isCountdownRunning}
                />
              </div>

              {isCountdownRunning ? (
                <Button variant="destructive" onClick={stopCountdown}>
                  Stop
                </Button>
              ) : (
                <Button onClick={startCountdown}>
                  <Timer className="h-4 w-4" />
                  Start Countdown
                </Button>
              )}
            </div>

            {(currentValue !== null || isCountdownDone) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {isCountdownDone ? 'Complete' : `${currentValue} / ${startFrom}`}
                  </span>
                </div>
                <Progress value={countdownProgress} />

                {isCountdownDone && (
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Done!
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Chat Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5" />
              AI Chat Subscription
            </CardTitle>
            <CardDescription>Stream AI responses using a GraphQL SSE subscription. No auth required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeSnippet
              code={`subscription()({
  aiChat: [
    { messages: [{ role: 'user', content: '...' }] },
    { content: true, done: true }
  ]
})`}
            />

            <div className="flex items-center gap-3">
              <Input
                placeholder="Type a message for the AI..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAiStreaming) sendAiMessage();
                }}
                disabled={isAiStreaming}
              />
              {isAiStreaming ? (
                <Button variant="destructive" onClick={stopAiStreaming}>
                  Stop
                </Button>
              ) : (
                <Button onClick={sendAiMessage} disabled={!aiMessage.trim()}>
                  <Bot className="h-4 w-4" />
                  Send to AI
                </Button>
              )}
            </div>

            {aiError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Unavailable</AlertTitle>
                <AlertDescription>{aiError}</AlertDescription>
              </Alert>
            )}

            {aiResponse && (
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">AI Response</Badge>
                  {isAiStreaming && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
