import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesToOptimize = [
  { src: 'attached_assets/gokalaf_1765369417926.png', dest: 'client/public/images/hero.webp', width: 1200 },
  { src: 'attached_assets/sr111_1765369545631.png', dest: 'client/public/images/hero-border.webp', width: 800 },
  { src: 'attached_assets/alaf_coaching_1765368584773.png', dest: 'client/public/images/logo.webp', width: 300 },
  { src: 'client/public/gokalaf.png', dest: 'client/public/images/gokalaf.webp', width: 800 },
  { src: 'attached_assets/ele3_1764401788186.png', dest: 'client/public/images/ele3.webp', width: 600 },
  { src: 'attached_assets/mnb_1764370508144.png', dest: 'client/public/images/mnb.webp', width: 600 },
];

const transformations = [
  'transformation_1.jpeg',
  'transformation_2.jpeg',
  'transformation_3.jpeg',
  'transformation_4.jpeg',
  'transformation_5.jpeg',
  'transformation_6.jpeg',
  'transformation_7.jpeg',
  'transformation_8.jpeg',
  'transformation_9.jpeg',
  'transformation_10.jpeg',
];

async function optimizeImages() {
  const outputDir = 'client/public/images';
  const transformDir = 'client/public/images/transformations';
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(transformDir)) {
    fs.mkdirSync(transformDir, { recursive: true });
  }

  console.log('Starting image optimization...\n');

  for (const img of imagesToOptimize) {
    if (!fs.existsSync(img.src)) {
      console.log(`⚠️ Skipping ${img.src} (not found)`);
      continue;
    }
    
    try {
      const inputStats = fs.statSync(img.src);
      await sharp(img.src)
        .resize(img.width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(img.dest);
      
      const outputStats = fs.statSync(img.dest);
      const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      console.log(`✅ ${path.basename(img.src)} → ${path.basename(img.dest)} (${(inputStats.size/1024).toFixed(0)}KB → ${(outputStats.size/1024).toFixed(0)}KB, ${savings}% smaller)`);
    } catch (err) {
      console.error(`❌ Error processing ${img.src}:`, err);
    }
  }

  console.log('\nOptimizing transformation images...\n');
  
  for (const transform of transformations) {
    const src = `attached_assets/transformations/${transform}`;
    const dest = `${transformDir}/${transform.replace('.jpeg', '.webp')}`;
    
    if (!fs.existsSync(src)) {
      console.log(`⚠️ Skipping ${src} (not found)`);
      continue;
    }
    
    try {
      const inputStats = fs.statSync(src);
      await sharp(src)
        .resize(600, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(dest);
      
      const outputStats = fs.statSync(dest);
      const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      console.log(`✅ ${transform} → ${path.basename(dest)} (${(inputStats.size/1024).toFixed(0)}KB → ${(outputStats.size/1024).toFixed(0)}KB, ${savings}% smaller)`);
    } catch (err) {
      console.error(`❌ Error processing ${src}:`, err);
    }
  }

  console.log('\n🎉 Image optimization complete!');
}

optimizeImages();
