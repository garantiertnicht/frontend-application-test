function Slide(content, imageURL, imageAlternative) {
    this.content = content;
    this.imageURL = imageURL;
    this.imageAlternative = imageAlternative;
    this.imageAdded = false;

    this.slideHiddenPositionLeft = "calc(-100% - 120px)";
    this.slideHiddenPositionRight = "100%";
    this.slideShownPosition = "0";

    /**
     * Presents the slide and loads the image if necessary
     */
    this.present = function () {
        this.addImage();
        this.content.style.opacity = 1;
    };

    /**
     * A function that hides the current slide
     */
    this.hide = function () {
        this.content.style.opacity = 0;
    };

    /**
     * Adds the image to the slide. Should not be called manually.
     */
    this.addImage = function() {
        if(!this.imageAdded && window.innerWidth >= 550) {
            var imageElement = document.createElement("img");
            imageElement.setAttribute("src", this.imageURL);
            imageElement.setAttribute("alt", this.imageAlternative);
            this.content.insertBefore(imageElement, this.content.childNodes[0]);

            this.imageAdded = true;
            resizeSlide();
        }
    };
}

function SlideShow(elements) {
    this.elements = elements;
    this.current = 0;
    this.paused = false;

    this.elements[0].addImage();

    /**
     * Shows the next slide.
     */
    this.showNext = function () {
        this.goToSlide(this.current + 1, false, true);
    };

    /**
     * Goes to the given slide
     * @param slide The slide to go to.
     * @param manual If the action is invoked by the user
     * @param toLeft If the old slide should move to the left.
     */
    this.goToSlide = function (slide, manual) {
        if(this.paused && !manual) {
            return;
        }

        this.elements[this.current].hide();
        this.current = slide;

        if(this.current >= elements.length) {
            this.current -= elements.length;
        }

        this.elements[this.current].present();
    };

    /**
     * Adds the buttons.
     */
    this.createButtons = function () {
        var slideshowContainer = document.getElementById("slideshow");
        var buttonGroup = document.createElement("div");
        buttonGroup.className = "button-group";
        slideshowContainer.appendChild(buttonGroup);

        for(var i = 0; i < this.elements.length; i++) {
            var button = document.createElement("button");
            button.innerHTML = i + 1;

            button.onclick = function(instance, index) {
                return function () {
                    instance.goToSlide(index, true);
                }
            }(this, i);

            buttonGroup.appendChild(button);
        }

    }
}

function resizeSlide() {
    var containerElement = document.getElementsByClassName("content")[0];
    var partElements = document.getElementsByClassName("part");

    var highestSize = 0;

    for(var i = 0; i < partElements.length; i++) {
        var element = partElements[i];

        var height = element.getElementsByClassName("text")[0].offsetHeight;

        if(element.getElementsByTagName("img").length !== 0 && screen.availWidth >= 550) {
            height = Math.max(height, element.getElementsByTagName("img")[0].offsetHeight);
        }

        if(height > highestSize) {
            highestSize = height;
        }
    }

    if(highestSize > 0) {
        highestSize += 35;  // Some extra space for buttons and to be extra-safe
    }

    containerElement.style.height = highestSize + "px";
}

function initialize() {
    var slides = [];
    var partElements = document.getElementsByClassName("part");

    for(var i = 0; i < partElements.length; i++) {
        var element = partElements[i];
        slides[i] = new Slide(element, element.dataset.imageUrl, element.dataset.imageAlt);
    }

    var slideShow = new SlideShow(slides);
    slideShow.createButtons();

    document.body.onresize = resizeSlide;

    // Pause on MouseOver - Probably someone is reading
    document.getElementsByClassName("content")[0].onmouseover = function () {
        slideShow.paused = true
    };

    document.getElementsByClassName("content")[0].onmouseout = function () {
        slideShow.paused = false
    };

    setInterval(function () {
        slideShow.showNext();
    }, 8000);

    resizeSlide();
}