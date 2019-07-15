$login 		= $('#login')
$email 		= document.querySelector( '#email' )
$password 	= document.querySelector( '#password' )

$login.click( function( e ) {
	e.preventDefault( )
	$.ajax( {
		url : '/login' , 
		type : 'POST' , 
		data : {
			email 		: $email.value,
			password 	: $password.value
		},
		success : function( response ){
			
			expirationDate = new Date( )
			expirationDate.setDate( expirationDate.getDate( ) + 3 ) //setting expiry of token after two days...
			
			if( response.token ){
				document.cookie = "token=" + response.token + ";"+ expirationDate + ";" + "path=/"
				window.location = '/'
			}

		}
	})
})