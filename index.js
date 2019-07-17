const express 			= require( 'express' )
const app 				= express( )
const bodyParser 		= require( 'body-parser' )
const Url 				= require( './src/models/url' )
const User 				= require( './src/models/user' )
const path				= require( 'path')
const cookieParser		= require( 'cookie-parser' )
const axios 			= require( 'axios' )
const http  			= require( 'http' ).Server( app )
const io				= require( 'socket.io' )( http )

const { convertUrlInId , convertIdInUrl } 	= require( './src/utils/converters' )
const { auth , validateToken} 				= require( './src/middleware/auth' )

require( './src/db/mongoose' )

app.set( 'view engine' , 'ejs')
app.set( 'views' , path.join( __dirname , 'src' , 'views' ) )

app.use( cookieParser( ) )
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use( bodyParser.json( ))
app.use( express.static( path.join( __dirname , 'src' , "public") ) )


io.on( 'connection', () =>{
 console.log( 'a user is connected')
})

app.get('/signup'  ,( req , res  )=>{

	res.render( 'signup' )
})


app.get( '/' , auth , async( req , res ) =>{

	Ids = req.user.IdsCreated

	Ids.forEach( async( Id ) =>{
		
		
		try{
			let url 	= await Url.findOne( { Id : Id.Id } )
			let {data}  = await axios.get( 'http://textance.herokuapp.com/title/'+url.originalUrl )

			io.emit( 'addUrlToPage' , { url : url.shortnedUrl ,title : data , createdAt : url.createdAt } )
		}catch( error ){

		}
	} )

	return res.render( 'home' , { name : req.user.name })

})


app.post( '/user' , async( req , res ) =>{

	const user = new User ( req.body )
	await user.save( )
	return res.redirect('/' )
})

app.get('/login' , async ( req , res ) =>{
	

	if( req.cookies.token ){
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

app.get( '/logout' , auth , async( req ,res )=>{
	console.log( req.user.tokens )
	req.user.tokens = await req.user.tokens.filter( ( token ) => token.token !== req.cookies.token )
	console.log( req.user.tokens )
	await req.user.save( )
	io.emit( 'logout' )
})

app.post("/get_short_url" , auth ,  async ( req , res )  =>{

	const originalUrl 	= req.body.url.replace( 'https://' , '' )
	const url 			= new Url( { originalUrl } )
	await url.save( )
	
	req.user.IdsCreated.push( { Id : url.Id } )
	await req.user.save( )

	res.send( { shortnedUrl : url.shortnedUrl , originalUrl : url.originalUrl , createdAt  : url.createdAt } )

})

app.get("/:url" , async ( req , res ) =>{
	
	const Id 	= convertUrlInId( req.params.url )
	const url 	= await Url.findOne( { Id } )
	return res.redirect( "https://"+ url.originalUrl )

})

const server = http.listen( process.env.PORT || 3000 , ( ) =>{
	console.log( "Server is up" )
})