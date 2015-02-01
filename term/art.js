
var jp2a = require( "jp2a" );

jp2a( [ "cat.jpg", "--width=50", "--background=light" ],  function( output ){
    console.log( output );
});
