const init = () => {
    'use strict'
    // Variables
    let container = select('.container')[0]
    let content = select('.content', container)[0]
    let navItem = select('.nav__item')
    let breathContainer = select('.bg-container__breath')[0]
    let wakeContainer = select('.bg-container__wake')[0]
    let oneFrame = 133; // Actually 8 frames at 60FPS, in milliseconds
    anime.easings['frameAnimation'] = () => 0

    // Store the initial content so we can revisit it later
    history.replaceState(null, null, document.location.href);

    navItem.forEach( el => {
        let navLink = select('a', el)[0]

        if ( !isTouchDevice() ){
            // Hover animation
            el.addEventListener('mouseenter', e => navHover('0px', '100%') )
            
            el.addEventListener('mouseleave', e => navHover() )
        }

        // History
        navLink.addEventListener('click', e => {
            e.preventDefault()

            let name = navLink.getAttribute('data-name')
            let url = navLink.getAttribute('href') 

            history.pushState(null, null, url)

            // Make sure you don't constantly reload if clicking a link you're already on.
            if (e.target != window.location.href) {
                updateContainers(name, url);
            }
        })
        
    })

    const breathAnimation = anime({
            targets: '.bg-container__breath svg',
            viewBox: [ 
                { value: '0 0 52 35', duration: (oneFrame * 5) }, 
                { value: '0 0 52 35', duration: oneFrame },
                { value: '52 0 52 35', duration: oneFrame }, 
                { value: '104 0 52 35', duration: oneFrame }, 
                { value: '156 0 52 35', duration: oneFrame }, 
                { value: '156 0 52 35', duration: (oneFrame * 5) }, 
            ],
            duration: oneFrame * 14,
            easing: 'frameAnimation',
            direction: 'alternate',
            loop: 6,
            complete: () => {

                if ( container.classList.contains('is-ready') ) {
                    breathAnimation.restart()
                } else {
                    breathContainer.classList.add('is-hidden')
                    wakeContainer.classList.remove('is-hidden')
                    wakeupAnimation.play()
                }
            }
                
        })

    const wakeupAnimation = anime({
         targets: '.bg-container__wake svg',
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
         duration: oneFrame * 17,
         easing: 'frameAnimation',
         direction: 'alternate',
         autoplay: false,
         complete: () => {

            breathContainer.classList.remove('is-hidden')
            wakeContainer.classList.add('is-hidden')
            container.classList.add('is-ready')
            breathAnimation.restart()

         }
     })

    window.addEventListener('popstate', (e) => {
        // console.log(e.state)
        // URL check
        // let urlReg = /[^\/]+(?=\/$|$)/ig
        let urlReg = /[^\/]+(?=\/|$)/ig
        let url = window.location.href
        let subDirectory = url.match(urlReg)[2]

        if ( subDirectory === undefined) {
            updateContainers('home', '/')
        } else {
            updateContainers(subDirectory, url)
        }
    })
}

const select = (selector, parent = document) => (
    [].slice.call(
        parent.querySelectorAll(selector)
    )
)

const navHover = (bottom = '4px', height = '10%') => {
     anime.remove('.is-active .nav__link-bar')
     anime({
         targets: '.is-active .nav__link-bar',
         bottom: bottom,
         height: height,
         duration: 660,
         elasticity: 300
     })
}

// Device check for custom cursor, if uses touch, ignore
const isTouchDevice = () => {
     return 'ontouchstart' in window || navigator.maxTouchPoints // works on IE10/11 and Surface
 }

 const getContent = (element, url) => {
    var request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
           if (request.status === 200) {
               element.innerHTML = request.responseText.match(/.*<section class="content".*>([\s\S]*)<\/section>.*/)[0].replace(/.*<section class="content".*>*/, '').replace(/<\/section>.*/, '')
           }
        }
    };

    request.open('GET', url, true);
    request.send();
}

const updateContainers = (page, url) => {
    // Variables
    let body = select('body')[0]
    let container = select('.container')[0]
    let content = select('.content')[0]
    let nav = select('.nav__item')
    // Begin screen off CRT transition
    body.classList.replace('screen-on', 'screen-off')

    // Change content on a delay, just to get rid of the weird occasional pop in
    setTimeout( () => {
        // Update container class
        container.classList = ''
        container.classList.add('container', 'container-' + page, 'is-ready')

        // Keep the nav in the DOM because it borks and reloads. 
        // There's also a way to have it work with it, but simple class change works.
        nav.forEach( el =>{
            if (el.classList.contains('nav__item--' + page)) {
                el.classList.replace('is-active', 'is-hidden')
            } else {
                el.classList.replace('is-hidden', 'is-active')
            }
        })

        getContent(content, url)

        // Turn on that screen!
        body.classList.replace('screen-off', 'screen-on')
    }, 800);
}

document.addEventListener('DOMContentLoaded', init)