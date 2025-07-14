import chalk from 'chalk';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import openai from 'openai';
import clipboard from 'clipboardy';
import { config } from '@aexol/axolotl-config';
import * as path from 'path';

export const frontendAiCommand = (program: Command) => {
  program
    .command('fai')
    .argument('<schemaPath>')
    .argument('<prompt>')
    .argument('[existing_path]', 'path to the file containing existing implementation')
    .description(`${chalk.greenBright('Axolotl frontend ai')} - react components and views creator`)
    .action(createResolverFile);
};

export const createResolverFile = async (schemaPath: string, prompt: string, existing_path?: string) => {
  let extra_prompt_info = await config.getValue('frontend_prompt_info');
  if (extra_prompt_info?.endsWith('.txt')) {
    extra_prompt_info = readFileSync(path.join(process.cwd(), extra_prompt_info), 'utf-8');
  }
  const system = `You create react components and views in typescript for the following schema: 
  \`\`\`graphql
  ${readFileSync(schemaPath, 'utf-8')}
  \`\`\`

  You create them using tailwindV4 if you need any additional components import them from @radix/ui libraries
  Ensure typescript safety
  Use GraphQL Zeus to fetch. Here is the specification of graphql-zeus
  
GraphQL Zeus Spec:

To return the promise of type query for data object:

PROMISE_RETURNING_OBJECT = Chain.[OPERATION_NAME]({
    ...FUNCTION_FIELD_PARAMS
})(
    ...QUERY_OBJECT
).then ( RESPONSE_OBJECT => RESPONSE_OBJECT[OPERATION_FIELD] )

FUNCTION_FIELD_PARAMS = {
  KEY: VALUE
}

QUERY_OBJECT = {
...RETURN_PARAMS
}

Return params is an object containing RETURN_KEY - true if it is a scalar, RETURN_PARAMS if type. Otherwise it is a function where you pass field params and type return params.

RETURN_PARAMS = {
    RETURN_KEY: true,
    RETURN_KEY: {
        ...RETURN_PARAMS
    },
    RETURN_FUNCTION_KEY:[
        {
            ...FUNCTION_FIELD_PARAMS
        },
        {
            ...RETURN_PARAMS
        }
    ]
}

Aliases
RETURN_PARAMS = {
  __alias: RETURN_PARAMS
}

Example:
Given the following schema:
\`\`\`graphql
interface Nameable{
	name: String!
}

type Query{
	cardById(
		cardId: String
	): Card
	"""
	Draw a card<br>
	"""
	drawCard: Card!
	drawChangeCard: ChangeCard!
	"""
	list All Cards availble<br>
	"""
	listCards: [Card!]!
	myStacks: [CardStack!]
	nameables: [Nameable!]!
}

"""
create card inputs<br>
"""
input createCard{
	"""
	The name of a card<br>
	"""
	name: String!
	"""
	Description of a card<br>
	"""
	description: String!
}

"""
Stack of cards
"""
type CardStack implements Nameable{
	cards: [Card!]
	name: String!
}

"""
Card used in card game<br>
"""
type Card implements Nameable{
	"""
	Attack other cards on the table , returns Cards after attack<br>
	"""
	attack(
		"""
		Attacked card/card ids<br>
		"""
		cardID: [String!]!
	): [Card!]
	"""
	Description of a card<br>
	"""
	description: String!
	id: ID!
	"""
	The name of a card<br>
	"""
	name: String!
}

type SpecialCard implements Nameable{
	effect: String!
	name: String!
}

type EffectCard implements Nameable{
	effectSize: Float!
	name: String!
}

type Mutation{
	"""
	add Card to Cards database<br>
	"""
	addCard(
		card: createCard!
	): Card!
}

union ChangeCard = SpecialCard | EffectCard

type Subscription{
	deck: [Card!]
}

schema{
	query: Query
	mutation: Mutation
	subscription: Subscription
}

\`\`\`
For example to use zeus generated file located in zeus folder:

\`\`\`typescript
import { Chain } from './zeus';

// Create a Chain client instance with the endpoint
const chain = Chain('https://faker.graphqleditor.com/a-team/olympus/graphql');

// Query the endpoint with Typescript autocomplete for arguments and response fields
const listCardsAndDraw = await chain('query')({
  cardById: [
    {
      cardId: 'da21ce0a-40a0-43ba-85c2-6eec2bf1ae21',
    },
    {
      name: true,
      description: true,
    },
  ],
  listCards: {
    name: true,
    attack: [
      {
        cardID: [
          '66c1af53-7d5e-4d89-94b5-1ebf593508f6',
          'fc0e5757-4d8a-4f6a-a23b-356ce167f873',
        ],
      },
      {
        name: true,
      },
    ],
  },
  drawCard: {
    name: true,
  },
});
\`\`\`
  ${extra_prompt_info ? `Also take into account that: \n${extra_prompt_info}\n` : ''}
  
  User provides PROMPT telling what code should do

  ${existing_path ? `Please change that in the following existing code: ${readFileSync(path.join(process.cwd(), existing_path), 'utf-8')}` : ''}
  `;
  const user = `PROMPT=${prompt}`;
  const apiKey = process.env.OPEN_AI_API_KEY;
  if (!apiKey) throw new Error('Please provide OPEN_AI_API_KEY env variable');
  const ai = new openai({ apiKey: process.env.OPEN_AI_API_KEY });
  ai.chat.completions
    .create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content: user,
        },
      ],
    })
    .then((response) => {
      const res = response.choices.at(0)?.message.content;
      if (res) {
        clipboard.writeSync(res);
      }
      console.log(`Generated code has been copied to clipboard`);
    });
};
