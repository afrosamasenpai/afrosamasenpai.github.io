jQuery(function($) {
	'use strict';

	console.log('Initilize?');

	// DOM
	var WINDOW = $(window);
	var BODY = $('body');
	var $container = $('.container');
	var $breathAnimationContainer = $('.breath-animation');
	var $wakeupAnimationContainer = $('.wakeup-animation');
	var $breathAnimationSVG = $breathAnimationContainer.find('svg');
	var $wakeupAnimationSVG = $wakeupAnimationContainer.find('svg');
	var $wantMore = $('.want-more');
	// URL check
	var urlReg = /[^\/]+(?=\/$|$)/ig;

	// console.log(location);
	// console.log(urlReg);
	// console.log(location.match(urlReg));

	// History API stuff
	var $navLi = $('nav ul li');
	var $nav = $('header nav ul li a');
	var $content = $('.content-container');
	
	var init = function(page){
		console.log('Update?');

		BODY.removeClass().addClass('ready');
		$container.removeClass().addClass('container ' + page);

	};

	$nav.on('click', function(e){
		e.preventDefault();

		var $this = $(this);
		var name = $this.attr('data-name');
		var url = $this.attr('href');

		$this.data("name", name);

		if (e.target != window.location.href){

			history.pushState({}, '', url);
			$content.load(url + ' .content-container > *');
			$navLi.load(url + ' nav ul li a');

			init(name);
		}
		e.stopPropagation();
	});

	WINDOW.on('popstate', function(e){
		var $this = $(this);
		var url = window.location.href;
		var name = $this.data("name");

		$content.load(url + ' .content-container > *');
		$navLi.load(url + ' ' + ' nav ul li a');

		if ( url.match(urlReg) != 'tyronekinda.works') {
			init(url.match(urlReg));
		} else {
			init('home');
		}

	});

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