// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'https://mani.citruspms.site',
//       changeOrigin: true,
//       pathRewrite: {
//         '^/api': '/API', // rewrite path
//       },
//     })
//   );
// };