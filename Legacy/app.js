class Slider {
    constructor(sliderName, params) {
        const slider = document.querySelector(sliderName)

        const left = slider.querySelector('.slider__btn--left')
        const right = slider.querySelector('.slider__btn--right')
    
        const sliderInner = slider.querySelector('.slider__inner')
        const sliderWrapper = slider.querySelector('.slider__wrapper')
        const sliderItems = slider.querySelectorAll('.slider__item')

        sliderItems.forEach(item => {
            item.addEventListener('contextmenu', (Event) => {
                Event.preventDefault()
                Event.stopPropagation()
                return false
            })

            const image = item.querySelector('img')
            
            item.style.backgroundImage = `url(${image.getAttribute('src')})`
            image.style.display = 'none'
        })
        
        let counter = 0
        let marginRight = params['marginRight'] || 25
    
        sliderItems.forEach(item => {
            item.style.marginRight = `${marginRight}px`
        })
    
        function sliderItemsHeight() {
            sliderItems.forEach(item => {
                item.style.height = `${item.offsetWidth * 0.7}px`
            })
        }
        sliderItemsHeight()

        /* Dots */

        let isDotsClickable = params['isDotsClickable'] || false

        const dotsWrapper = document.querySelector('.slider__dots')
        
        let dotMarginRight = params['dotMarginRight'] || 5

        for (let i = 0; i < sliderItems.length; i++) {
            const dotElem = document.createElement('button')
            dotElem.classList.add('slider__dot')
            
            dotElem.style.margin = `0 ${dotMarginRight}px`

            dotsWrapper.insertAdjacentElement('beforeend', dotElem)
        }

        const dots = document.querySelectorAll('.slider__dot')

        const dotsWidth = dots[0].clientWidth
        const dotsWidthWithMargin = dotsWidth + (dotMarginRight * 2)

        dots[0].classList.add('currentDot')

        let dotsWrapperTransformX = (dotsWidthWithMargin * (sliderItems.length / 2)) - (dotsWidthWithMargin / 2)

        dotsWrapper.style.transform = `translateX(${dotsWrapperTransformX}px)`

        if (isDotsClickable) {
            dots.forEach((dot, dotPos) => {
                dot.addEventListener('click', () => {
                    if (!dot.classList.contains('currentDot')) {
                        let counterOld = counter
                        counter = dotPos

                        console.log(counterOld, counter)
    
                        choseDot(counter)
    
                        transformSliderWrapper(`-${countSlide(counter)}px`)
                        sliderCounter(counter)
                        checkBtnCounter()
                    }
                })
            })
        }

        function choseDot(dot) {
            dots.forEach(dot => {
                dot.classList.remove('currentDot')
                dot.classList.remove('prevDot')
                dot.classList.remove('nextDot')
            })

            dots[dot].classList.add('currentDot')

            for (let i = 1; i <= 5; i++) {
                if (dots[dot + i] !== undefined) dots[dot + i].classList.add('nextDot')
                if (dots[dot - i] !== undefined) dots[dot - i].classList.add('prevDot')
            }
        }
        choseDot(counter)
    
        function nextSlide() {
            if (counter !== sliderItems.length - 1) {
                counter = (counter === sliderItems.length - 1) ? counter = 0 : ++counter

                sliderWrapper.classList.remove('notrans')
    
                transformSliderWrapper(`-${countSlide(counter)}px`)
                sliderCounter(counter)
                checkBtnCounter()

                choseDot(counter)

                dotsWrapperTransformX -= dotsWidthWithMargin
                dotsWrapper.style.transform = `translateX(${dotsWrapperTransformX}px)`
            }
        }
    
        function prevSlide() {
            if (counter !== 0) {
                counter = (counter === 0) ? counter = sliderItems.length - 1 : --counter

                sliderWrapper.classList.remove('notrans')
        
                transformSliderWrapper(`-${countSlide(counter)}px`)
                sliderCounter(counter)
                checkBtnCounter()

                choseDot(counter)

                dotsWrapperTransformX += dotsWidthWithMargin
                dotsWrapper.style.transform = `translateX(${dotsWrapperTransformX}px)`
            }
        }
    
        function countSlide(counter) {
            return (counter * sliderItems[0].clientWidth + counter * marginRight)
        }
        
        function transformSliderWrapper(translate) {
            sliderWrapper.setAttribute('style', `transform: translateX(${translate})`)
        }
    
        /* Slider Counter */
    
        const countSlides = slider.querySelector('.slider__countSlides')
        const globalSlides = slider.querySelector('.slider__globalSlides')
    
        if (sliderItems.length < 10) {
            globalSlides.innerHTML = `0${sliderItems.length}`
        } else {
            globalSlides.innerHTML = sliderItems.length
        }
    
        function sliderCounter(counter) {
            if (counter < 9) {
                countSlides.innerHTML = `0${counter + 1}` 
            } else {
                countSlides.innerHTML = counter + 1
            }
        }
        sliderCounter(counter)
    
        /* Make btn not active */
    
        function checkBtnCounter() {
            if (counter === 0) {
                left.classList.add('slider__btn--noactive')
            } else {
                left.classList.remove('slider__btn--noactive')
            }
    
            if (counter === sliderItems.length - 1) {
                right.classList.add('slider__btn--noactive')
            } else {
                right.classList.remove('slider__btn--noactive')
            }
        }
        checkBtnCounter()
    
        right.addEventListener('click', nextSlide)
        left.addEventListener('click', prevSlide)
    
        /* Resize */
    
        const sliderPadding = params['padding'] || 25
        const sliderWidthWithPadding = 600 + sliderPadding
    
        function resizeWindow() {        
            if (document.body.clientWidth <= (sliderWidthWithPadding)) {
                changeSlidesSize(document.body.clientWidth, sliderPadding)
            } else {
                changeSlidesSize(sliderWidthWithPadding, sliderPadding)
            }
        }
        resizeWindow()
        
        window.addEventListener('resize', resizeWindow)
    
        function changeSlidesSize(changeSize, padding = 0) {
            changeSize -= padding
            slider.style.maxWidth = `${changeSize}px`
    
            sliderItems.forEach(item => {
                item.style.minWidth = `${changeSize}px`
                item.style.borderRadius = `${changeSize / 40}px`
            })
    
            sliderItemsHeight()
    
            sliderWrapper.setAttribute('style', `transform: translateX(-${countSlide(counter)}px)`)
            sliderInner.style.borderRadius = `${changeSize / 40}px`
        }
    
        /* Touch */


        // Вырезанно по причине: "нихера не работает"
        // На самом деле все работает, но плохо. Я не удовлетворен
        /* 
        let draggable = true

        if (params['draggable'] === null || params['draggable'] === false) draggable = false

        if (draggable) {
            let wrapperTransform = 0
        
            let x = 0
            let xDiff = 0

            let isDraggable = false

            sliderInner.addEventListener('touchstart', Event => {dragStart(Event.touches[0].clientX)})
            sliderInner.addEventListener('touchmove', Event => {dragMove(Event.touches[0].clientX)})
            sliderInner.addEventListener('touchend', dragEnd)

            sliderInner.addEventListener('mousedown', Event => {dragStart(Event.clientX)})
            sliderInner.addEventListener('mousemove', Event => {dragMove(Event.clientX)})
            sliderInner.addEventListener('mouseup', dragEnd)

            sliderInner.addEventListener('mouseleave', dragEnd)
        
            function dragStart(param) {
                x = param
                isDraggable = true
                sliderWrapper.classList.add('notrans')
            }
        
            function dragMove(param) {
                if (isDraggable) {
                    xDiff = param - x
                    wrapperTransform = countSlide(counter) - xDiff

                    transformSliderWrapper(`${-(wrapperTransform)}px`)
                }
            }
        
            function dragEnd() {
                if (xDiff < -(sliderItems[0].clientWidth * 0.25)) {
                    if (counter < sliderItems.length - 1) {
                        sliderWrapper.classList.remove('notrans')
                        nextSlide()
                    } else {
                        xDiffToDefault()
                    }
                } else if (xDiff > (sliderItems[0].clientWidth * 0.25)) {
                    if (counter > 0) {
                        sliderWrapper.classList.remove('notrans')
                        prevSlide()
                    } else {
                        xDiffToDefault()
                    }
                } else {
                    xDiffToDefault()
                }
                xDiff = 0
                isDraggable = false
            }


            function xDiffToDefault() {
                sliderWrapper.classList.remove('notrans')
                xDiff = countSlide(counter)
        
                transformSliderWrapper(`-${xDiff}px`)
            }
        }
        */
    }
}