export enum GenerateInviteTokenError {
  YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST = 'YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST',
}
export enum RemoveUserFromTeamError {
  YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST = 'YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST',
  YOU_CANNOT_KICK_YOURSELF_FROM_THE_TEAM = 'YOU_CANNOT_KICK_YOURSELF_FROM_THE_TEAM',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}
export enum JoinToTeamError {
  TEAM_INVITATION_DOES_NOT_EXIST_OR_CAPTURED = 'TEAM_INVITATION_DOES_NOT_EXIST_OR_CAPTURED',
  MEMBER_ALREADY_EXISTS_IN_THE_TEAM = 'MEMBER_ALREADY_EXISTS_IN_THE_TEAM',
}
export enum CreateTeamError {
  TEAM_NOT_CREATED = 'TEAM_NOT_CREATED',
}
export enum JoinToTeamWithInvitationTokenError {
  INVITATION_TOKEN_NOT_FOUND = 'INVITATION_TOKEN_NOT_FOUND',
  TEAM_IN_INVITATION_TOKEN_NOT_SPECIFIED = 'TEAM_IN_INVITATION_TOKEN_NOT_SPECIFIED',
  MEMBER_ALREADY_EXISTS_IN_THE_TEAM = 'MEMBER_ALREADY_EXISTS_IN_THE_TEAM',
  INVITATION_TOKEN_EXPIRED = 'INVITATION_TOKEN_EXPIRED',
}
export enum InvitationTeamStatus {
  Waiting = 'Waiting',
  Taken = 'Taken',
}

export interface RemoveUserFromTeamInput {
  userId: string;
}
export interface InviteTokenInput {
  expires?: string | undefined;
  domain?: string | undefined;
  name?: string | undefined;
}

export type Models = {
  ['GenerateInviteTokenResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['RemoveUserFromTeamResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['JoinToTeamResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['CreateTeamResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['JoinToTeamWithInvitationTokenResponse']: {
    result: {
      args: Record<string, never>;
    };
    hasError: {
      args: Record<string, never>;
    };
  };
  ['InvitationTeamToken']: {
    teamId: {
      args: Record<string, never>;
    };
    recipient: {
      args: Record<string, never>;
    };
    status: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    teamName: {
      args: Record<string, never>;
    };
  };
  ['User']: {
    _id: {
      args: Record<string, never>;
    };
  };
  ['Team']: {
    _id: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
    owner: {
      args: Record<string, never>;
    };
    members: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
  };
  ['TeamMember']: {
    _id: {
      args: Record<string, never>;
    };
    username: {
      args: Record<string, never>;
    };
    createdAt: {
      args: Record<string, never>;
    };
    user: {
      args: Record<string, never>;
    };
    team: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserQuery']: {
    showTeamInvitations: {
      args: {
        status: InvitationTeamStatus;
      };
    };
    teams: {
      args: Record<string, never>;
    };
    teamMember: {
      args: {
        _id: string;
      };
    };
  };
  ['TeamMemberQuery']: {
    showTeamInvitations: {
      args: {
        sentFromMyTeam?: boolean | undefined;
        status?: InvitationTeamStatus | undefined;
      };
    };
    showInviteTokens: {
      args: Record<string, never>;
    };
    team: {
      args: Record<string, never>;
    };
  };
  ['AuthorizedUserMutation']: {
    joinToTeam: {
      args: {
        teamId: string;
      };
    };
    joinToTeamWithInvitationToken: {
      args: {
        token: string;
      };
    };
    createTeam: {
      args: {
        teamName: string;
      };
    };
    teamMember: {
      args: {
        _id: string;
      };
    };
  };
  ['TeamMemberMutation']: {
    generateInviteToken: {
      args: {
        tokenOptions: InviteTokenInput;
      };
    };
    removeUserFromTeam: {
      args: {
        data: RemoveUserFromTeamInput;
      };
    };
    deleteInviteToken: {
      args: {
        id: string;
      };
    };
  };
  ['InviteToken']: {
    token: {
      args: Record<string, never>;
    };
    expires: {
      args: Record<string, never>;
    };
    domain: {
      args: Record<string, never>;
    };
    teamId: {
      args: Record<string, never>;
    };
    _id: {
      args: Record<string, never>;
    };
    name: {
      args: Record<string, never>;
    };
  };
};

export type Directives = unknown;

export type Scalars = unknown;

export interface GenerateInviteTokenResponse {
  result?: string | undefined;
  hasError?: GenerateInviteTokenError | undefined;
}
export interface RemoveUserFromTeamResponse {
  result?: boolean | undefined;
  hasError?: RemoveUserFromTeamError | undefined;
}
export interface JoinToTeamResponse {
  result?: boolean | undefined;
  hasError?: JoinToTeamError | undefined;
}
export interface CreateTeamResponse {
  result?: string | undefined;
  hasError?: CreateTeamError | undefined;
}
export interface JoinToTeamWithInvitationTokenResponse {
  result?: boolean | undefined;
  hasError?: JoinToTeamWithInvitationTokenError | undefined;
}
export interface InvitationTeamToken {
  teamId: string;
  recipient: string;
  status: InvitationTeamStatus;
  _id: string;
  teamName: string;
}
export interface User {
  _id: string;
}
export interface Team {
  _id: string;
  name: string;
  owner: User;
  members: Array<TeamMember>;
  createdAt: string;
}
export interface TeamMember {
  _id: string;
  username: string;
  createdAt: string;
  user: User;
  team: Team;
}
export interface AuthorizedUserQuery {
  showTeamInvitations: Array<InvitationTeamToken>;
  teams?: Array<Team> | undefined;
  teamMember?: TeamMemberQuery | undefined;
}
export interface TeamMemberQuery {
  showTeamInvitations: Array<InvitationTeamToken>;
  showInviteTokens: Array<InviteToken>;
  team: Team;
}
export interface AuthorizedUserMutation {
  joinToTeam: JoinToTeamResponse;
  joinToTeamWithInvitationToken: JoinToTeamWithInvitationTokenResponse;
  createTeam: CreateTeamResponse;
  teamMember?: TeamMemberMutation | undefined;
}
export interface TeamMemberMutation {
  generateInviteToken: GenerateInviteTokenResponse;
  removeUserFromTeam: RemoveUserFromTeamResponse;
  deleteInviteToken: boolean;
}
export interface InviteToken {
  token: string;
  expires: string;
  domain: string;
  teamId?: string | undefined;
  _id: string;
  name?: string | undefined;
}
