<?php

//$url = 'http://lucky7goastar.com/sikkim_teer_api/public/api/generateNewResultAndDraw';
	$data = array();
 
	// use key 'http' even if you send the request to https://...
	$options = array('http' => array(
		'method'  => 'POST',
		'content' => http_build_query($data)
	));
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);

?> 