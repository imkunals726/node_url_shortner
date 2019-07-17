const mongoose = require( 'mongoose' )

const connect = async ( ) => {
	await mongoose.connect( process.env.MONGODB_URL ,{
		useCreateIndex		: true,
		useNewUrlParser 	: true,
		useFindAndModify 	: true
	} )	
}
connect( )
console.log( 'Success')
