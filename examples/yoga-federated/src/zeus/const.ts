/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Secret: `scalar.Secret` as const,
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
	Mutation:{
		login:{

		},
		register:{

		}
	},
	Subscription:{
		countdown:{

		}
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
	resolver:{

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
	Query:{
		user:"AuthorizedUserQuery"
	},
	Mutation:{
		user:"AuthorizedUserMutation",
		login:"String",
		register:"String"
	},
	Subscription:{
		countdown:"Int"
	},
	ID: `scalar.ID` as const
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const,
	subscription: "Subscription" as const
}