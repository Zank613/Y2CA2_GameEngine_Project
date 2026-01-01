// Create an Images object to hold the Image instances for the player and the enemy.
const Images = {
  player: new Image(), // The Image instance for the player.
  enemy: new Image(),
  collectible: new Image(),
  backgroud: new Image()// The Image instance for the enemy.
};

// Create an AudioFiles object to hold the file paths of the audio resources.
const AudioFiles = {
    collect: new Audio('./resources/Audio/pick-up.mp3')
  
};

// Set the source of the player image.
Images.player.src = './resources/images/player/Santa.png'; // Update the image path
Images.backgroud.src = './resources/images/bg.jpg'
// Set the source of the enemy image.
Images.enemy.src = './resources/images/enemy/enemy.png'; // Update the image path
Images.collectible.src = "./resources/images/collectible/star.png";
// Export the Images and AudioFiles objects so they can be imported and used in other modules.
export { Images, AudioFiles };
