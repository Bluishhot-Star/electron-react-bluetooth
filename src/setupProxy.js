const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
    createProxyMiddleware('/auth',{
      target:"https://spirokit-api.net/v1",
      changeOrigin: true,
    })
  )
};