module.exports = {
	//'url' : 'mongodb://<dbuser>:<dbpassword>@novus.modulusmongo.net:27017/<dbName>'
	'database' : 'mongodb://localhost:27017/passport-mongo',
	'port': process.env.port || 1234,
	'secret': 'myVerySecretSECRET'
}