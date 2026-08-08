const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 240; // The total number of frames in the folder

// Function to get the path of a frame based on its index
const currentFrame = index => (
  `frames/video_frames_compressed/frame_${index.toString().padStart(6, '0')}.jpg`
);

const images = [];
let currentFrameIndex = 0;

// Preload all frames for a smooth experience
const preloadImages = () => {
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
};

// Initialize the canvas and preloading
const init = () => {
  preloadImages();
  
  // Set the canvas size and draw the first frame once it's loaded
  images[0].onload = () => {
    canvas.width = images[0].width;
    canvas.height = images[0].height;
    context.drawImage(images[0], 0, 0);
  };
};

// Update the canvas to show the specified frame index
const updateImage = index => {
  if (images[index] && images[index].complete) {
    context.drawImage(images[index], 0, 0);
  } else if (images[index]) {
    images[index].onload = () => {
      context.drawImage(images[index], 0, 0);
    };
  }
};

// Listen to the scroll event
window.addEventListener('scroll', () => {
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  
  // Map the scroll fraction to the frame index
  const frameIndex = Math.min(
    frameCount - 1,
    Math.max(0, Math.floor(scrollFraction * frameCount))
  );
  
  // Use requestAnimationFrame to optimize the rendering
  if (frameIndex !== currentFrameIndex) {
    currentFrameIndex = frameIndex;
    requestAnimationFrame(() => updateImage(frameIndex));
  }
});

// Start the initialization
init();
