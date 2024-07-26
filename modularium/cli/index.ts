#!/usr/bin/env node
import { Command } from 'commander';
import { createApp } from './add/index.js';

const program = new Command();

program
  .name('modularium')
  .description('CLI for modularium. Add micro-federated GraphQL backend parts')
  .version('0.0.1');

createApp(program);

program.parse();
