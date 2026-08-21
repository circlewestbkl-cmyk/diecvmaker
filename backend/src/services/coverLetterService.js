const jsonStorage = require('./jsonStorageService');

const COVER_LETTERS_FILE = 'cover-letters.json';

async function getCoverLettersByUserId(userId) {
  return await jsonStorage.findMany(COVER_LETTERS_FILE, cl => cl.userId === userId);
}

async function getCoverLetterById(id) {
  return await jsonStorage.findById(COVER_LETTERS_FILE, id);
}

async function createCoverLetter(userId, data) {
  return await jsonStorage.create(COVER_LETTERS_FILE, {
    userId,
    title: data.title || 'Untitled Cover Letter',
    companyName: data.companyName || '',
    position: data.position || '',
    jobDescription: data.jobDescription || '',
    content: data.content || '',
    cvId: data.cvId || null,
    isGenerated: data.isGenerated || false
  }, 'cl');
}

async function updateCoverLetter(id, data) {
  const existing = await jsonStorage.findById(COVER_LETTERS_FILE, id);
  if (!existing) return null;

  const allowed = ['title', 'companyName', 'position', 'jobDescription', 'content', 'cvId', 'isGenerated'];
  const updateData = {};
  allowed.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });

  return await jsonStorage.update(COVER_LETTERS_FILE, id, updateData);
}

async function deleteCoverLetter(id) {
  return await jsonStorage.remove(COVER_LETTERS_FILE, id);
}

module.exports = {
  getCoverLettersByUserId,
  getCoverLetterById,
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter
};
