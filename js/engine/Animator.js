// Import the required modules and classes.
import Renderer from './renderer.js';

// The Renderer class extends Component and handles the visual representation of a game object.
class Animator extends Renderer {
  
  constructor(color = 'white', width = 50, height = 50, image = null) {
    super(color, width, height, image); // Call the parent constructor.
    this.map = new Map();
    this.activeAnimation = null;
  }
  
  addAnimation(key, animation)
  {
      animation.gameObject = this.gameObject;
      this.map.set(key, animation);
  }
  
  setAnimation(key)
  {
      if(this.map.has(key) )
      {
          this.activeAnimation = this.map.get(key);
      }
  }
  update(deltaTime)
  {
      this.activeAnimation.update(deltaTime);
      super.update(deltaTime);
  }
  draw(ctx)
  {
      if(this.activeAnimation !== null)
      {
          this.activeAnimation.draw(ctx);
      }
      //super.draw(ctx);
  }
}

// The Renderer class is then exported as the default export of this module.
export default Animator;
