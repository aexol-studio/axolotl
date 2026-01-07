/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Secret: `scalar.Secret` as const,
	TodoUpdateType: "enum" as const,
	AuthorizedUserMutation:{
		createTodo:{
			secret:"Secret"
		},
		todoOps:{

		},
		changePassword:{

		}
	},
	AuthorizedUserQuery:{
		todo:{

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
	Mutation:{
		login:{

		},
		register:{

		}
	},
	AIChatMessage:{

	},
	ID: `scalar.ID` as const
}

export const ReturnTypes: Record<string,any> = {
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
	User:{
		_id:"String",
		username:"String"
	},
	AuthorizedUserMutation:{
		createTodo:"String",
		todoOps:"TodoOps",
		changePassword:"Boolean"
	},
	AuthorizedUserQuery:{
		todos:"Todo",
		todo:"Todo",
		me:"User"
	},
	resolver:{

	},
	Query:{
		user:"AuthorizedUserQuery"
	},
	Subscription:{
		todoUpdates:"TodoUpdate",
		countdown:"Int",
		aiChat:"AIChatChunk"
	},
	Mutation:{
		user:"AuthorizedUserMutation",
		login:"String",
		register:"String"
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