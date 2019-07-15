const mongoose 				= require( 'mongoose' )
const validator 			= require( 'validator' )
const Sequence 				= require( './sequence' )
const { convertIdInUrl }	= require( '../utils/converters' ) 


const UrlSchema = new mongoose.Schema(  {
	'Id'		 : {
		type 		: Number,
		//required 	: true,
		unique		: true 
	},

	'originalUrl' : {
		type 		: String , 
		required	: true,
		trim		: true,
		//unique		: true
	},/*
	'expiryDt'	 : {
		type		: Date , 
		required	: true
	},*/

	'shortnedUrl': {
		type		: String ,
		//required	: true,
		unique		: true
	}
 },
 {
  	timestamps : true
 }
)

UrlSchema.methods.populateOtherRequiredAttributes = async function( ) {

	const url 		= this
	const seqName   = 'UrlId'
	url.Id 			= await Sequence.getNextVal( seqName )
	url.shortnedUrl = convertIdInUrl( url.Id )
}

UrlSchema.statics.getOriginalUrl = async ( id ) =>{
	const url = await Url.findOne( { Id : id } )
	return url.orginalUrl
}

UrlSchema.pre( 'save' , async function( next ) {
	const url = this
	await url.populateOtherRequiredAttributes( )
	console.log(  'done' )
	next( )
})


const Url 		= mongoose.model( 'Url' , UrlSchema )
module.exports 	= Url 