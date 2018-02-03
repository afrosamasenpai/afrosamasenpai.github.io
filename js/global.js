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
	
	var updateContainers = function(page){
		console.log('Update?');

		BODY.removeClass().addClass('ready');
		$container.removeClass().addClass('container ' + page);

		// Keep the nav in the DOM because it borks and reloads. 
		// There's also a way to have it work with it, but simple class change works.
		$nav.find('.' + page).addClass('hidden').removeClass('active');
		$nav.find('.' + page).siblings().removeClass('hidden').addClass('active');

	};

	// Device check for cursor
	var isTouchDevice = function() {
		return 'ontouchstart' in window // works on most browsers 
		|| navigator.maxTouchPoints; // works on IE10/11 and Surface
	};

	console.log(isTouchDevice());

	$navLink.on('click', function(e){
		e.preventDefault();

		var $this = $(this);
		var name = $this.attr('data-name');
		var url = $this.attr('href');

		$this.data('name', name);

		// Make you don't constantly reload if clicking a like you're already on.
		if (e.target != window.location.href) {

			BODY.removeClass('screen-on').addClass('screen-off');

			history.pushState({}, '', url);
			$content.load(url + ' .content-container > *');

			updateContainers(name);

			BODY.removeClass('screen-off').addClass('screen-on');
		}
	});

	var current = 2;

	WINDOW.on('popstate', function(e){
		var $this = $(this);
		var url = window.location.href;
		var name = $this.data('name');

		BODY.removeClass('screen-on').addClass('screen-off');
		
		$content.load(url + ' .content-container > *');

		if ( url.match(urlReg) != 'tyronekinda.works') {
			updateContainers(url.match(urlReg));
		} else {
			updateContainers('home');
		}

		BODY.removeClass('screen-off').addClass('screen-on');
	});

	// Custom Cursor 
	// because reasons
	if ( !isTouchDevice() ) {
		HTML.addClass('custom-cursor');

		WINDOW.on('mousemove', function(e) {
			$cursor.removeClass('hidden');
			$cursor.css({
				'transform': 'translate(' + e.pageX + 'px, ' + e.pageY + 'px)'
			});
		}).on('mouseleave', function(e){
			$cursor.addClass('hidden');
		}).on('mouseenter', function(e){
			$cursor.removeClass('hidden');
		});
	} else {
		HTML.removeClass('custom-cursor');
	}

	// Animation
	// Maybe replace with the fatpixel thing since it does have onComplete stuff
	// Timing
	CustomEase.create('frameAnimation', 'M0,0 C0.107,0 1,0 1,0 1,0 1,0.842 1,1'); // Literally zero transition
	var oneFrame = 0.133; // Actually 8 frames at 60FPS

	// Animation Timelines
	// Breath Animation
	var animationBreath = new TimelineMax({ repeat: 3, yoyo: true, onComplete: 
		(function(){
			$breathAnimationContainer.addClass('hidden');
			$wakeupAnimationContainer.removeClass('hidden');
			animationWakeup.play();
		})
	});
	var animationWakeup = new TimelineMax({ paused: true, repeat: 1, yoyo: true, onComplete: 
		(function(){
			BODY.addClass('ready');
			$breathAnimationContainer.removeClass('hidden');
			$wakeupAnimationContainer.addClass('hidden');
			animationBreath.play(0);
			// animationBreath.updateTo({ paused: true, repeat: -1, yoyo: true});
		})
	 });

	animationBreath
		.to($breathAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'0 0 52 35'}, ease: 'frameAnimation'})
		.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'0 0 52 35'}, ease: 'frameAnimation'})
		.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'52 0 52 35'}, ease: 'frameAnimation'})
		.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'104 0 52 35'}, ease: 'frameAnimation'})
		.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'156 0 52 35'}, ease: 'frameAnimation' })
		.to($breathAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'156 0 52 35'}, ease: 'frameAnimation' });

	animationWakeup
		.to($wakeupAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'0 0 52 37'}, ease: 'frameAnimation'})
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'0 0 52 37'}, ease: 'frameAnimation'})
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'52 0 52 37'}, ease: 'frameAnimation'})
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'104 0 52 37'}, ease: 'frameAnimation'})
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'156 0 52 37'}, ease: 'frameAnimation' })
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'208 0 52 37'}, ease: 'frameAnimation' })
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'260 0 52 37'}, ease: 'frameAnimation' })
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'312 0 52 37'}, ease: 'frameAnimation' })
		.to($wakeupAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'312 0 52 37'}, ease: 'frameAnimation' });

});