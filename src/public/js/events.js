$getUrl 	= $('#getUrl')
$shortUrl 	= document.querySelector( '#shortUrl' )
$url    	= document.querySelector('#Url')
$getUrl.click( function( e ) 
{
	e.preventDefault( )
	$.ajax({
		url : '/get_short_url', 
		type : 'POST',
		data : {
			url : $url.value
		},
		success : function( response ){
			$shortUrl.value = response.shortnedUrl
		}
	})
});