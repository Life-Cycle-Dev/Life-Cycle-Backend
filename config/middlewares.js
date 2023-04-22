module.exports = [
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          'img-src': ["*", "'self'", 'data:', 'cdn.jsdelivr.net', 'strapi.io', `https://storage.googleapis.com`],
          'media-src': ["*", "'self'", 'data:', 'cdn.jsdelivr.net', 'strapi.io', `https://storage.googleapis.com`]
        },
      }
    },
  },
];
