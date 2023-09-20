const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
    createProxyMiddleware('/auth',{
      target:"https://spirokitdev.the-researcher.com/v1",
      changeOrigin: true,
    })
  )
  app.use(
    createProxyMiddleware('/countries',{
      target:'https://spirokitdev.the-researcher.com/v1',
      changeOrigin: true,        
    })
  )
  app.use(
    createProxyMiddleware('/clinics',{
      target:'https://spirokitdev.the-researcher.com/v1',
      changeOrigin: true,        
    })
  )
  app.use(
    createProxyMiddleware('/subjects',{
      target:'https://spirokitdev.the-researcher.com/v1',
      changeOrigin: true,        
    })
  )
  app.use(
    createProxyMiddleware('/v2/subjects',{
      target:'https://spirokitdev.the-researcher.com/v1',
      changeOrigin: true,        
    })
  )
  app.use(
    createProxyMiddleware('/clinicians',{
      target:'https://spirokitdev.the-researcher.com/v1',
      changeOrigin: true,
    })
  )
  app.use(
    createProxyMiddleware('/devices',{
      target:'https://spirokitdev.the-researcher.com/v1',
      changeOrigin: true,
    })
  )
};


