module.exports = {
	lintOnSave: false,
	devServer: {
		host: "127.0.0.1",
		port: 8080, // 端口号
		https: false, // https:{type:Boolean}
		open: true, //配置自动启动浏览器
		headers: {
			'Access-Control-Allow-Origin':'*',
		},
		proxy: {
			'/admin': { //代理api
				target: 'http://localhost:8888', //服务器api地址
				ws: true, // proxy websockets
				changeOrigin: true, //是否跨域
				pathRewrite: { //重写路径
					'^/admin': ''
				}
			}
		}
	}
}
