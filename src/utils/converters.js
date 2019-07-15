const getBase62Character = ( base62code ) =>{

	/* returns base62 character from base10 character */
	
	if( base62code >= 0 && base62code <26 ){
	
		return String.fromCharCode( 97 + base62code )
	
	}else if( base62code >= 26 && base62code <52 ){
	
		return String.fromCharCode( 65 + base62code - 26 )
	
	}else{
	
		return base62code - 52 
	
	}

}

const getBase62Code = ( base62Character ) =>{
	
	let asciiCode = base62Character.charCodeAt( 0 )

	if ( asciiCode >= 97 ) {
		
		return asciiCode - 97
	
	}else if( asciiCode >= 65 ){

		return asciiCode - 65 + 26
	
	}else{

		return asciiCode - 48 + 52

	}
}

const convertIdInUrl = ( id ) => {

	let base10code 			= id 
	const base62Encoding 	= []

	while( parseInt( base10code / 62 )  !== 0  ){
		
		let rem  			= base10code % 62
		// console.log( rem )
		let base62Character = getBase62Character( rem )
		
		base62Encoding.push( base62Character  )

		base10code 			= parseInt( base10code / 62 )
	
	}

	let base62Character = getBase62Character( base10code )
	base62Encoding.push( base62Character )

	base62Encoding.reverse( )
	return base62Encoding.join( '' )

}

const convertUrlInId = ( url ) =>{
	
	let base62Multiplier 	= 1
	const urllen 			= url.length
	let id 					= 0

	for( var index = urllen -1 ; index>= 0 ; index-- ){

		let base62Code = getBase62Code( url.charAt( index ) )
		// console.log( base62Code )
		id += ( base62Code * base62Multiplier)
		base62Multiplier *= 62
	}

	return id

}



module.exports = { convertIdInUrl , convertUrlInId }