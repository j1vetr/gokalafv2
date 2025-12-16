import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const LOGO_PATH = 'client/public/logo.png';
const IMAGES_DIR = 'attached_assets/generated_images';
const OUTPUT_DIR = 'client/public/articles';

async function addLogoToImages() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all generated images
  const images = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.png'));
  
  // Load and resize logo
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(120, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  for (const imageName of images) {
    const inputPath = path.join(IMAGES_DIR, imageName);
    const outputPath = path.join(OUTPUT_DIR, imageName);
    
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      const width = metadata.width || 1920;
      const height = metadata.height || 1080;
      
      // Position logo in bottom-right with padding
      await image
        .composite([{
          input: logoBuffer,
          gravity: 'southeast',
          blend: 'over'
        }])
        .toFile(outputPath);
      
      console.log(`Processed: ${imageName}`);
    } catch (error) {
      console.error(`Error processing ${imageName}:`, error);
    }
  }
  
  console.log('Done!');
}

addLogoToImages();
