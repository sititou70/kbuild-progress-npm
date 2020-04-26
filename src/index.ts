#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import byline from 'byline';
import Progress from 'progress';

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getTargetFiles = async (): Promise<string[]> =>
  new Promise((resolve) => {
    let target_files: string[] = [];

    const make = spawn('make', ['-n', ...process.argv.slice(2)]);
    byline(make.stdout).on('data', (buff: Buffer) => {
      const line = buff.toString();
      const matched = line.match(/-o ([^ ,]+?\.o)/);

      if (matched === null) return;
      target_files.push(matched[1]);
    });
    make.on('exit', () => {
      resolve(target_files);
    });
    make.on('error', (e) => {
      console.error('make process exit with error!', e);
      throw new Error("can't get target files.");
    });
  });

const getChangedFiles = (): string[] =>
  execSync('find . -newer .config').toString().split('\n');

const main = async (): Promise<void> => {
  try {
    fs.statSync('.config');
  } catch (e) {
    console.error(
      'this tool must be executed in the Linux kernel project root.',
      e
    );
    throw Error("can't stat .config file");
  }

  const target_files = new Set(
    (await getTargetFiles()).map((x) => path.normalize(x))
  );
  const progress = new Progress('[:bar] :percent (:current / :total) :etas', {
    total: target_files.size,
    complete: '=',
    incomplete: ' ',
  });

  while (true) {
    try {
      const chanaged_files: string[] = getChangedFiles().map((x) =>
        path.normalize(x)
      );
      const remaining_files: string[] = chanaged_files.filter((x) =>
        target_files.has(x)
      );
      progress.tick(remaining_files.length - progress.curr);
    } catch (e) {}

    await sleep(3000);
  }
};
main();
