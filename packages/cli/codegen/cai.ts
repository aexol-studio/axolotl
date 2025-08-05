import chalk from 'chalk';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import openai from 'openai';
import clipboard from 'clipboardy';
import { config } from '@aexol/axolotl-config';
import * as path from 'path';
import { vaildateChatModel } from '@/codegen/utils.js';
import { oraPromise } from 'ora';

export const caiCommand = (program: Command) => {
  program
    .command('wai')
    .argument('<schemaPath>')
    .argument('<prompt>')
    .argument('[existing_resolver_path]', 'path to the file containing existing implementation of webhook')
    .description(`${chalk.greenBright('Axolotl ai')} - webhooks creator`)
    .action(createResolverFile);
};

export const createResolverFile = async (schemaPath: string, prompt: string, existing_resolver_path?: string) => {
  const cfg = config.get();
  let extra_prompt_info = cfg.code_prompt_info;
  const agent_model = vaildateChatModel(cfg.agent_model || 'gpt-4.1');

  if (extra_prompt_info?.endsWith('.txt')) {
    extra_prompt_info = readFileSync(path.join(process.cwd(), extra_prompt_info), 'utf-8');
  }
  const system = `You create code taking into account the following schema: 
  \`\`\`graphql
  ${readFileSync(schemaPath, 'utf-8')}
  \`\`\`


  ${extra_prompt_info ? `Also take into account that: \n${extra_prompt_info}\n` : ''}
  
  User provides the PROMPT telling what code should do. Also return just the typescript code. If you want to add documentation add it in TypeScript. Don't return markdown.

  ${existing_resolver_path ? `Please change that in the following existing code: ${readFileSync(path.join(process.cwd(), existing_resolver_path), 'utf-8')}` : ''}
  `;
  const user = `PROMPT=${prompt}`;
  const apiKey = process.env.OPEN_AI_API_KEY;
  if (!apiKey) throw new Error('Please provide OPEN_AI_API_KEY env variable');
  const ai = new openai({ apiKey: process.env.OPEN_AI_API_KEY });
  await oraPromise(
    ai.chat.completions
      .create({
        model: agent_model,
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
      }),
    { spinner: 'binary', text: 'Thinking' },
  );
};
