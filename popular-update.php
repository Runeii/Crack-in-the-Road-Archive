<?php

function getService()
{
  // Creates and returns the Analytics service object.

  // Load the Google API PHP Client Library.
  require_once __DIR__ . '/classes/google-api-php-client/src/Google/autoload.php';

  // Use the developers console and replace the values with your
  // service account email, and relative location of your key file.
  $service_account_email = 'account-1@citr-test.iam.gserviceaccount.com';
  $key_file_location = __DIR__ . '/classes/google-api-php-client/CITR-9a6b358a6eb9.p12';

  // Create and configure a new client object.
  $client = new Google_Client();
  $client->setApplicationName("CITR");
  $analytics = new Google_Service_Analytics($client);

  // Read the generated client_secrets.p12 key.
  $key = file_get_contents($key_file_location);
  $cred = new Google_Auth_AssertionCredentials(
      $service_account_email,
      array(Google_Service_Analytics::ANALYTICS_READONLY),
      $key
  );
  $client->setAssertionCredentials($cred);
  if($client->getAuth()->isAccessTokenExpired()) {
    $client->getAuth()->refreshTokenWithAssertion($cred);
  }

  return $analytics;
}

function getResults(&$analytics) {
  // Calls the Core Reporting API and queries for the number of sessions
  // for the last seven days.
  $optParams = array(
      'dimensions' => 'ga:eventAction,ga:eventLabel',
			'sort' => '-ga:totalEvents',
			'filters' => 'ga:eventAction%3D%3Dread',
		'max-results' => 10
	);
   return $analytics->data_ga->get(
       'ga:49013870',
       'yesterday',
       'today',
       'ga:totalEvents',
		 	$optParams
		 );
}

function updateResults(&$results) {
	require( __DIR__ . '/../../../wp-load.php');
	update_option('ga_popular_posts', $results->getRows());
	echo get_option('ga_popular_posts');
}

$analytics = getService();
$results = getResults($analytics);
updateResults($results);
					print_r($results);													
?>