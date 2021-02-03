/*
 * Can apply numerous filters to uploaded images
 * Initally based on starting code provided by Dr. Robert Duvall
 * @author Robert C. Duvall
 * @author Josh Geden
 */


// Initialization done by Duvall
// convenience variable to avoid repeatedly getting it in each method
let canvas = document.getElementById('imagecanvas');
// global state to keep track of between user interactions
let originalImage = null;
// not strictly needed - cache this version of the image to make it a little faster for interaction
let filteredImage =null;


// load image using user selected by file chooser input element and draw it using SimpleImage class
//From Duvall
function loadImage () {
    originalImage = new SimpleImage(document.getElementById('fileInput'));
    originalImage.drawTo(canvas);
}

// Draws the original picture with inverted color by inverting each RGB value per pixel
function invert () {
    if (originalImage !=  null) {
        if (filteredImage == null) {
            filteredImage = new SimpleImage(originalImage.getWidth(), originalImage.getHeight());
        }

        //Invert each pixel by subtracting the value from 255
        //So white: (255, 255, 255) would go to black: (0, 0, 0)
        filteredImage.forEachPixel(pixel => {
            let srcPixel = originalImage.getPixel(pixel.getX(), pixel.getY());
            pixel.setRed(255-srcPixel.getRed());
            pixel.setBlue(255-srcPixel.getBlue());
            pixel.setGreen(255-srcPixel.getGreen());
        });

        filteredImage.drawTo(canvas);
    }
}

// Draws the original picture in grayscale
function grayscale () {
    if (originalImage != null) {
        if (filteredImage == null) {
            filteredImage = new SimpleImage(originalImage.getWidth(), originalImage.getHeight()); 
        }

        filteredImage.forEachPixel(pixel => {
            let srcPixel = originalImage.getPixel(pixel.getX(), pixel.getY());
            let grayValue = (srcPixel.getRed() + srcPixel.getBlue() + srcPixel.getGreen()) / 3; //gets average of each R, G, & B value
            pixel.setRed(grayValue);
            pixel.setBlue(grayValue);
            pixel.setGreen(grayValue);
        });

        filteredImage.drawTo(canvas);
    }
}

//Draws the original image with all red value removed
function removeRed () {
    //Check if original & filtered are initialized
    if (originalImage != null) {
        if (filteredImage == null) {
            filteredImage = new SimpleImage(originalImage.getWidth(), originalImage.getHeight()); 
        }

        //Removes all red value from each pixel's RGB code
        filteredImage.forEachPixel(pixel => {
            let srcPixel = originalImage.getPixel(pixel.getX(), pixel.getY());
            pixel.setRed(0);
            pixel.setBlue(srcPixel.getBlue());
            pixel.setGreen(srcPixel.getGreen());
        });

        filteredImage.drawTo(canvas);
    }
}

//Takes and image and creates an image made up of 4 smaller versions
function divideImage() {
    if (originalImage != null) { //check if we have image to edit
        if (filteredImage == null) { //check if result has been initialized
            filteredImage = new SimpleImage(originalImage.getWidth(), originalImage.getHeight()); 
        }
        let width = originalImage.getWidth();
        let height = originalImage.getHeight();
        
        //Creates a copy of original image, then resizes it to 1/4 the size
        let quad = new SimpleImage(width, height);
        quad.forEachPixel(pixel => {
            pixel.setAllFrom(originalImage.getPixel(pixel.getX(), pixel.getY()));
        });
        quad.setSize(width/2, height/2);
        

        let x = 0; //coordinate x value
        let y = 0; //coordinate y value
        let z = 0; //sentinel variable that determines when to increase y-coord
        
        //copies the smaller image into filteredImage four times, using x,y & z to track which pixels to copy over in sequence
        filteredImage.forEachPixel(pixel => {
            pixel.setAllFrom(quad.getPixel(x, y));
            x++;
            if (x >= width/2) {
                x = 0;

                if (z == 0) {
                    z = 1;
                }
                else if (z == 1) {
                    z = 0;
                    y++;
                }
            }

            if (y >= height/2) {
                y=0;
            }
        });

        //Draw final result
        filteredImage.drawTo(canvas);
    }
}

//Adds a border around the original image 10% of the width
function addBorder () {
    if (originalImage != null) { //check if we have image to edit
        if (filteredImage == null) { //check if result has been initialized
            filteredImage = new SimpleImage(originalImage.getWidth(), originalImage.getHeight()); 
        }
        let width = originalImage.getWidth();
        let height = originalImage.getHeight();
        let borderWidth = originalImage.getWidth()*0.10;
        
        //copies the smaller image into filteredImage four times, using x,y & z to track which pixels to copy over in sequence
        filteredImage.forEachPixel(pixel => {
            if (pixel.getX() < borderWidth || pixel.getX() > width-borderWidth || pixel.getY() < borderWidth || pixel.getY() > width-borderWidth) {
                pixel.setRed(0);
                pixel.setGreen(0);
                pixel.setBlue(0);
            }
            else {
                pixel.setAllFrom(originalImage.getPixel(pixel.getX(), pixel.getY()));
            }
        });

        //Draw final result
        filteredImage.drawTo(canvas);
    }
}

// draws original image to canvas
// From Duvall
function resetImage () {
    if (originalImage != null) {
        originalImage.drawTo(canvas);
    }
}

// erase image from canvas by drawing a rectangle over it
// From Duvall
function clearCanvas () {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    // forget selected image
    originalImage = null;
    filteredImage = null;
}