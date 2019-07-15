require( '../db/mongoose' )
const Url = require( '../models/url' )

function testCreateNewUrl( ){
	const url = new Url( { orginalUrl : 'google.com' } )
	url.save( ).then( ( )=>{
		console.log( 'Successs' )
	})
}
