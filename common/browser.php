<?php
	$browser = array(
	    'version'   => '0.0.0',
	    'majorver'  => 0,
	    'minorver'  => 0,
	    'build'     => 0,
	    'name'      => 'unknown',
		'useragent' => ''
	);

	$browsers = array(
	    'firefox', 'msie', 'opera', 'chrome', 'safari', 'mozilla', 'seamonkey', 'konqueror', 'netscape',
	    'gecko', 'navigator', 'mosaic', 'lynx', 'amaya', 'omniweb', 'avant', 'camino', 'flock', 'aol'
	);
	  
	if (isset($_SERVER['HTTP_USER_AGENT'])) {
	   $browser['useragent'] = $_SERVER['HTTP_USER_AGENT'];
	   $user_agent = strtolower($browser['useragent']);
	   foreach($browsers as $_browser) {
			if (preg_match("/($_browser)[\/ ]?([0-9.]*)/", $user_agent, $match)) {
				$browser['name'] = $match[1];
				$browser['version'] = $match[2];
				@list($browser['majorver'], $browser['minorver'], $browser['build']) = explode('.', $browser['version']);
				break;
			}
	    }
	}
	if($browser['name']=='msie'|| ($browser['name']=='chrome' && $browser['majorver']<35) || ($browser['name']=='firefox' && $browser['majorver']<25) ){
		echo('<section id="header" class="dark">
			<header>
					<div class="image">
						<img src="images/jt_logo_3.jpg" alt="" />
					</div>
					<h2>joel c. thomas</h2>
					<div>
						<br>
						<h1 style="color:#fff;">Your browser is not supported... :( </h1>	
						<br>
						Either you are using outdated version or not using Google Chrome. <br>If you already have Google Chrome in your computer, please visit this page using that. Else, please download from <a href="http://www.google.com/chrome">here</a>.<br><br>
					</div>						 
			</header>
		</section>');
		echo("</body></html>");
		exit();
	}
?>