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

userSchema.methods.generateAuthToken = async function ( ){
	
	const user 	= this
	const token = await jwt.sign( { _id : user.id } , process.env.JWT_SECRET )

	user.tokens.push( { token } )
	await user.save( )
	
	return token
}

const User = mongoose.model( 'User' , userSchema )

module.exports = User