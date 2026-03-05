export const runE2ePrismaCleanup = async (phaseLabel: string): Promise<void> => {
  const logPrefix = `[${phaseLabel}]`;

  console.log(`${logPrefix} Cleaning up stale e2e-test users...`);

  let prisma: Awaited<typeof import('../../backend/src/db')>['prisma'] | null = null;

  try {
    const db = await import('../../backend/src/db');
    prisma = db.prisma;
  } catch (error) {
    console.warn(`${logPrefix} Could not import Prisma client: ${(error as Error).message} (non-fatal)`);
    console.warn(`${logPrefix} Skipping database cleanup.`);
    return;
  }

  try {
    const e2eUsers = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'e2e-test-',
        },
      },
      select: { id: true },
    });

    if (e2eUsers.length === 0) {
      console.log(`${logPrefix} No stale e2e-test users found.`);
      return;
    }

    const userIds = e2eUsers.map((user) => user.id);

    const deletedTokens = await prisma.emailVerificationToken.deleteMany({
      where: { userId: { in: userIds } },
    });
    const deletedSessions = await prisma.session.deleteMany({
      where: { userId: { in: userIds } },
    });
    const deletedTodos = await prisma.todo.deleteMany({
      where: { ownerId: { in: userIds } },
    });
    const deletedNotes = await prisma.note.deleteMany({
      where: { userId: { in: userIds } },
    });
    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });

    console.log(
      `${logPrefix} Cleanup complete. users=${deletedUsers.count} sessions=${deletedSessions.count} todos=${deletedTodos.count} notes=${deletedNotes.count} tokens=${deletedTokens.count}`,
    );
  } catch (error) {
    console.error(`${logPrefix} Cleanup error: ${(error as Error).message} (non-fatal)`);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};
