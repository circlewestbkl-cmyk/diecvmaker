const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

const USERS_FILE = 'users.json';
const PROFILES_FILE = 'profiles.json';
const TEMPLATES_FILE = 'templates.json';
const JOBS_FILE = 'jobs.json';
const CVS_FILE = 'cvs.json';

const SALT_ROUNDS = 10;

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readData(file) {
  const filePath = path.join(DATA_DIR, file);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeData(file, data) {
  const filePath = path.join(DATA_DIR, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

const templates = [
  { id: 'tpl_classic', name: 'ATS Classic', category: 'ATS', preview: '/previews/classic.png', isPremium: false, isATSCompatible: true },
  { id: 'tpl_modern', name: 'ATS Modern', category: 'ATS', preview: '/previews/modern.png', isPremium: false, isATSCompatible: true },
  { id: 'tpl_professional', name: 'Professional', category: 'Professional', preview: '/previews/professional.png', isPremium: false, isATSCompatible: true },
  { id: 'tpl_minimalist', name: 'Minimalist', category: 'Minimalist', preview: '/previews/minimalist.png', isPremium: false, isATSCompatible: true },
  { id: 'tpl_developer', name: 'Developer', category: 'Creative', preview: '/previews/developer.png', isPremium: true, isATSCompatible: true },
  { id: 'tpl_executive', name: 'Executive', category: 'Executive', preview: '/previews/executive.png', isPremium: true, isATSCompatible: true }
];

const jobs = [
  { id: 'job_001', company: 'Google', title: 'Senior Frontend Developer', description: 'Looking for experienced frontend developer with Vue.js and React skills.', location: 'Mountain View, CA', salaryMin: 120000, salaryMax: 180000, employmentType: 'Full-time', workplaceType: 'Hybrid', skills: ['Vue.js', 'React', 'TypeScript', 'CSS'], createdAt: new Date().toISOString() },
  { id: 'job_002', company: 'Microsoft', title: 'Full Stack Engineer', description: 'Full stack engineer needed with Node.js and Vue.js experience.', location: 'Redmond, WA', salaryMin: 110000, salaryMax: 160000, employmentType: 'Full-time', workplaceType: 'Remote', skills: ['Node.js', 'Vue.js', 'TypeScript', 'Azure'], createdAt: new Date().toISOString() },
  { id: 'job_003', company: 'Shopee', title: 'Backend Developer', description: 'Backend developer with Node.js and API design experience.', location: 'Singapore', salaryMin: 80000, salaryMax: 120000, employmentType: 'Full-time', workplaceType: 'On-site', skills: ['Node.js', 'Express', 'MongoDB', 'Redis'], createdAt: new Date().toISOString() },
  { id: 'job_004', company: 'Gojek', title: 'Mobile Developer', description: 'Mobile developer with React Native or Flutter experience.', location: 'Jakarta, Indonesia', salaryMin: 60000, salaryMax: 100000, employmentType: 'Full-time', workplaceType: 'Hybrid', skills: ['React Native', 'Flutter', 'TypeScript', 'Firebase'], createdAt: new Date().toISOString() },
  { id: 'job_005', company: 'Tokopedia', title: 'DevOps Engineer', description: 'DevOps engineer with CI/CD and cloud infrastructure experience.', location: 'Jakarta, Indonesia', salaryMin: 70000, salaryMax: 110000, employmentType: 'Full-time', workplaceType: 'On-site', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], createdAt: new Date().toISOString() },
  { id: 'job_006', company: 'Grab', title: 'Data Engineer', description: 'Data engineer with experience in data pipelines and ETL.', location: 'Singapore', salaryMin: 90000, salaryMax: 140000, employmentType: 'Full-time', workplaceType: 'Hybrid', skills: ['Python', 'Spark', 'SQL', 'Airflow'], createdAt: new Date().toISOString() },
  { id: 'job_007', company: 'Traveloka', title: 'Product Manager', description: 'Product manager with experience in e-commerce or travel.', location: 'Jakarta, Indonesia', salaryMin: 80000, salaryMax: 130000, employmentType: 'Full-time', workplaceType: 'On-site', skills: ['Product Management', 'Agile', 'Data Analysis', 'SQL'], createdAt: new Date().toISOString() },
  { id: 'job_008', company: 'Netflix', title: 'Staff Software Engineer', description: 'Staff engineer with distributed systems experience.', location: 'Los Gatos, CA', salaryMin: 200000, salaryMax: 350000, employmentType: 'Full-time', workplaceType: 'Remote', skills: ['Java', 'Microservices', 'AWS', 'System Design'], createdAt: new Date().toISOString() },
  { id: 'job_009', company: 'Meta', title: 'Frontend Engineer', description: 'Frontend engineer with React and performance optimization skills.', location: 'Menlo Park, CA', salaryMin: 150000, salaryMax: 220000, employmentType: 'Full-time', workplaceType: 'Hybrid', skills: ['React', 'TypeScript', 'GraphQL', 'CSS'], createdAt: new Date().toISOString() },
  { id: 'job_010', company: 'Amazon', title: 'Cloud Solutions Architect', description: 'AWS Solutions Architect with enterprise experience.', location: 'Seattle, WA', salaryMin: 130000, salaryMax: 200000, employmentType: 'Full-time', workplaceType: 'Remote', skills: ['AWS', 'Terraform', 'Python', 'Architecture'], createdAt: new Date().toISOString() },
  { id: 'job_011', company: 'Spotify', title: 'iOS Developer', description: 'iOS developer with Swift and SwiftUI experience.', location: 'Stockholm, Sweden', salaryMin: 70000, salaryMax: 100000, employmentType: 'Full-time', workplaceType: 'Remote', skills: ['Swift', 'SwiftUI', 'UIKit', 'CI/CD'], createdAt: new Date().toISOString() },
  { id: 'job_012', company: 'Airbnb', title: 'Backend Engineer', description: 'Backend engineer with Ruby on Rails and distributed systems.', location: 'San Francisco, CA', salaryMin: 140000, salaryMax: 200000, employmentType: 'Full-time', workplaceType: 'Remote', skills: ['Ruby', 'Rails', 'PostgreSQL', 'Redis'], createdAt: new Date().toISOString() },
  { id: 'job_013', company: 'Shopify', title: 'React Developer', description: 'React developer with e-commerce platform experience.', location: 'Toronto, Canada', salaryMin: 90000, salaryMax: 140000, employmentType: 'Full-time', workplaceType: 'Remote', skills: ['React', 'TypeScript', 'GraphQL', 'Ruby'], createdAt: new Date().toISOString() },
  { id: 'job_014', company: 'Stripe', title: 'Payment Systems Engineer', description: 'Engineer to build reliable payment infrastructure.', location: 'San Francisco, CA', salaryMin: 160000, salaryMax: 250000, employmentType: 'Full-time', workplaceType: 'Hybrid', skills: ['Ruby', 'Go', 'Distributed Systems', 'Security'], createdAt: new Date().toISOString() },
  { id: 'job_015', company: 'Lemonade', title: 'Junior Frontend Developer', description: 'Junior developer to join our insurtech platform team.', location: 'New York, NY', salaryMin: 60000, salaryMax: 85000, employmentType: 'Full-time', workplaceType: 'Hybrid', skills: ['React', 'JavaScript', 'CSS', 'HTML'], createdAt: new Date().toISOString() },
  { id: 'job_016', company: 'OVO', title: 'Android Developer', description: 'Android developer with Kotlin and payment experience.', location: 'Jakarta, Indonesia', salaryMin: 50000, salaryMax: 80000, employmentType: 'Full-time', workplaceType: 'On-site', skills: ['Kotlin', 'Android', 'REST API', 'Firebase'], createdAt: new Date().toISOString() },
  { id: 'job_017', company: 'Dana', title: 'QA Engineer', description: 'QA engineer with automation testing experience.', location: 'Jakarta, Indonesia', salaryMin: 40000, salaryMax: 70000, employmentType: 'Full-time', workplaceType: 'On-site', skills: ['Selenium', 'Cypress', 'Jest', 'API Testing'], createdAt: new Date().toISOString() },
  { id: 'job_018', company: 'Bukalapak', title: 'Data Analyst', description: 'Data analyst with SQL and Python skills.', location: 'Jakarta, Indonesia', salaryMin: 45000, salaryMax: 75000, employmentType: 'Full-time', workplaceType: 'Hybrid', skills: ['SQL', 'Python', 'Tableau', 'Excel'], createdAt: new Date().toISOString() },
  { id: 'job_019', company: 'Blibli', title: 'Site Reliability Engineer', description: 'SRE to maintain and improve platform reliability.', location: 'Jakarta, Indonesia', salaryMin: 60000, salaryMax: 95000, employmentType: 'Full-time', workplaceType: 'On-site', skills: ['Linux', 'Docker', 'Kubernetes', 'Monitoring'], createdAt: new Date().toISOString() },
  { id: 'job_020', company: 'Kredivo', title: 'Machine Learning Engineer', description: 'ML engineer for credit scoring and fraud detection.', location: 'Jakarta, Indonesia', salaryMin: 70000, salaryMax: 110000, employmentType: 'Full-time', workplaceType: 'Hybrid', skills: ['Python', 'TensorFlow', 'Scikit-learn', 'SQL'], createdAt: new Date().toISOString() }
];

async function seed() {
  console.log('🌱 Seeding CVForge data...\n');

  await ensureDataDir();

  // Seed users
  const existingUsers = await readData(USERS_FILE);
  if (existingUsers.length > 0) {
    console.log('⚠️  Users already exist. Skipping user seed.');
  } else {
    const password = await bcrypt.hash('password123', SALT_ROUNDS);
    const users = [
      { id: 'user_admin_001', name: 'Admin CVForge', email: 'admin@cvforge.com', password, role: 'admin', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
      { id: 'user_001', name: 'Digo Ardestilano', email: 'digo@demo.com', password, role: 'user', createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' },
      { id: 'user_002', name: 'Sarah Chen', email: 'sarah@demo.com', password, role: 'user', createdAt: '2026-08-05T00:00:00.000Z', updatedAt: '2026-08-05T00:00:00.000Z' },
      { id: 'user_003', name: 'Ahmad Rizky', email: 'ahmad@demo.com', password, role: 'user', createdAt: '2026-08-10T00:00:00.000Z', updatedAt: '2026-08-10T00:00:00.000Z' }
    ];
    await writeData(USERS_FILE, users);
    console.log(`✅ Created ${users.length} users`);
  }

  // Seed profiles
  const existingProfiles = await readData(PROFILES_FILE);
  if (existingProfiles.length > 0) {
    console.log('⚠️  Profiles already exist. Skipping profile seed.');
  } else {
    const profiles = [
      { id: 'profile_001', userId: 'user_001', fullName: 'Digo Ardestilano', professionalTitle: 'Full Stack Developer', phone: '+62812345678', location: 'Jakarta, Indonesia', website: 'https://digo.dev', linkedin: 'https://linkedin.com/in/digo', github: 'https://github.com/digo', bio: 'Passionate full stack developer with 3+ years of experience building web applications using Vue.js and Node.js.', avatar: null, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' },
      { id: 'profile_002', userId: 'user_002', fullName: 'Sarah Chen', professionalTitle: 'UI/UX Designer & Frontend Developer', phone: '+6591234567', location: 'Singapore', website: 'https://sarahchen.design', linkedin: 'https://linkedin.com/in/sarahchen', github: 'https://github.com/sarahchen', bio: 'Creative designer turned developer with a passion for building beautiful, accessible interfaces.', avatar: null, createdAt: '2026-08-05T00:00:00.000Z', updatedAt: '2026-08-05T00:00:00.000Z' },
      { id: 'profile_003', userId: 'user_003', fullName: 'Ahmad Rizky', professionalTitle: 'Backend Engineer', phone: '+62856789012', location: 'Bandung, Indonesia', website: null, linkedin: 'https://linkedin.com/in/ahmadrizky', github: 'https://github.com/ahmadrizky', bio: 'Backend engineer focused on building scalable APIs and microservices.', avatar: null, createdAt: '2026-08-10T00:00:00.000Z', updatedAt: '2026-08-10T00:00:00.000Z' }
    ];
    await writeData(PROFILES_FILE, profiles);
    console.log(`✅ Created ${profiles.length} profiles`);
  }

  // Seed templates
  const existingTemplates = await readData(TEMPLATES_FILE);
  if (existingTemplates.length > 0) {
    console.log('⚠️  Templates already exist. Skipping template seed.');
  } else {
    await writeData(TEMPLATES_FILE, templates);
    console.log(`✅ Created ${templates.length} templates`);
  }

  // Seed jobs
  const existingJobs = await readData(JOBS_FILE);
  if (existingJobs.length > 0) {
    console.log('⚠️  Jobs already exist. Skipping job seed.');
  } else {
    await writeData(JOBS_FILE, jobs);
    console.log(`✅ Created ${jobs.length} jobs`);
  }

  // Seed sample CVs with perfect ATS scores
  const existingCvs = await readData(CVS_FILE);
  if (existingCvs.length > 0) {
    console.log('⚠️  CVs already exist. Skipping CV seed.');
  } else {
    // Sample CVs are loaded from cvs.json
    const cvsPath = path.join(DATA_DIR, 'cvs.json');
    try {
      await fs.access(cvsPath);
      console.log('✅ Sample CVs already present in cvs.json');
    } catch {
      console.log('⚠️  No sample CVs found. Run: cp cvs.json.example cvs.json');
    }
  }

  console.log('\n🎉 Seed completed!');
  console.log('\n📋 Demo Accounts:');
  console.log('   Admin:    admin@cvforge.com / password123');
  console.log('   User 1:   digo@demo.com / password123');
  console.log('   User 2:   sarah@demo.com / password123');
  console.log('   User 3:   ahmad@demo.com / password123');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
