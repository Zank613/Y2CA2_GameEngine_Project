// Import the required modules and classes.
import Component from './component.js';
import Renderer from './renderer.js';
// The Renderer class extends Component and handles the visual representation of a game object.
class HorizontalTileRenderer extends Renderer {
  // The constructor initializes the renderer component with optional color, width, height, and image.
  constructor(color = 'white', width = 50, height = 50, image = null) {
    super(); // Call the parent constructor.
    this.color = color; // Initialize the color.
    this.width = width; // Initialize the width.
    this.height = height; // Initialize the height.
    this.image = image; // Initialize the image.
     console.log(" , Hello" );
   
       
  }

  // The draw method handles rendering the game object on the canvas.
  draw(ctx) {
     
    // If an image is provided and it has finished loading, draw the image.
    if (this.image && this.image.complete) {
      
      // Get the position and dimensions of the game object.
      const x = this.gameObject.x;
      const y = this.gameObject.y;
      const w = this.width;
      const h = this.height;
      // Check if the image should be flipped horizontally based on the direction of the game object.
      const flipX = this.gameObject.direction === -1;
      if (!flipX) {
        let scale = h / this.image.naturalHeight;
        let xPos = x;
        let scaledW = this.image.naturalWidth*scale;
       while(xPos + scaledW < x+w)
        {
            ctx.drawImage(this.image, xPos, y, scaledW, h);
            xPos+= scaledW;
        }
        if(xPos < x+w)
        {
            let wLeft = ((x+w)-xPos);
            ctx.drawImage(this.image, 0, 0, wLeft/scale, this.image.naturalHeight, xPos, y, wLeft , h);
        }
       
       //ctx.drawImage(this.image, xPos, y, w, h);
      } 
      else if (flipX) {
        // If the image should be flipped, save the current drawing state,
        // translate and scale the drawing context to flip the image,
        // draw the image, and then restore the drawing state.
        ctx.save();
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        let scale = h / this.image.naturalHeight;
        let xPos = x;
        let scaledW = this.image.naturalWidth*scale;
        console.log(this.image.naturalWidth +" , " + scale);
        while(xPos + scaledW < x+w)
        {
            ctx.drawImage(this.image, xPos, y, scaledW, h);
            xPos+= scaledW;
        }
        if(xPos < x+w)
        {
            let wLeft = ((x+w)-xPos);
            ctx.drawImage(this.image, 0, 0, wLeft/scale, this.image.naturalHeight, xPos, y, wLeft , h);
        }
        ctx.restore();
      }
    } 
    else {
      // If no image is provided or it has not finished loading, draw a rectangle with the specified color.
        ctx.fillStyle = this.color;
      ctx.fillRect(this.gameObject.x, this.gameObject.y, this.width, this.height);
    }
  }
}

// The Renderer class is then exported as the default export of this module.
export default HorizontalTileRenderer;
