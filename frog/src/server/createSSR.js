import React from 'react';
import Html from './Html';
import { renderToStaticMarkup } from 'react-dom-stream/server';
import fs from 'fs';
import path from 'path';
import { join } from 'path';
import promisify from 'es6-promisify';
import { Meteor } from 'meteor/meteor';
import url from 'url';
import type { IncomingMessage, ServerResponse } from 'http';

const __meteor_runtime_config__ = {
  PUBLIC_SETTINGS: Meteor.settings.public || {},
  ROOT_URL: process.env.ROOT_URL,
  // Not everything is in place to support basename right now (e.g. react-router history config, webpack config)
  // but might as well go ahead and use the correct value here anyway
  ROOT_URL_PATH_PREFIX: url.parse(process.env.ROOT_URL).pathname.substring(1),
  meteorEnv: {
    NODE_ENV: process.env.NODE_ENV
  },
  meteorRelease: Meteor.release
};

function renderApp(res: ServerResponse, assets?: Object, renderProps?: Object) {
  const location =
    (renderProps && renderProps.location && renderProps.location.pathname) ||
    '/';
  // Needed so some components can render based on location
  const htmlStream = renderToStaticMarkup(
    <Html
      title="Crater"
      assets={assets}
      __meteor_runtime_config__={__meteor_runtime_config__}
      renderProps={renderProps}
    />
  );
  res.write('<!DOCTYPE html>');
  htmlStream.pipe(res, { end: false });
  htmlStream.on('end', (): void => res.end());
}

async function createSSR(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'production') {
      const readFile = promisify(fs.readFile);
      const assets = JSON.parse(
        await readFile(path.resolve(__dirname, 'assets.json'), 'utf8')
      );
      assets.manifest.text = await readFile(
        join(__dirname, assets.manifest.js),
        'utf-8'
      );
      if (process.env.DISABLE_FULL_SSR) {
        return renderApp(res, assets);
      }
      // just send a cheap html doc + stringified store
      renderApp(res);
    }
    console.log('rendering app');
    renderApp(res);
  } catch (error) {
    console.error(error.stack); // eslint-disable-line no-console
  }
}

export default createSSR;
