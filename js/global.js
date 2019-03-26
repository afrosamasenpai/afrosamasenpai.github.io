const init = () => {
    'use strict'
    // Variables
    let container = select('.container')
    let content = select('.content', container)
    let navItem = select('.nav__item')
    let breathContainer = select('.bg-container__breath')
    let wakeContainer = select('.bg-container__wake')
    // Animation needs to be a function based value
    // Function inside a function
    let oneFrame = 133
    let frameAnimation = () => (t) => 0;

    // Store the initial content so we can revisit it later
    history.replaceState(null, null, document.location.href);

    navItem.forEach( el => {
        let navLink = select('a', el)
        let navBar = select('.nav__link-bar', navLink)

        if ( !isTouchDevice() ){
            // Hover animation
            navLink.addEventListener('mouseenter', e => navHover(navBar, '110%') )
            
            navLink.addEventListener('mouseleave', e => navHover(navBar) )
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

    window.addEventListener('popstate', e => {
        // URL check
        let urlReg = /[^\/]+(?=\/|$)/ig
        let url = window.location.href
        let subDirectory = url.match(urlReg)[2]

        return (subDirectory === undefined) ? updateContainers('home', '/') : updateContainers(subDirectory, url)
    })

    // Breating Animation
    const breathAnimation = anime({
        targets: select('svg', breathContainer),
        viewBox: [ 
            { value: '0 0 52 37', duration: (oneFrame * 5) }, 
            { value: '0 0 52 37', duration: oneFrame },
            { value: '52 0 52 37', duration: oneFrame }, 
            { value: '104 0 52 37', duration: oneFrame }, 
            { value: '156 0 52 37', duration: oneFrame }, 
            { value: '156 0 52 37', duration: (oneFrame * 5) }, 
        ],
        duration: oneFrame * 14,
        easing: frameAnimation,
        direction: 'alternate',
        loop: 2,
        autoplay: true,
        complete: () => {
            if ( container.classList.contains('is-ready') ) {
                breathAnimation.restart({loop: true})
            } else {
                breathContainer.classList.add('is-hidden')
                wakeContainer.classList.remove('is-hidden')
                wakeupAnimation.play()
            }
        }      
    })

    // Wakeup Animation
    const wakeupAnimation = anime({
         targets: select('svg', wakeContainer),
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
         easing: frameAnimation,
         direction: 'alternate',
         autoplay: false,
         complete: () => {
            breathContainer.classList.remove('is-hidden')
            wakeContainer.classList.add('is-hidden')
            container.classList.add('is-ready')
            breathAnimation.restart()
            textAnimation.play()
         }
     })
}

const select = (selector, parent = document) => {
    // Don't need slice.call or map if using spread. It appends junk itself.
    // However it does not return an active node list. Tragic.
    let foundEl = [...parent.querySelectorAll(selector)]
    return (foundEl.length === 1) ? foundEl[0] : foundEl
}

// Text Animation
// Steps so it feels like an old game's junk fading in
const textAnimation = anime({
    targets: select('.bg-container__text span'),
    opacity: [0, 1],
    easing: 'steps(3)',
    delay: anime.stagger(600),
    autoplay: false
})

// Device check for custom cursor, if uses touch, ignore
const isTouchDevice = () => {
     return 'ontouchstart' in window || navigator.maxTouchPoints // works on IE10/11 and Surface
 }

const navHover = (selector, height = '10%') => {
    anime.remove(selector)
    anime({
        targets: selector,
        bottom: '0',
        height: height,
        duration: 460,
        elasticity: 300
    })
}

// Now returns a promise!
const getContent = (element, url) => {
    let prom = new Promise( (resolve, reject) => {

        // Chuck the request in here and handle to stuff on success
        // Like promises do
        let request = new XMLHttpRequest()
        request.open('GET', url)
        request.onload = () => resolve(request.responseText)
        request.onerror = () => reject(request.statusText)
        request.send()

    }).then( (val) => {

        let newContent = val.match(/.*<article class="content grid-layout".*>([\s\S]*)<\/article>.*/)[0].replace(/.*<article class="content grid-layout".*>*/, '').replace(/<\/article>.*/, '')
        element.innerHTML = newContent;

    }).catch( (reason) => {
        element.innerHTML = reason;
    })
}

const updateContainers = (page, url) => {
    // Variables
    let body = select('body')
    let container = select('.container')
    let content = select('.content')
    let nav = select('.nav__item')

    // Change content on a delay, just to get rid of the weird occasional pop in
    // Update container class
    setTimeout( () => {
        content.innerHTML = '';
        container.classList = ''
        container.classList.add('container', 'container-' + page, 'is-ready', 'grid-layout')

        // Keep the nav in the DOM because it borks and reloads. 
        // There's also a way to have it work with it, but simple class change works.
        nav.forEach( el =>{
            if (el.classList.contains('nav__item--' + page)) {
                el.classList.replace('is-active', 'is-hidden')
                el.setAttribute('aria-hidden', 'true')
            } else {
                el.classList.replace('is-hidden', 'is-active')
                el.setAttribute('aria-hidden', 'false')
            }
        })
        
        textAnimation.seek(textAnimation.duration);
        getContent(content, url)
    }, 200);  
}
 

document.addEventListener('DOMContentLoaded', init)