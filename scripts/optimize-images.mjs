import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlesDir = path.join(__dirname, '../client/public/articles');

async function optimizeImages() {
  const files = fs.readdirSync(articlesDir);
  const pngFiles = files.filter(f => f.endsWith('.png'));
  
  console.log(`Found ${pngFiles.length} PNG files to convert`);
  
  for (const file of pngFiles) {
    const inputPath = path.join(articlesDir, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(articlesDir, outputName);
    
    try {
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;
      
      await sharp(inputPath)
        .resize(1200, 675, { fit: 'cover', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const newStats = fs.statSync(outputPath);
      const newSize = newStats.size;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`✓ ${file} -> ${outputName} (${(originalSize/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB, -${reduction}%)`);
    } catch (err) {
      console.error(`✗ Error processing ${file}:`, err.message);
    }
  }
  
  console.log('\nConversion complete!');
}

optimizeImages();
