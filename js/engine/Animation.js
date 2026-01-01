// Import the required modules and classes.
import Component from './component.js';
import Renderer from './renderer.js';
// The Renderer class extends Component and handles the visual representation of a game object.
class Animation extends Renderer {
  // The constructor initializes the renderer component with optional color, width, height, and image.
  constructor(color = 'white', width = 50, height = 50,
  images = null, fps) {
    super(color, width, height,images[0] ); // Call the parent constructor.
    this.images = images; // Initialize the image.
    this.fps = fps;
    this.frameTime = 1/(this.fps);
    this.toChange = this.frameTime;
    this.nextImage = 1%this.images.length;
  }
  update(deltaTime)
  {
      this.toChange -= deltaTime;
      if(this.toChange <=0)
      {
          this.image = this.images[this.nextImage];
          this.nextImage = (this.nextImage+1)%this.images.length;
          this.toChange = this.frameTime;
          
     
      }
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
        // If the image should not be flipped, draw it as is.
        ctx.drawImage(this.image, x, y, w, h);
      } else {
        // If the image should be flipped, save the current drawing state,
        // translate and scale the drawing context to flip the image,
        // draw the image, and then restore the drawing state.
        ctx.save();
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.image, 0, 0, w, h);
        ctx.restore();
      }
    } else {
      // If no image is provided or it has not finished loading, draw a rectangle with the specified color.
      ctx.fillStyle = this.color;
      ctx.fillRect(this.gameObject.x, this.gameObject.y, this.width, this.height);
    }
  }
}

// The Renderer class is then exported as the default export of this module.
export default Animation;
