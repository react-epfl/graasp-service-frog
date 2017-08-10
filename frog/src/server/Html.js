/* @flow */
/* eslint react/no-danger:0 */
import React, { Component, PropTypes } from 'react';
import { renderToString } from 'react-dom-stream/server';
import App from '../universal/ui/App';

// Injects the server rendered state and app into a basic html template
export default class Html extends Component {
  render(): React.Element<any> {
    const PROD = process.env.NODE_ENV === 'production';
    const {
      title,
      __meteor_runtime_config__,
      assets,
      renderProps
    } = this.props;
    const { manifest, app, vendor, meteor } = assets || {};

    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="description" content="" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          {PROD &&
            <link
              rel="stylesheet"
              href="/static/prerender.css"
              type="text/css"
            />}
          <title>
            {title}
          </title>
        </head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__meteor_runtime_config__ = ${JSON.stringify(
                __meteor_runtime_config__
              )}`
            }}
          />
          <div id="render-target" />
          {PROD &&
            <script dangerouslySetInnerHTML={{ __html: manifest.text }} />}
          {PROD && <script src={vendor.js} />}
          {PROD && <script src={meteor.js} />}
          <script src={PROD ? app.js : '/static/app.js'} />
          {process.env.DISABLE_FULL_SSR && <span id="full-ssr-disabled" />}
        </body>
      </html>
    );
  }
}
