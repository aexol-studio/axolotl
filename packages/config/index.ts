import { ConfigMaker } from 'config-maker';

export type ProjectOptions = {
  schema: string;
  models: string;
  federation?: Array<{
    schema: string;
    models: string;
  }>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const config = new ConfigMaker<ProjectOptions, {}>('axolotl', {
  decoders: {},
  config: {
    environment: {
      schema: 'SCHEMA_PATH',
      models: 'MODELS_PATH',
    },
  },
});
