import { createTeam } from '@/src/modules/teams/functions/createTeam.js';
import { deleteInvitation } from '@/src/modules/teams/functions/deleteInvitation.js';
import { generateInviteToken } from '@/src/modules/teams/functions/generateInviteToken.js';
import { joinToTeam } from '@/src/modules/teams/functions/joinToTeam.js';
import { joinToTeamWithInvitationToken } from '@/src/modules/teams/functions/joinToTeamWithInvitationToken.js';
import { mustBeTeamMember } from '@/src/modules/teams/functions/mustBeTeamMember.js';
import { removeUserFromTeam } from '@/src/modules/teams/functions/removeUserFromTeam.js';
import { showInviteTokens } from '@/src/modules/teams/functions/showInviteTokens.js';
import { teamInvitationsByTeam } from '@/src/modules/teams/functions/teamInvitationsByTeam.js';
import { teamInvitationsByUser } from '@/src/modules/teams/functions/teamInvitationsByUser.js';
import { teamsByUser } from '@/src/modules/teams/functions/teamsByUser.js';

export const TeamModule = {
  teamsByUser,
  teamInvitationsByUser,
  teamInvitationsByTeam,
  createTeam,
  joinToTeam,
  joinToTeamWithInvitationToken,
  mustBeTeamMember,
  showInviteTokens,
  generateInviteToken,
  removeUserFromTeam,
  deleteInvitation,
};
