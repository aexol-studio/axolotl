/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Secret: `scalar.Secret` as const,
	TodoUpdateType: "enum" as const,
	Mutation:{
		login:{

		},
		register:{

		}
	},
	Subscription:{
		todoUpdates:{

		},
		countdown:{

		},
		aiChat:{
			messages:"AIChatMessage"
		}
	},
	AIChatMessage:{

	},
	AuthorizedUserQuery:{
		todo:{

		},
		note:{

		}
	},
	AuthorizedUserMutation:{
		createTodo:{
			secret:"Secret"
		},
		todoOps:{

		},
		changePassword:{

		},
		revokeSession:{

		},
		deleteAccount:{

		},
		createNote:{
			input:"CreateNoteInput"
		},
		deleteNote:{

		}
	},
	NoteStatus: "enum" as const,
	CreateNoteInput:{
		status:"NoteStatus"
	},
	ID: `scalar.ID` as const
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		user:"AuthorizedUserQuery"
	},
	Todo:{
		_id:"String",
		content:"String",
		done:"Boolean"
	},
	TodoOps:{
		markDone:"Boolean"
	},
	Secret: `scalar.Secret` as const,
	TodoUpdate:{
		type:"TodoUpdateType",
		todo:"Todo"
	},
	Mutation:{
		user:"AuthorizedUserMutation",
		login:"String",
		register:"String"
	},
	resolver:{

	},
	Subscription:{
		todoUpdates:"TodoUpdate",
		countdown:"Int",
		aiChat:"AIChatChunk"
	},
	User:{
		_id:"String",
		email:"String",
		createdAt:"String"
	},
	Session:{
		_id:"String",
		userAgent:"String",
		createdAt:"String",
		expiresAt:"String",
		isCurrent:"Boolean"
	},
	AIChatChunk:{
		content:"String",
		done:"Boolean"
	},
	AuthorizedUserQuery:{
		_:"String",
		todos:"Todo",
		todo:"Todo",
		me:"User",
		sessions:"Session",
		notes:"Note",
		note:"Note"
	},
	AuthorizedUserMutation:{
		_:"String",
		createTodo:"String",
		todoOps:"TodoOps",
		changePassword:"Boolean",
		revokeSession:"Boolean",
		revokeAllSessions:"Boolean",
		deleteAccount:"Boolean",
		createNote:"Note",
		deleteNote:"Boolean"
	},
	Note:{
		id:"ID",
		content:"String",
		status:"NoteStatus",
		createdAt:"String",
		updatedAt:"String"
	},
	ID: `scalar.ID` as const
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const,
	subscription: "Subscription" as const
}