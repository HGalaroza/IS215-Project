const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v1/chat/completions', // Match the endpoint of the API
    createProxyMiddleware({
      target: 'https://is215-openai.fics.store',
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/chat/completions': '/v1/chat/completions' // Rewrite the URL path
      }
    })
  );
};
