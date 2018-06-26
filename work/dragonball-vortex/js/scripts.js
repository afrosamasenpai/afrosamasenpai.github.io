jQuery(function($) {
	"use strict";

	var debug = window.location.search.indexOf('debug=true') !== -1 ? true : false;

	// Outside of a function so it doesn't actually have to be called everytime it needs to be used. It's just there.
	var $window = $(window), 
	$body = $("body"),
	mobile = $window.width() <= 737;

	if (debug) console.log("Current width is " + $window.width() + " px.");

	$(".disabled").on("click", function(e){
		e.preventDefault();
	});

	enquire.register("screen and (min-width: 738px)", {

		// Mobile
		setup: function() {
			$body.addClass("mobile").removeClass("desktop");

			if (debug) console.log("Mobile? Yes.");
		},
		// Desktop
	    match : function() {
			$body.addClass("desktop").removeClass("mobile");

			if (debug) console.log("Mobile? Nope.");
	    }

	});
	// END: Mobile check

	// BEGIN: Logo animation
	function logoAnimation(){
		var $logo = $("#logo a"),
		$logoParts = $logo.find("svg g > *"),
		tl = new TimelineMax({paused: true, force3D: false}),
		$logoAnimation = 
		tl
		.staggerFrom($logoParts, 0.2, {scale: "0.65", opacity: "0", ease: Back.easeOut, transformOrigin:"center center"}, 0.05);

		$logoAnimation.progress(1);

		$logo.on("mouseenter", function(e){
			e.preventDefault();
			$logoAnimation.restart();
		}).on("mouseleave", function(e){
			$logoAnimation.progress(1);
		});
	}
	// END: Logo animation

	// BEGIN: Dropdown
	function dropdownSetup() {
		// DOM elements
		var $dropdownTrigger = $(".dropdown-trigger"),
			$headerDropdownTrigger = $(".dropdown-trigger.notification-icon"),
			$dropdownContainer = $dropdownTrigger.next(".dropdown-container"),
			$notificationClose = $(".notification-list").find(".notification-close").find("a");

		// Set up for dropdown animations
		// Having the animation in an each statement helps keep all of the things openning at once. That's bad, m'kay.
		// Also prevents and infinite loop that's also bad.
		$dropdownTrigger.each(function(e){
			var $this = $(this),
			$dropdownContainer = $this.next(".dropdown-container"),
			dropdownAnimation = new TimelineMax({paused: true, force3D: false});
			
			dropdownAnimation.fromTo($dropdownContainer, 0.25, {y:"10px", autoAlpha: 0}, {y:"0", autoAlpha: 1, className: "+=active", ease: Power1.easeOut, onComplete: (function(){ $dropdownContainer.addClass("open"); }) })
			;

			// Add the dropdownAnimation into data so it can be used for the event triggers below
			// Thank you Aric.
			$this.data("dropdownAnimation", dropdownAnimation);
		});

		// Change the event to a click for mobile because clicks are nice.
		// Keep the different states in their own enquire.register
		// May not do what you want since things had to be super similar
		// Desktop
		enquire.register("screen and (min-width: 738px)", {

			deferSetup : true,
			setup : function() {
				$dropdownTrigger.off();
			},

		    match : function() {

		    	if (debug) console.log("Using desktop dropdowns.");

				$dropdownTrigger.off("click", function(e){
				}).on("mouseenter", function(e){
					// Initial triggering active state
					var $this = $(this),
					dropdownAnimation = $this.data("dropdownAnimation");

					e.preventDefault();
					if(typeof dropdownAnimation !== 'undefined') {
						$this.addClass("hover");
						dropdownAnimation.play();
					}

				}).on("click", function(e){

					e.preventDefault();

				}).closest("div").on("mouseleave", function(e){
					// Once leaving the parent div container, no more active state
					var $this = $(this),
					dropdownAnimation = $this.find($dropdownTrigger).data("dropdownAnimation");

					if(typeof dropdownAnimation !== 'undefined') {
						$this.find($dropdownTrigger).removeClass("hover");
						dropdownAnimation.reverse();
					}
				});	

		    },

		    unmatch : function() {
		    	// Kill the things above
		    	// Keep this commented out for now. It kills it twice and doesn't come back with this.
		    	// Should just be killed once above. But can be clicked if scaled up from mobile.
		    	$dropdownTrigger.off();
		    	// Will come back to later. WCBTL
		    }

		});

		// Mobile
		enquire.register("screen and (max-width: 737px)", {

			deferSetup : true,
			setup : function() {
				$dropdownTrigger.off();
			},

		    match : function() {

		    	if (debug) console.log("Using mobile dropdowns.");
		    	// if (debug) console.log("Should the mobile dropdown trigger?");

				$dropdownTrigger.on("click", function(e){	

					if (debug) console.log("Mobile stuff should click.");

					// Initial triggering active state
					var $this = $(this),
					$html = $("html"),
					dropdownAnimation = $this.data("dropdownAnimation");

					e.preventDefault();

					// Is the dropdown open? 
					if(typeof dropdownAnimation !== 'undefined') {
						if ($dropdownContainer.hasClass("open")){
							dropdownAnimation.reverse();
						} else {
							dropdownAnimation.play();
						}
					}

					if ($this = $headerDropdownTrigger){
						// Notification taking up the screen shouldn't let you scroll the page behind it.
						$html.addClass("stationary");
					}

					// Close button for the notifications on mobile.
					// They're located here so they can piggy back off of the generic dropdown animation
					$notificationClose.on("click", function(e){
						e.preventDefault();

						dropdownAnimation.reverse();

						$html.removeClass("stationary");
					});

				}).off("mouseenter mouseleave", function(e){
					e.preventDefault();

					if (debug) console.log("I shouldn't trigger anything.");

				}).closest("div").off("mouseleave");

		    },

		    // unmatch : function() {
		    // 	$dropdownTrigger.off();
		    // }

		});


	}
	// END: Dropdown

	// BEGIN: Header animation
	function headerAnimation(){
		// Body variables
		var $window = $("window"), 
		$body = $("body"), 
		$home = $body.hasClass("section-index"),
		// Header variables
		$header = $("#header"),
		$currentlyViewing = $(".currently-viewing"),
		$nav = $header.find(".header-nav"),
		// Extra variables
		$headerTrigger = $("#header-trigger"),
		offset = $header.offset(),
		$headerHeight = offset.top + ($header.outerHeight() * 10),
		windowTop = $(window).scrollTop(),
		// Animation timelines 
		tl = new TimelineMax({force3D: false}),
		// Header animation on scroll
		headerAnimation = 
		tl
		.to($header, 0.35, {top: "-" + $header.outerHeight(), ease: Circ.easeOut})
		.to($currentlyViewing, 0.35, {top: "0", ease: Circ.easeOut}, "0")
		;

		if (debug) console.log("Header is " + $header.outerHeight() + "px. Fixed header should trigger at " + $headerHeight + "px.");
		
		$headerTrigger.css( "top", $headerHeight);
		headerAnimation.progress(0);

		// Header scroll animation
		// init controller
		var controller = new ScrollMagic.Controller();

		// build scene
		var scene = new ScrollMagic.Scene({
							triggerElement: $headerTrigger
						})
						.setTween(headerAnimation) // Start the tween for the header
						.addTo(controller)
						.setClassToggle("#header", "fixed");
						// Debug stuff.
						// .on("change update progress start end enter leave", function(e){
						// 	if (debug) console.log((e.type == "enter" ? "inside" : "outside"));
						// 	if (debug) console.log((e.type == "start" ? "top" : "bottom"));
						// 	if (debug) console.log(e.target.controller().info("scrollDirection"));
						// });
						
		if (debug) scene.addIndicators({name: "header animation"}); // Add indicators. Got to see where it starts
	}
	// END: Header animation

	// BEGIN: Mobile Search Button
	function mobileSearchButton(){
		CSSPlugin.defaultTransformPerspective = 1000;

		var $window = $(window), 
		$header = $("#header"),
		$search = $header.find(".search-container"),
		$searchMobile = $header.find(".mobile-search button"),
		// Search container animation
		// Animation timelines 
		tl = new TimelineMax({force3D: false, paused: true}),
		searchAnimation =
		tl
		.to($search, 0.35, {rotationX: "0", transformOrigin: "top center", ease: Circ.easeOut, onComplete: (function(){ $search.addClass("open");}) })

		// Search
		if ($header.hasClass("fixed")){

			$window.on("scroll", function(){
				searchAnimation.reverse();
				$search.removeClass("open");
			});

			if (debug) console.log("Header is fixed, go back inside search.");
		}

		$searchMobile.on("click", function(e){
			e.preventDefault();

			if ($search.hasClass("open")){
				searchAnimation.reverse();
				$search.removeClass("open");
			} else {
				searchAnimation.play();
			}
		});

	}
	// END: Mobile Search Button

	// BEGIN: Side Menu
	function sideMenuPin(){

		// Initial set up
		var $window = $(window),
			$side = $(".contextual-side:not(.mobile) > ul"),
			$sideTop = $side.offset().top,
			$contentContainer = $(".content-container"),
			$boardTop = $contentContainer.offset().top,
			// $boardHeight = ($contentContainer.outerHeight() - ($boardTop * 2.8));
			$boardHeight = ($("html").outerHeight() - ($("#footer").outerHeight() * 5));

			if (debug) console.log("The side header should stick at " + ($boardTop * 2.5) + " and release at " + $boardHeight + "px.");

			// init controller
			var side_controller = new ScrollMagic.Controller();

			// build scene
			var sidePin = new ScrollMagic.Scene({triggerElement: $side, duration: $boardHeight, offset: ($sideTop - ($sideTop * 1.25))} );

			if (debug) sidePin.addIndicators({name: "side menu pin"}); // Add indicators. Got to see where it starts and ends
		
		if ($("html").outerHeight() > 1350) {

			enquire.register("screen and (min-width: 738px)", {

				// Desktop
			    match : function() {

			    	if (debug) console.log("Pin the sidebar!");

					sidePin
					.setPin($side)
					.addTo(side_controller)
					.triggerHook(0)
					.enabled(true);
					
			    },

			    // Mobile
			    unmatch : function() {
			    	if (debug) console.log("Don't pin the sidebar!");

			    	$(".scrollmagic-pin-spacer").removeAttr("style");
			    	$side.removeAttr("style");

					sidePin
					.enabled(false);

			    }

	    		

			});

		}

	}
	// END: Side Menu 

	// BEGIN: Context Menu
	function contextMenu(){
		// DOM elements
		var $contextMenuButton = $(".contextual-menu-button").find("a"),
			$contextMenu = $("#mobile-context-menu"),
			$contextMenuClose = $("#mobile-context-menu").find(".quick-menu-close").find("a");

		// Set up for dropdown animations
		// Having the animation in an each statement helps keep all of the things openning at once. That's bad, m'kay.
		// Also prevents and infinite loop that's also bad.
		$contextMenuButton.each(function(e){
			var $this = $(this),
			$contextMenu = $("#mobile-context-menu"),
			contextMenu = new TimelineMax({paused: true, force3D: false});
			
			contextMenu.fromTo($contextMenu, 0.25, {top:"10px", autoAlpha: 0}, {top:"0", autoAlpha: 1, className: "+=active", ease: Power1.easeOut, onComplete: (function(){ $contextMenu.addClass("open"); }) })
			;

			// Add the dcontextMenu into data so it can be used for the event triggers below
			// Thank you Aric.
			$this.data("contextMenu", contextMenu);
		});

		$contextMenuButton.on("click", function(e){
			if (debug) console.log("Opened quick menu.");

			// Initial triggering active state
			var $this = $(this),
			$html = $("html"),
			contextMenu = $this.data("contextMenu");

			e.preventDefault();

			// Is the dropdown open? 
			if(typeof contextMenu !== 'undefined') {
				if ($contextMenu.hasClass("open")){
					contextMenu.reverse();
				} else {
					contextMenu.play();
					$html.addClass("stationary");
				}
			}

			// Close button for the notifications on mobile.
			// They're located here so they can piggy back off of the generic dropdown animation
			$contextMenuClose.on("click", function(e){
				e.preventDefault();

				contextMenu.reverse();

				$html.removeClass("stationary");
				if (debug) console.log("Closed quick menu.");
			});
		});
					
	}
	// END: Context Menu

	// BEGIN: Mark Read icon removal
	function markAllRead(){
		var $markRead = $("a.mark-notifications-read"),
		$notificationIcon = $(".notification-icon.has-notification"),
		$notificationList = $(".notification-list");

		$markRead.on("click", function(e){
			e.preventDefault();
			$notificationIcon.removeClass("has-notification");
			$notificationList.find("li.new").removeClass("new");
		});
	}
	// END: Mark Read icon removal

	// BEGIN: On load animations
	function loadAnimations(){
		
	}
	// END: On load animations

	// BEGIN: Quote Machine
	function quoteMachine(){
		// When adding a quote with double quotation marks, preceed them with a \
		// Quotes go here
		var quote = [
		"Pachinko is ded. Rot in rip Pachinko.", 
		"Anyone porn before 2002?", 
		"You blew my mind Tails. I didn't even give you consent.", 
		"Widen you legs for Jesus!",
		"Nah, I'm a classy PL Whore. I do it in the comfort of my own home...or in a three-star or higher motel.",
		"Das some mighty booty.",
		"I can feel you breathing.",
		"I sometimes can't even sit on the motorcycle seat without burning my ass lmao.",
		"That's enough water for one day. *throws in pile of dead bodies*",
		"You shut up, I still havent had any chapters and my symptoms are going CRAZY!",
		"Damn you adult responsibilities.",
		"Blame Luka for my death.",
		"I want that in and around my mouth.",
		"Chilly. It's almost 72 degrees!",
		"If I find any inline styleing on these PHP pages-I'm going to hunt you down...",
		"3 is my limit, then it's Mr. Snippy.",
		"Didn't Que sentence you to endless days in the Hyperbolic Time Chamber?",
		"YOU NEED TO CHILL!",
		"I have a diarrhea today.",
		"My brother played 24 hours of that for a video to be made as a bet between him and a friend. He never recovered.",
		"Here is a quote for the thing.",
		"It's 7pm, time for bed.",
		"Ass magic is best magic.",
		"I find myself shoving inflatable dicks into my anus.",
		"Law of the jungle, baby!",
		"I got the booty.",
		"You begin the night with \"having sex\" and it ends with \"camping\".",
		"I HATE THE FUTURE! ITS FULL OF MYSTERY! I HATE MYSTERIES! I HAD TO BUY SO MANY SCOOBY SNACKS",
		"I'm going to hunt you down and gut you like a fish if you don't come back Kris. I'm serious, plane tickets and Bowie knives are cheap these days.",
		"I don't know. I'm just sitting here, naked and bored.",
		"She's cute and fun, but no my kind of girlfriend. I love her...but like a sister - who has rockin' tits.",
		"I haven't sprited in 2 years either soooo I'm pretty certain I suck ass. Speaking of sucking ass, not a jolly experience to try.",
		"Aye you got me, tis I, Angryboy all along *sips on tea* Seto has just been a fake account this whole time. I mean, Australians can't sprite...they're prisoners for crying out loua HA HA HA *bites crumpet*",
		"Understandably, getting your face erased to see if asteroids taste like fruit is a rather weird proposition.",
		"Because I'm managing an RP, playing BT3, and MASTURBATING! I CANNOT MULTITASK BEYOND THAT!",
		"Wow, you just going to hoe me out like that?",
		"You sound like Scooby-Doo. Uh-oh, Raggy.",
		"Gotta straddle that horse like a bacon sunday morning.",
		"Make people sing with a dick in the ass",
		"No such thing in surprise DICKINYOURASS",
		"Fuck the assholes that upload raw versions and fuck their raw assholes",
		"Good god man stop stealing my bit, it's all I've got!",
		"They dun call you mr doughnut for nothing.",
		"Wow. I see how it is. What, were just calling people nerds now?",
		"I'm tired right now, don't judge my words.",
		"You act like my paper white ass owns timbs.",
		"Hug the abs.",
		"German rap is like summoning a demon.",
		"It's friday so he might be wanking his xenoverse with razzlin.",
		"Everytime I poop i get sad.",
		"Please kill me if I ever mature as a person.",
		"Yo, I got 99 bacon slices and Afro ate all of them.",
		"Though we all know what happens at the end now thanks to POOR PLANNING BY BRIAN FUCKFACE MICHAEL DOUCHEBAG BENDIS",
		"Quote machine of quoting the quoted quotes of the quote machine's quote machine"
		],
		// Authors go here. 
		author = [
		"Shinbs", 
		"Afrosamasenpai", 
		"Luka", 
		"Medium",
		"Lorezno",
		"Onis",
		"Tails",
		"GATH",
		"Que",
		"Rage",
		"Midlight Dragoon",
		"Afrosamasenpai",
		"Afrosamasenpai",
		"Luka",
		"theredheadhenry",
		"KnightGrave",
		"EnteiTheHedgehog",
		"RighteousAJ",
		"Medium",
		"OshikaruSensei",
		"theredheadhenry",
		"theredheadhenry",
		"Midlight Dragoon",
		"Dr. Blastrider",
		"RighteousAJ",
		"RighteousAJ Got Da Booty",
		"Blues Light",
		"Dr. Simetra",
		"Nexus",
		"ReiNekura",
		"Johnny",
		"Blade",
		"Blues Light",
		"Afrosamasenpai",
		"Lorezno",
		"KazzyKun",
		"AnaseSkyrider",
		"KazzyKun",
		"Rage",
		"Rage",
		"Rage",
		"Nexus",
		"LanceMaster",
		"UnboundBeatz",
		"Dr. Blastrider",
		"Yahn",
		"ReiNekura",
		"Medium",
		"LanceMaster",
		"theredheadhenry",
		"Dr. Simetra",
		"Tails",
		"Luka",
		"SuperFantasticoBananos"
		],
		$quoteMachine = $("#quote-machine"),
		$quoteContent = $quoteMachine.find(".qm_quote"),
		$quoteAuthor = $quoteMachine.find(".qm_author"),
		whichQuote = Math.round( Math.random() * ( quote.length - 1 ));

		// Clear of the placeholder so there isn't just empty space on load
		$quoteMachine.find("span").html("");

		// Send selected quote to DOM
		$quoteContent.append(quote[whichQuote]);
		$quoteAuthor.append( "&mdash; <em>" + author[whichQuote] + "</em>");

		TweenMax.from($quoteMachine.find("span"), 0.65, {opacity: 0});

		if (debug) console.log("Quote #" + whichQuote + " was chosen. Which is “" + quote[whichQuote] + "” by " + author[whichQuote] + ".");

	}
	// END: Quote Machine

	// BEGIN: Keyboard shortcuts?
	// END: Keyboard shortcuts?

	// Initialize all the things!
	$(document)
	.ready(function() {if (debug) console.log( "Document loaded!" ); })
	.ready(quoteMachine);
	
	$(window)
	.ready(dropdownSetup)
	.ready(markAllRead)
	.ready(logoAnimation)
	.ready(headerAnimation)
	.ready(mobileSearchButton)
	.ready(sideMenuPin)
	.ready(contextMenu)
	.ready(function() {if (debug) console.log( "Window loaded!" ); });

	// Maybe dump them all of the resize functions in here so things don't explode?
	// var dS, mSB, sMP; 

	// $(window).on("resize", function() {
	//     // clearTimeout(dS);
	//     // clearTimeout(mSB);
	//     clearTimeout(sMP);

	//     // dS = setTimeout(dropdownSetup, 500);
	//     // mSB = setTimeout(mobileSearchButton, 500);
	//     // sMP = setTimeout(sideMenuPin, 500);

	//     if (debug) console.log("Things should be reset on resize.");
	// });

	$(document).ready(function() {
		$(".js-example-basic-single").select2({
			minimumResultsForSearch: Infinity,
		});
	});

	// Post Options Button
	// Fill probably put into a function later.
	var $postOptionsButtonTrigger = $(".mobile-post-options-trigger").find("a");

	$postOptionsButtonTrigger.each(function(){

		var $this = $(this), 
		$postButtons = $(this).closest(".post-options-container").find(".post-options"),
		tl = new TimelineMax({paused: true, force3D: false}),
		postOptionAnimation = tl
		.to($postButtons, 0.2 , {display: "block", opacity: 1, onComplete: (function(){ $postOptionsButtonTrigger.addClass("open"); }) });

		$this.data("postOptionAnimation", postOptionAnimation);
	});

	$postOptionsButtonTrigger.on("click", function(e){
		var $this = $(this),
		postOptionAnimation = $this.data("postOptionAnimation");

		e.preventDefault();

		// Is the dropdown open? 
		if(typeof postOptionAnimation !== 'undefined') {
			if ($postOptionsButtonTrigger.hasClass("open")){
				postOptionAnimation.reverse();
				$(this).removeClass("open");
			} else {
				postOptionAnimation.play();
			}
		}
	});

	// Mobile textarea
	// Fill probably put into a function later.
	var $quickReply = $("#quick-reply-message-box"),
	$isMobile = $("body").hasClass("mobile"),
	$mobileNav = $(".mobile-navigation"),
	$currentViewing = $(".currently-viewing"),
	tl = new TimelineMax({paused: true, force3D: false}),
	hideNav = tl.to($mobileNav, 0.4 , {bottom: "-48px" }).to($currentViewing, 0.4 , {top: "-46px" }, 0);

	enquire.register("screen and (min-width: 738px)", {

		// Mobile
		setup: function() {
			$quickReply.delegate( "*", "focus blur", function() {
				var $this = $( this );
				if (debug) console.log("Testing textarea focus stuff.");
				
				setTimeout(function() {
					$this.toggleClass( "focused", $quickReply.is( ":focus" ) );

					hideNav.play();
				}, 0 );
			});
			
		},
		// Desktop
	    match : function() {
			$quickReply.undelegate( "*", "focus blur", function() {
				return;
			});
	    }

	});



 
});