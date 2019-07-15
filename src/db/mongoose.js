const mongoose = require( 'mongoose' )

const connect = async ( ) => {
	await mongoose.connect( 'mongodb://localhost:27017/url_shortner' ,{
		useCreateIndex		: true,
		useNewUrlParser 	: true,
		useFindAndModify 	: true
	} )	
}
connect( )
console.log( 'Success')
