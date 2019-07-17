const mongoose 	= require( 'mongoose' )
const User 		= require( '../models/user' )
const jwt		= require( 'jsonwebtoken' )
const bcrypt	 = require( 'bcryptjs' ) 

const validateToken = async ( token ) =>{
	user_id = await jwt.verify( token , process.env.JWT_SECRET )
	user    = await User.findOne( { _id : user_id } )

	if( !user ){
		throw new Error( 'Invalid credentials' )
	}

	return user
}


const auth = async ( req , res , next ) =>{

	token 	= req.cookies.token
	if( !token ){
		res.redirect( '/login' )
	}
	user    = await validateToken( token )

	req.user = user
	await next( )
}

module.exports = { auth , validateToken }