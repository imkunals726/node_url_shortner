var socket 		= io()
$getUrl 		= $('#getUrl')
$shortUrl 		= document.querySelector( '#shortUrl' )
$url    		= document.querySelector('#Url')
$urlsToReplace 	= document.querySelector('#UrlsToReplace' )

function renderToWebPage( url , title , createdAt ){

	let template 	= $('#urlTemplate').html( );
	Mustache.parse( template )
	let rendered  	= Mustache.render( template , { url , title , createdAt } )
	$("#UrlsToReplace").append( rendered )
}

$getUrl.click( function( e ) 
{
	e.preventDefault( )
	$.ajax({
		url 	: '/get_short_url', 
		type 	: 'POST',
		data 	: {
			url 	: $url.value
		},
		success : function( response ){
			
			$.ajax( {
				url : 'http://textance.herokuapp.com/title/'+response.originalUrl,
				complete: function( data ){

					let title 		= data.responseText
					let url 		= response.shortnedUrl
					let createdAt 	= response.createdAt 
					renderToWebPage( url , title , createdAt )
				}
			})
			
		}
	})
});

socket.on( 'addUrlToPage' , ( { url , title , createdAt } )=>{
	renderToWebPage( url , title , createdAt )
})