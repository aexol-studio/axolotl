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
		me:"User"
	},
	AuthorizedUserMutation:{
		_:"String",
		createTodo:"String",
		todoOps:"TodoOps",
		changePassword:"Boolean"
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
		username:"String"
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