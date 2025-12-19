import fs from 'fs';
import path from 'path';
import https from 'https';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { exercises } from '../shared/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool });

const EXERCISES_JSON_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const IMAGES_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';
const LOCAL_IMAGES_DIR = path.join(process.cwd(), 'client/public/exercises');

interface ExerciseJSON {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, (res) => {
            res.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          }).on('error', reject);
        }
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchJSON(url: string): Promise<ExerciseJSON[]> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🏋️ Starting exercise import...\n');

  // Fetch exercises JSON
  console.log('📥 Fetching exercises data...');
  const exercisesData = await fetchJSON(EXERCISES_JSON_URL);
  console.log(`✅ Found ${exercisesData.length} exercises\n`);

  // Ensure images directory exists
  if (!fs.existsSync(LOCAL_IMAGES_DIR)) {
    fs.mkdirSync(LOCAL_IMAGES_DIR, { recursive: true });
  }

  let imported = 0;
  let skipped = 0;
  let imageDownloaded = 0;
  let imageSkipped = 0;

  for (const exercise of exercisesData) {
    const slug = slugify(exercise.name);
    const localImages: string[] = [];

    // Download images
    for (const imagePath of exercise.images) {
      const imageUrl = `${IMAGES_BASE_URL}/${imagePath}`;
      const localPath = `/exercises/${imagePath}`;
      const fullLocalPath = path.join(LOCAL_IMAGES_DIR, imagePath);

      if (!fs.existsSync(fullLocalPath)) {
        try {
          await downloadFile(imageUrl, fullLocalPath);
          imageDownloaded++;
          if (imageDownloaded % 50 === 0) {
            console.log(`📸 Downloaded ${imageDownloaded} images...`);
          }
        } catch (error) {
          console.error(`❌ Failed to download image: ${imagePath}`);
        }
      } else {
        imageSkipped++;
      }
      localImages.push(localPath);
    }

    // Insert into database
    try {
      await db.insert(exercises).values({
        id: exercise.id,
        name: exercise.name,
        slug,
        force: exercise.force,
        level: exercise.level,
        mechanic: exercise.mechanic,
        equipment: exercise.equipment,
        category: exercise.category,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        instructionsEn: exercise.instructions,
        instructionsTr: null,
        images: localImages,
      }).onConflictDoNothing();
      imported++;
      if (imported % 100 === 0) {
        console.log(`💪 Imported ${imported} exercises...`);
      }
    } catch (error: any) {
      if (error.code === '23505') {
        skipped++;
      } else {
        console.error(`❌ Failed to import ${exercise.name}:`, error.message);
      }
    }
  }

  console.log('\n✅ Import complete!');
  console.log(`📊 Exercises: ${imported} imported, ${skipped} skipped (already exist)`);
  console.log(`📸 Images: ${imageDownloaded} downloaded, ${imageSkipped} skipped (already exist)`);
  
  process.exit(0);
}

main().catch(console.error);
