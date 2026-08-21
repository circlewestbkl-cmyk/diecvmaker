const jsonStorage = require('./jsonStorageService');

const JOBS_FILE = 'jobs.json';

async function getAllJobs(filters = {}) {
  let jobs = await jsonStorage.findMany(JOBS_FILE);

  // Search by title or company
  if (filters.search) {
    const q = filters.search.toLowerCase();
    jobs = jobs.filter(job =>
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q)
    );
  }

  // Filter by employment type
  if (filters.employmentType) {
    jobs = jobs.filter(job => job.employmentType === filters.employmentType);
  }

  // Filter by workplace type
  if (filters.workplaceType) {
    jobs = jobs.filter(job => job.workplaceType === filters.workplaceType);
  }

  // Filter by location
  if (filters.location) {
    const loc = filters.location.toLowerCase();
    jobs = jobs.filter(job => job.location.toLowerCase().includes(loc));
  }

  // Filter by skills
  if (filters.skill) {
    const skill = filters.skill.toLowerCase();
    jobs = jobs.filter(job =>
      job.skills.some(s => s.toLowerCase().includes(skill))
    );
  }

  // Filter by salary range
  if (filters.salaryMin) {
    jobs = jobs.filter(job => job.salaryMax >= parseInt(filters.salaryMin));
  }

  // Sort
  if (filters.sort === 'salary') {
    jobs.sort((a, b) => b.salaryMax - a.salaryMax);
  } else if (filters.sort === 'oldest') {
    jobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    // Default: newest first
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return jobs;
}

async function getJobById(id) {
  return await jsonStorage.findById(JOBS_FILE, id);
}

async function createJob(data) {
  return await jsonStorage.create(JOBS_FILE, {
    company: data.company,
    title: data.title,
    description: data.description || '',
    location: data.location || '',
    salaryMin: data.salaryMin || 0,
    salaryMax: data.salaryMax || 0,
    employmentType: data.employmentType || 'Full-time',
    workplaceType: data.workplaceType || 'On-site',
    skills: data.skills || [],
    requirements: data.requirements || [],
    benefits: data.benefits || [],
    applicationUrl: data.applicationUrl || '',
    postedBy: data.postedBy || null
  }, 'job');
}

async function updateJob(id, data) {
  const existing = await jsonStorage.findById(JOBS_FILE, id);
  if (!existing) return null;

  const allowed = [
    'company', 'title', 'description', 'location',
    'salaryMin', 'salaryMax', 'employmentType', 'workplaceType',
    'skills', 'requirements', 'benefits', 'applicationUrl'
  ];
  const updateData = {};
  allowed.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });

  return await jsonStorage.update(JOBS_FILE, id, updateData);
}

async function deleteJob(id) {
  return await jsonStorage.remove(JOBS_FILE, id);
}

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };
