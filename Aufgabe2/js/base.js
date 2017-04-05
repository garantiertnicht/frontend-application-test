function Slide(content, imageURL, imageAlternative) {
    this.content = content;
    this.imageURL = imageURL;
    this.imageAlternative = imageAlternative;
    this.imageAdded = false;

    this.slideHiddenPositionLeft = "calc(-100% - 120px)";
    this.slideHiddenPositionRight = "100%";
    this.slideShownPosition = "0";

    /**
     * A function that sets the hidden attribute to false and adds the image if necessary.
     */
    this.present = function () {
        this.content.style.visibility = "visible";
        this.content.style.left = this.slideShownPosition;
    };

    /**
     * A function that hides the current slide
     */
    this.hide = function () {
        this.content.style.left = this.slideHiddenPositionLeft;
    };

    this.prepare = function (fromLeft) {
        if(fromLeft) {
            this.content.style.left = this.slideHiddenPositionLeft;
        } else {
            this.content.style.left = this.slideHiddenPositionRight;
        }

        this.content.style.visibility = "hidden";

        this.addImage();
    };

    /**
     * Adds the image to the slide. Should not be called manually.
     */
    this.addImage = function() {
        if(!this.imageAdded) {
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
    this.elements[1].prepare(false);

    /**
     * Shows the next slide.
     */
    this.showNext = function () {
        this.goToSlide(this.current + 1);
    };

    /**
     * Goes to the given slide.
     * @param slide The slide to go to.
     */
    this.goToSlide = function (slide) {
        if(this.paused) {
            return;
        }

        this.elements[this.current].hide();
        this.current = slide;

        if(this.current >= elements.length) {
            this.current -= elements.length;
        }

        this.elements[this.current].present();

        var nextElementNumber = this.current + 1 >= elements.length ? 0 : this.current + 1;
        elements[nextElementNumber].prepare(false);
    };

    /**
     * Prepares to go to the given slide and goes to it (after a small delay).
     * Will slide to the right or the left depending on the position.
     * @param slide The slide to go to.
     */
    this.prepareAndGoTo = function (slide) {
        if (slide == this.current) {
            // Do not do anything if the current slide is there
            return;
        }

        var fromRight = false;

        if (slide < this.current) {
            fromRight = true;
        }

        elements[slide].prepare(fromRight);

        // Some browsers may do the animation correctly if done in one frame
        setTimeout(this.goToSlide(slide), 20);
    }
};

// Sadly, I need to use JS here AFAIK
function resizeSlide() {
    var containerElement = document.getElementsByClassName("content")[0];
    var partElements = document.getElementsByClassName("part");

    var highestSize = 0;

    for(var i = 0; i < partElements.length; i++) {
        var element = partElements[i];

        var height = element.getElementsByClassName("text")[0].offsetHeight;

        if(element.getElementsByTagName("img").length !== 0) {
            height = Math.max(height, element.getElementsByTagName("img")[0].offsetHeight);
        }

        if(height > highestSize) {
            highestSize = height;
        }
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