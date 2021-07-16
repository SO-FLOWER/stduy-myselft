const { createProxyMiddleware} =  require('http-proxy-middleware');

module.exports = function(app){
    // app.use(createProxyMiddleware('/devApi',{
    //     target:'http://202.104.149.204:8070',
    //     changeOrigin:true,
        
    // }))
    app.use(createProxyMiddleware('/devApi',{
        target:'http://m4v35w.natappfree.cc',
        changeOrigin:true,
        
    }))
    // app.use(proxy('/manage/api',{
    //     target:'',
    //     changeOrigin:true,
    // }))

}