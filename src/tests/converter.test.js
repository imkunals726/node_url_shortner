const { convertUrlInId , convertIdInUrl } = require( '../utils/converters' )


test( 'Convert Url to Id and Id to Url tests' , ( ) =>{

	let id 		= 123333333341
	let url 	= convertIdInUrl( id )

	expect( url ).toBe( 'ckMQgd7' )

	let calculatedId = convertUrlInId( url )

	expect( calculatedId ).toBe( id )
})