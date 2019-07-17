const mongoose 	 = require( 'mongoose' )
const bcrypt	 = require( 'bcryptjs' ) 
const jwt 		 = require( 'jsonwebtoken' )
const validator  = require( 'validator' )
const userSchema = new mongoose.Schema( {
	'name' : {
		type : String
	},
	'password' : {
		type : String
	},
	'email' : {
		type : String,
		required : true,
		unique : true
	},
	'IdsCreated' : [{
		Id : { 
			type : Number , 
			required : true
		}
	}],
	'tokens' : [{ 
		token : {
			type : String , 
			required : true
		} 
	}]
 })

userSchema.pre( 'save' , async function( next ) {
	const user = this

	if( user.isModified( 'password' ) ){
		user.password = await bcrypt.hash( user.password , 8 )
	}

	next( )
})

userSchema.statics.findByCredentials = async ( email , password ) =>{
	const user 		= await User.findOne( { email } )
	if( !user ){
		throw new Error( 'Unable to login' )
	}
	
	const newPass 	= await bcrypt.hash( password , 8 )
	const isMatched = await bcrypt.compare( password , user.password )

	if( !isMatched ){
		throw new Error( 'Unable to login' )
	}
	return user
}

userSchema.methods.generateAuthToken = async function ( ){
	
	const user 	= this
	const token = await jwt.sign( { _id : user.id } , process.env.JWT_SECRET )

	user.tokens.push( { token } )
	await user.save( )
	
	return token
}

const User = mongoose.model( 'User' , userSchema )

module.exports = User