jQuery(function($) {
	'use strict';

	console.log('Initilize?');

	// DOM
	var WINDOW = $(window);
	var BODY = $('body');
	var $breathAnimationContainer = $('.breath_animation');
	var $wakeupAnimationContainer = $('.wakeup_animation');
	var $breathAnimationSVG = $breathAnimationContainer.find('svg');
	var $wakeupAnimationSVG = $wakeupAnimationContainer.find('svg');

	// History API stuff
	var $nav = $('nav ul li a');

	$nav.on('click', function(e){
		if (e.tagret != e.currentTarget){
			e.preventDefault();

			var data = $(this).attr('data-name');
			var url = $(this).attr('href');

			history.pushState(data, null, url);
			// updateText(data);
			// requestContent(url);
			document.title = "Butts | " + data;

		}
		e.stopPropagation();
	});

	WINDOW.on('popstate', function(e){
		var character = e.state;

		if (character == null) {
			console.log('I borked!');
			// removeCurrentClass();
			// textWrapper.innerHTML = " ";
			// content.innerHTML = " ";
			// document.title = defaultTitle;
		} else {
			console.log('I worked?');
			// updateText(character);
			// requestContent(character + ".php");
			// addCurrentClass(character);
			// document.title = "Ghostbuster | " + character;
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
		.to($breathAnimationSVG, (oneFrame * 5), {yoyo: true, attr:{ viewBox:'0 0 52 35'}, ease: 'frameAnimation'})
		.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'0 0 52 35'}, ease: 'frameAnimation'})
		.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'52 0 52 35'}, ease: 'frameAnimation'})
		.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'104 0 52 35'}, ease: 'frameAnimation'})
		.to($breathAnimationSVG, oneFrame, {attr:{ viewBox:'156 0 52 35'}, ease: 'frameAnimation' })
		.to($breathAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'156 0 52 35'}, ease: 'frameAnimation' });

	animationWakeup
		.to($wakeupAnimationSVG, (oneFrame * 5), {yoyo: true, attr:{ viewBox:'0 0 52 37'}, ease: 'frameAnimation'})
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'0 0 52 37'}, ease: 'frameAnimation'})
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'52 0 52 37'}, ease: 'frameAnimation'})
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'104 0 52 37'}, ease: 'frameAnimation'})
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'156 0 52 37'}, ease: 'frameAnimation' })
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'208 0 52 37'}, ease: 'frameAnimation' })
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'260 0 52 37'}, ease: 'frameAnimation' })
		.to($wakeupAnimationSVG, oneFrame, {attr:{ viewBox:'312 0 52 37'}, ease: 'frameAnimation' })
		.to($wakeupAnimationSVG, (oneFrame * 5), {attr:{ viewBox:'312 0 52 37'}, ease: 'frameAnimation' });

});