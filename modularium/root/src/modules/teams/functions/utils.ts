export const formatInvitationToTeam = (to: string, teamId: string, teamName: string) => ({
  to,
  sender: `${getEnv('MAILGUN_SENDER')}`,
  body: `You got invitation to team ${teamName}. Follow this link to accept invitation: ${getEnv(
    'MAILGUN_REDIRECT_PATH',
  )}/to-team?teamId=${teamId}&email=${to}`,
  subject: `[${getEnv('MAILGUN_DOMAIN')}] Team invitation`,
  replyTo: getEnv('MAILGUN_SENDER'),
});

export const getEnv = (envName: string) => {
  const v = process.env[envName];
  if (!v) {
    throw new Error(`Environment variable "${envName}" required but not set`);
  }
  return v as string;
};
