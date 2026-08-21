const jsonStorage = require('./jsonStorageService');

const APPLICATIONS_FILE = 'applications.json';

async function getApplicationsByUserId(userId) {
  const applications = await jsonStorage.findMany(APPLICATIONS_FILE, app => app.userId === userId);
  // Sort by most recent first
  applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return applications;
}

async function getApplicationById(id) {
  return await jsonStorage.findById(APPLICATIONS_FILE, id);
}

async function getApplicationByUserAndJob(userId, jobId) {
  return await jsonStorage.findOne(APPLICATIONS_FILE, app => app.userId === userId && app.jobId === jobId);
}

async function createApplication(userId, data) {
  // Check if already applied
  const existing = await getApplicationByUserAndJob(userId, data.jobId);
  if (existing) {
    throw new Error('You have already applied to this job');
  }

  return await jsonStorage.create(APPLICATIONS_FILE, {
    userId,
    jobId: data.jobId,
    cvId: data.cvId || null,
    coverLetterId: data.coverLetterId || null,
    status: 'applied',
    notes: data.notes || '',
    appliedAt: new Date().toISOString()
  }, 'app');
}

async function updateApplication(id, data) {
  const existing = await jsonStorage.findById(APPLICATIONS_FILE, id);
  if (!existing) return null;

  const allowed = ['status', 'notes', 'cvId', 'coverLetterId'];
  const updateData = {};
  allowed.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });

  return await jsonStorage.update(APPLICATIONS_FILE, id, updateData);
}

async function deleteApplication(id) {
  return await jsonStorage.remove(APPLICATIONS_FILE, id);
}

async function getApplicationStats(userId) {
  const applications = await getApplicationsByUserId(userId);
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
    offered: applications.filter(a => a.status === 'offered').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    withdrawn: applications.filter(a => a.status === 'withdrawn').length
  };
  return stats;
}

module.exports = {
  getApplicationsByUserId,
  getApplicationById,
  getApplicationByUserAndJob,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats
};
