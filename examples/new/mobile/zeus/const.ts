/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Mutation:{
		echo:{

		}
	},
	AIChatMessage:{

	},
	Subscription:{
		countdown:{

		},
		aiChat:{
			messages:"AIChatMessage"
		}
	},
	ID: `scalar.ID` as const
}

export const ReturnTypes: Record<string,any> = {
	User:{
		id:"ID",
		name:"String"
	},
	Query:{
		hello:"String"
	},
	Mutation:{
		echo:"String"
	},
	AIChatChunk:{
		content:"String",
		done:"Boolean"
	},
	Subscription:{
		countdown:"Int",
		aiChat:"AIChatChunk"
	},
	resolver:{

	},
	ID: `scalar.ID` as const
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const,
	subscription: "Subscription" as const
}