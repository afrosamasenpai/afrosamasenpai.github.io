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
		console.log('Update?');

		// Begin screen off CRT transition
		BODY.removeClass().addClass('ready screen-off');
		// Update container class
		$container.removeClass().addClass('container ' + page);

		// Change content on a delay, just to get rid of the weird occasional pop in
		setTimeout(function(){
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
	$navLink.on('click', function(e){
		e.preventDefault();

		var $this = $(this);
		var name = $this.attr('data-name');
		var url = $this.attr('href');

		$this.data('name', name);

		// Make you don't constantly reload if clicking a like you're already on.
		if (e.target != window.location.href) {
			updateContainers(name, url);
		}
	});

	var current = 2;

	WINDOW.on('popstate', function(e){
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
	// Draw your art at any scale. The animation is for free.
	var donkeyKong = new FatPixels({
		scale  : 2.4,
		speed  : '60fps',
		sprite : {
			url : 'images/breathe/bedandbreathanimation.png',
			direction: 'x',
			count : 8,
		}
	});
	donkeyKong.drawWithTarget(document.getElementById('animation-container'));

	// $('.animation-container').FatPixels({
	// 	scale  : 2.4,
	// 	speed: '16fps'
	// 	sprite : {
	// 		url : 'images/breathe/bedandbreathanimation.png',
	// 		direction: 'x',
	// 		count : 8,
	// 	}
	// });

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

	// animationBreath
	// 	.to($breathAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'0 0 52 35'}, ease: 'frameAnimation'})
	// 	.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'0 0 52 35'}, ease: 'frameAnimation'})
	// 	.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'52 0 52 35'}, ease: 'frameAnimation'})
	// 	.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'104 0 52 35'}, ease: 'frameAnimation'})
	// 	.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'156 0 52 35'}, ease: 'frameAnimation' })
	// 	.to($breathAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'156 0 52 35'}, ease: 'frameAnimation' });

	// animationWakeup
	// 	.to($wakeupAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'0 0 52 37'}, ease: 'frameAnimation'})
	// 	.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'0 0 52 37'}, ease: 'frameAnimation'})
	// 	.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'52 0 52 37'}, ease: 'frameAnimation'})
	// 	.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'104 0 52 37'}, ease: 'frameAnimation'})
	// 	.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'156 0 52 37'}, ease: 'frameAnimation' })
	// 	.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'208 0 52 37'}, ease: 'frameAnimation' })
	// 	.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'260 0 52 37'}, ease: 'frameAnimation' })
	// 	.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'312 0 52 37'}, ease: 'frameAnimation' })
	// 	.to($wakeupAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'312 0 52 37'}, ease: 'frameAnimation' });

});