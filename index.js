const express 			= require( 'express' )
const app 				= express( )
const bodyParser 		= require( 'body-parser' )
const Url 				= require( './src/models/url' )
const User 				= require( './src/models/user' )
const path				= require( 'path')
const cookieParser		= require( 'cookie-parser' )
const { convertUrlInId } = require( './src/utils/converters' )
const { auth , validateToken} 			= require( './src/middleware/auth' )

require( './src/db/mongoose' )

app.set( 'view engine' , 'ejs')
app.set( 'views' , path.join( __dirname , 'src' , 'views' ) )

app.use( cookieParser( ) )
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use( bodyParser.json( ))
app.use( express.static( path.join( __dirname , 'src' , "public") ) )

app.get('/signup'  , ( req , res  )=>{
	console.log( 'sign up' )
	res.render( 'signup' )
})


app.get( '/' , auth , ( req , res ) =>{
	console.log( 'Welcome' + req.user.email )
	return res.render( 'home' , { name : req.user.name })
})


app.post( '/user' , async( req , res ) =>{

	const user = new User ( req.body )
	await user.save( )
	return res.redirect('/' )
})

app.get('/login' , async ( req , res ) =>{
	

	if( req.cookies.token ){
		console.log( req.cookies.token )
		try{
			const user = await validateToken( req.cookies.token )
			console.log( user )
			if( user ){
				return res.redirect( '/' )
			}
		}catch( err  ){
			console.log( 'error occured' + err)
		}
	}

	return res.render( 'login' )

})

app.post( '/login' , async ( req , res ) =>{
	const user = await User.findOne( { email : req.body.email } )
	console.log( req.body )
	console.log( user )
	if(!user){
		throw new Error( 'Please Enter valid Email or Password' )
	}
	if( user.password !== req.body.password ){
		throw new Error( 'Please Enter valid Email or Password' )
	}
	token = await user.generateAuthToken( )
	return res.send( { token } )
})

app.post("/get_short_url" , auth ,  async ( req , res )  =>{

	const originalUrl 	= req.body.url.replace( 'https://' , '' )
	const url 			= new Url( { originalUrl } )
	await url.save( )
	res.send( { shortnedUrl : url.shortnedUrl , originalUrl : url.originalUrl } )

})

app.get("/:url" , async ( req , res ) =>{
	console.log( "url = " + req.params.url )
	const Id 	= convertUrlInId( req.params.url )
	const url 	= await Url.findOne( { Id } )
	return res.redirect( "https://"+ url.originalUrl )

})

app.listen( process.env.PORT || 3000 , ( ) =>{
	console.log( "Server is up" )
})