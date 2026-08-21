const jsonStorage = require('./jsonStorageService');

const SAVED_JOBS_FILE = 'saved-jobs.json';

async function getSavedJobsByUserId(userId) {
  const saved = await jsonStorage.findMany(SAVED_JOBS_FILE, s => s.userId === userId);
  saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return saved;
}

async function getSavedJobById(id) {
  return await jsonStorage.findById(SAVED_JOBS_FILE, id);
}

async function getSavedJobByUserAndJob(userId, jobId) {
  return await jsonStorage.findOne(SAVED_JOBS_FILE, s => s.userId === userId && s.jobId === jobId);
}

async function saveJob(userId, jobId) {
  const existing = await getSavedJobByUserAndJob(userId, jobId);
  if (existing) {
    return existing; // Already saved
  }

  return await jsonStorage.create(SAVED_JOBS_FILE, {
    userId,
    jobId
  }, 'saved');
}

async function unsaveJob(userId, jobId) {
  const existing = await getSavedJobByUserAndJob(userId, jobId);
  if (!existing) return null;

  return await jsonStorage.remove(SAVED_JOBS_FILE, existing.id);
}

async function isJobSaved(userId, jobId) {
  const saved = await getSavedJobByUserAndJob(userId, jobId);
  return !!saved;
}

module.exports = {
  getSavedJobsByUserId,
  getSavedJobById,
  getSavedJobByUserAndJob,
  saveJob,
  unsaveJob,
  isJobSaved
};
