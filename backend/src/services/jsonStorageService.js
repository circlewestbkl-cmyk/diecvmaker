const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data');

// In-memory storage for Vercel serverless (ephemeral filesystem)
const isServerless = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const memoryStore = {};

// Seed demo data for serverless environments
const SEED_DATA = {
  'users.json': [
    { id: 'user_admin_001', name: 'Admin CVForge', email: 'admin@cvforge.com', password: '$2b$10$xT0nMlCXS7zh25NwHSdDMOqTFccJ1uUMYrvfjr8.DsEKtEU.8Hgzm', role: 'admin', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    { id: 'user_001', name: 'Digo Ardestilano', email: 'digo@demo.com', password: '$2b$10$xT0nMlCXS7zh25NwHSdDMOqTFccJ1uUMYrvfjr8.DsEKtEU.8Hgzm', role: 'user', createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' },
    { id: 'user_002', name: 'Sarah Chen', email: 'sarah@demo.com', password: '$2b$10$xT0nMlCXS7zh25NwHSdDMOqTFccJ1uUMYrvfjr8.DsEKtEU.8Hgzm', role: 'user', createdAt: '2026-08-05T00:00:00.000Z', updatedAt: '2026-08-05T00:00:00.000Z' },
    { id: 'user_003', name: 'Ahmad Rizky', email: 'ahmad@demo.com', password: '$2b$10$xT0nMlCXS7zh25NwHSdDMOqTFccJ1uUMYrvfjr8.DsEKtEU.8Hgzm', role: 'user', createdAt: '2026-08-10T00:00:00.000Z', updatedAt: '2026-08-10T00:00:00.000Z' }
  ],
  'cvs.json': [
    { id: 'cv_demo_001', userId: 'user_001', title: 'Full-Stack Developer CV', personalInfo: { name: 'Digo Ardestilano', email: 'digo@demo.com', phone: '+62 812-3456-7890', address: 'Jakarta, Indonesia', summary: 'Passionate full-stack developer with 3+ years experience in Vue.js and Node.js.' }, experience: [{ company: 'Tech Startup', position: 'Full-Stack Developer', startDate: '2023-01', endDate: 'Present', description: 'Built scalable web applications using Vue.js and Express.' }], education: [{ institution: 'University of Indonesia', degree: 'Bachelor of Computer Science', field: 'Computer Science', startDate: '2019', endDate: '2023' }], skills: ['JavaScript', 'Vue.js', 'Node.js', 'React', 'TypeScript', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'REST API', 'GraphQL', 'Tailwind CSS', 'HTML/CSS', 'Linux', 'CI/CD', 'Agile'], projects: [{ name: 'CVForge', description: 'SaaS CV Builder with ATS Checker', url: 'https://cvforge.app' }], certifications: [], languages: [{ language: 'English', level: 'Fluent' }, { language: 'Indonesian', level: 'Native' }], isPublic: false, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' }
  ],
  'applications.json': [
    { id: 'app_demo_001', userId: 'user_001', company: 'Google', position: 'Frontend Developer', status: 'interview', appliedDate: '2026-08-10T00:00:00.000Z', notes: 'Applied via referral', createdAt: '2026-08-10T00:00:00.000Z', updatedAt: '2026-08-15T00:00:00.000Z' },
    { id: 'app_demo_002', userId: 'user_001', company: 'Microsoft', position: 'Full-Stack Developer', status: 'applied', appliedDate: '2026-08-12T00:00:00.000Z', notes: 'Applied online', createdAt: '2026-08-12T00:00:00.000Z', updatedAt: '2026-08-12T00:00:00.000Z' },
    { id: 'app_demo_003', userId: 'user_001', company: 'Gojek', position: 'Backend Developer', status: 'offered', appliedDate: '2026-08-05T00:00:00.000Z', notes: 'Received offer letter', createdAt: '2026-08-05T00:00:00.000Z', updatedAt: '2026-08-20T00:00:00.000Z' }
  ],
  'templates.json': [
    { id: 'tpl_001', name: 'Professional', description: 'Clean and professional layout', category: 'professional', isPremium: false },
    { id: 'tpl_002', name: 'Creative', description: 'Bold and creative design', category: 'creative', isPremium: false },
    { id: 'tpl_003', name: 'Minimalist', description: 'Simple and clean', category: 'minimalist', isPremium: false }
  ]
};

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Directory already exists
  }
}

// Generate ID with prefix
function generateId(prefix = 'item') {
  return `${prefix}_${uuidv4()}`;
}

// Seed data for serverless environments
function seedIfNeeded(file) {
  if (isServerless && !memoryStore[file] && SEED_DATA[file]) {
    memoryStore[file] = JSON.parse(JSON.stringify(SEED_DATA[file]));
    console.log(`Seeded ${file} with ${SEED_DATA[file].length} items`);
  }
}

// Read data - tries file first, falls back to memory
async function readData(file) {
  if (isServerless) {
    seedIfNeeded(file);
    return memoryStore[file] || [];
  }
  // Local development: use file system
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(rawData);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeData(file, []);
      return [];
    }
    console.error(`Error reading ${file}:`, err.message);
    return [];
  }
}

// Write data - tries file first, falls back to memory
async function writeData(file, data) {
  if (isServerless) {
    memoryStore[file] = data;
    return true;
  }
  // Local development: use file system
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  const tempPath = filePath + '.tmp';
  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    try { await fs.unlink(tempPath); } catch (_) {}
    throw err;
  }
}

// Find item by ID
async function findById(file, id) {
  const items = await readData(file);
  return items.find(item => item.id === id) || null;
}

// Find one item matching callback
async function findOne(file, callback) {
  const items = await readData(file);
  return items.find(callback) || null;
}

// Find many items matching callback
async function findMany(file, callback) {
  const items = await readData(file);
  if (!callback) return items;
  return items.filter(callback);
}

// Create new item
async function create(file, data, prefix = 'item') {
  const items = await readData(file);
  const newItem = {
    ...data,
    id: data.id || generateId(prefix),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  items.push(newItem);
  await writeData(file, items);
  return newItem;
}

// Update item by ID
async function update(file, id, data) {
  const items = await readData(file);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    ...data,
    id: items[index].id,
    createdAt: items[index].createdAt,
    updatedAt: new Date().toISOString()
  };
  await writeData(file, items);
  return items[index];
}

// Remove item by ID
async function remove(file, id) {
  const items = await readData(file);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  const removed = items.splice(index, 1)[0];
  await writeData(file, items);
  return removed;
}

module.exports = {
  readData,
  writeData,
  findById,
  findOne,
  findMany,
  create,
  update,
  remove,
  generateId
};
