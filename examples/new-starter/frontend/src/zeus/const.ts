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
	AuthorizedUserQuery:{
		todo:{

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
	AuthorizedUserQuery:{
		_:"String",
		todos:"Todo",
		todo:"Todo",
		me:"User",
		sessions:"Session"
	},
	AuthorizedUserMutation:{
		_:"String",
		createTodo:"String",
		todoOps:"TodoOps",
		changePassword:"Boolean",
		revokeSession:"Boolean",
		revokeAllSessions:"Boolean",
		deleteAccount:"Boolean"
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
	ID: `scalar.ID` as const
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const,
	subscription: "Subscription" as const
}