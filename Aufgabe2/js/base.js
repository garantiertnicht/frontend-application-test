function Slide(content, imageURL, imageAlternative) {
    this.content = content;
    this.imageURL = imageURL;
    this.imageAlternative = imageAlternative;
    this.imageAdded = false;

    /**
     * A function that sets the hidden attribute to false and adds the image if necessary.
     */
    this.present = function () {
        this.content.style.visibility = "visible";
        this.content.style.left = "0";
    };

    /**
     * A function that hides the current slide
     */
    this.hide = function () {
        this.content.style.left = "-100%";
    };

    this.prepare = function () {
        this.content.style.visibility = "hidden";
        this.content.style.left = "100%";

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

            resizeSlide();
            this.imageAdded = true;
        }
    };
}

function SlideShow(elements) {
    this.elements = elements;
    this.current = 0;
    this.paused = false;

    this.elements[0].addImage();
    this.elements[1].prepare();

    this.showNext = function () {
        if(this.paused) {
            return;
        }

        this.elements[this.current].hide();
        this.current++;

        if(this.current >= elements.length) {
            this.current = 0;
        }

        this.elements[this.current].present();

        var nextElementNumber = this.current + 1 >= elements.length ? 0 : this.current + 1;
        elements[nextElementNumber].prepare();
    };
}

// Sadly, I need to use JS here AFAIK
function resizeSlide() {
    var containerElement = document.getElementsByClassName("content")[0];
    var partElements = document.getElementsByClassName("part");

    var highestSize = 0;

    for(var i = 0; i < partElements.length; i++) {
        var element = partElements[i];
        if(element.offsetHeight > highestSize) {
            highestSize = element.offsetHeight;
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