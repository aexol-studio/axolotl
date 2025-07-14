import chalk from 'chalk';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import openai from 'openai';
import clipboard from 'clipboardy';
import { config } from '@aexol/axolotl-config';
import * as path from 'path';

export const aiCommand = (program: Command) => {
  program
    .command('ai')
    .argument('<schemaPath>')
    .argument('<type>')
    .argument('<field>')
    .argument('<prompt>')
    .argument('[existing_resolver_path]', 'path to the file containing existing implementation of resolver')
    .description(`${chalk.greenBright('Axolotl ai')} - resolvers creator`)
    .action(createResolverFile);
};

export const createResolverFile = async (
  schemaPath: string,
  type: string,
  field: string,
  prompt: string,
  existing_resolver_path?: string,
) => {
  let extra_prompt_info = await config.getValue('prompt_info');
  if (extra_prompt_info?.endsWith('.txt')) {
    extra_prompt_info = readFileSync(path.join(process.cwd(), extra_prompt_info), 'utf-8');
  }
  const system = `You create resolvers in typescript for the following schema: 
  \`\`\`graphql
  ${readFileSync(schemaPath, 'utf-8')}
  \`\`\`

  To create resolvers using axolotl use the following format for typescript code:

  \`\`\`typescript
  import { createResolvers } from '@src/axolotl.js';
  
  
  export default createResolvers({
    TYPE_NAME:{
        FIELD_NAME: async (yoga, args) => {
            RESOLVER_CODE
            return FIELD_RETURN
        }
    }
  })
  \`\`\`

  where TYPE_NAME is the user provided GraphQL Type name
  FIELD_NAME is the user provided field of the provided GraphQL type
  RESOLVER_CODE is the resolver code
  and FIELD_RETURN is what is returned from the resolver.

  ${extra_prompt_info ? `Also take into account that: \n${extra_prompt_info}\n` : ''}
  
  User provides graphql type and name of the field and you return the typescript resolver code and the PROMPT telling what resolver should do

  ${existing_resolver_path ? `Please change that in the following existing resolver code: ${readFileSync(path.join(process.cwd(), existing_resolver_path), 'utf-8')}` : ''}
  `;
  const user = `TYPE_NAME=${type}, FIELD_NAME=${field}, PROMPT=${prompt}`;
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
      console.log(`Generated resolver has been copied to clipboard`);
    });
};
