jQuery(function($) {
	'use strict';

	// Check if the JS is working because you can never be too careful
	console.log('Initilize?');

	// DOM
	var WINDOW = $(window);
	var HTML = $('html');
	var BODY = $('body');
	var $container = $('.container');
	var $breathAnimationContainer = $('.breath-animation');
	var $wakeupAnimationContainer = $('.wakeup-animation');
	var $breathAnimationSVG = $breathAnimationContainer.find('svg');
	var $wakeupAnimationSVG = $wakeupAnimationContainer.find('svg');
	var $wantMore = $('.want-more');
	var $cursor = $('#dumb-cursor');
	// URL check
	var urlReg = /[^\/]+(?=\/$|$)/ig;

	// History API stuff
	var $nav = $('header nav ul');
	var $navLink = $('header nav ul li a');
	var $content = $('.content-container');
	
	var updateContainers = function(page, url){
		// Begin screen off CRT transition
		BODY.removeClass().addClass('ready screen-off');

		// Change content on a delay, just to get rid of the weird occasional pop in
		setTimeout(function(){
			// Update container class
			HTML.removeClass().addClass(page);
			$container.removeClass().addClass('container ' + page);
			// Keep the nav in the DOM because it borks and reloads. 
			// There's also a way to have it work with it, but simple class change works.
			$nav.find('.' + page).addClass('hidden').removeClass('active');
			$nav.find('.' + page).siblings().removeClass('hidden').addClass('active');

			history.pushState({}, '', url);
			$content.load(url + ' .content-container > *');
			// Turn on that screen!
			BODY.removeClass('screen-off').addClass('screen-on');
		}, 1000);
	};

	// Device check for custom cursor, if uses touch, ignore
	var isTouchDevice = function() {
		return 'ontouchstart' in window // works on most browsers 
		|| navigator.maxTouchPoints; // works on IE10/11 and Surface
	};

	// Header nav click event
	$navLink.each(function(){
		var $this = $(this);

		$this.on('click', function(e){
			e.preventDefault();

			var name = $this.attr('data-name');
			var url = $this.attr('href');

			$this.data('name', name);

			// Make you don't constantly reload if clicking a link you're already on.
			if (e.target != window.location.href) {
				updateContainers(name, url);
			}
		});

		if (!isTouchDevice){
			$this.on('mouseenter', function(){
				navHover('0px', '100%');
			}).on('mouseleave touchstart touchend', function(){
				navHover('4px', '10%')
			});
		}
	});

	WINDOW.on('popstate', function(){
		var $this = $(this);
		var url = window.location.href;
		var name = $this.data('name');

		if ( url.match(urlReg) != 'tyronekinda.works') {
			updateContainers(url.match(urlReg), url);
		} else {
			updateContainers('home', url);
		}
	});

	// Custom Cursor 
	// because reasons
	// if ( !isTouchDevice() ) {
	// 	HTML.addClass('custom-cursor');
	// 	WINDOW.on('mousemove', function(e) {
	// 		$cursor.removeClass('hidden');
	// 		$cursor.css({
	// 			'transform': 'translate(' + e.pageX + 'px, ' + e.pageY + 'px)'
	// 		});
	// 	}).on('mouseleave', function(e){
	// 		$cursor.addClass('hidden');
	// 	}).on('mouseenter', function(e){
	// 		$cursor.removeClass('hidden');
	// 	});
	// } else {
	// 	HTML.removeClass('custom-cursor');
	// }

	// Animation
	// Timing
	var oneFrame = 133; // Actually 8 frames at 60FPS, in milliseconds
	anime.easings['frameAnimation'] = function() {
		return 0;
	}

	var navHover = function(bottom, height) {
		anime.remove('.active .link-bar');
		anime({
			targets: '.active .link-bar',
			bottom: bottom,
			height: height,
			duration: 660,
			elasticity: 300
		});
	}

	var breathAnimation = anime({
		targets: '.breath-animation svg',
		viewBox: [ 
			{ value: '0 0 52 35', duration: (oneFrame * 5) }, 
			{ value: '0 0 52 35', duration: oneFrame }, 
			{ value: '52 0 52 35', duration: oneFrame }, 
			{ value: '104 0 52 35', duration: oneFrame }, 
			{ value: '156 0 52 35', duration: oneFrame }, 
			{ value: '156 0 52 35', duration: (oneFrame * 5) }, 
		],
		duration: ((oneFrame * 4) + (oneFrame * 5) + (oneFrame * 5)),
		easing: 'frameAnimation',
		direction: 'alternate',
		loop: 6,
		complete: function(){
			if (BODY.hasClass('ready')){
				breathAnimation.restart();
			} else {
				$breathAnimationContainer.addClass('hidden');
				$wakeupAnimationContainer.removeClass('hidden');
				wakeupAnimation.play();
			}
		}
	});

	var wakeupAnimation = anime({
		targets: '.wakeup-animation svg',
		viewBox: [ 
			{ value: '0 0 52 37', duration: (oneFrame * 5) }, 
			{ value: '0 0 52 37', duration: oneFrame }, 
			{ value: '52 0 52 37', duration: oneFrame }, 
			{ value: '104 0 52 37', duration: oneFrame }, 
			{ value: '156 0 52 37', duration: oneFrame }, 
			{ value: '208 0 52 37', duration: oneFrame }, 
			{ value: '260 0 52 37', duration: oneFrame }, 
			{ value: '312 0 52 37', duration: oneFrame }, 
			{ value: '312 0 52 37', duration: (oneFrame * 5) }, 
		],
		duration: ((oneFrame * 7) + (oneFrame * 5) + (oneFrame * 5)),
		easing: 'frameAnimation',
		direction: 'alternate',
		autoplay: false,
		complete: function(){
			$breathAnimationContainer.removeClass('hidden');
			$wakeupAnimationContainer.addClass('hidden');
			BODY.addClass('ready');
			breathAnimation.restart();
		}
	});
});