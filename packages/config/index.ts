import { ConfigMaker } from 'config-maker';

export type ProjectOptions = {
  schema: string;
  models: string;
  federation?: Array<{
    schema: string;
    models: string;
  }>;
  prompt_info?: string;
  frontend_prompt_info?: string;
  graphql_prompt_info?: string;
  code_prompt_info?: string;
  agent_model?: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const config = new ConfigMaker<ProjectOptions>('axolotl', {
  decoders: {},
  config: {
    environment: {
      schema: 'SCHEMA_PATH',
      models: 'MODELS_PATH',
    },
  },
});
