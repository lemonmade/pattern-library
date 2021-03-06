import path from 'path';
import cosmiconfig from 'cosmiconfig';

import Plugins from './plugins';
import {Descriptor} from '../library';
import createLogger from './logger';

const BASE_CONFIG = {
  root: process.cwd(),
  source: ['src'],
  output: 'docs',
  silent: false,
};

export default async function loadConfig() {
  const {config} = await cosmiconfig('librarian', {rcExtensions: true}) || {};
  return initialize(config);
}

export const loadBasicConfig = initialize;

function initialize({plugins, ...rest}) {
  const config = {
    ...BASE_CONFIG,
    ...rest,

    library: new Descriptor(),
    plugins: new Plugins(),

    absolutePath(thePath) {
      return path.isAbsolute(thePath) ? thePath : path.join(this.root, thePath);
    },

    rootRelative(thePath) {
      return path.relative(this.root, thePath);
    },
  };

  config.logger = createLogger(config);
  config.plugins.config = config;

  plugins.forEach((plugin) => config.plugins.add(plugin));

  return config;
}
