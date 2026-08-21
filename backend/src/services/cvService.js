const jsonStorage = require('./jsonStorageService');

const CVS_FILE = 'cvs.json';

async function getCvsByUserId(userId) {
  return await jsonStorage.findMany(CVS_FILE, cv => cv.userId === userId);
}

async function getCvById(id) {
  return await jsonStorage.findById(CVS_FILE, id);
}

async function createCv(userId, data) {
  return await jsonStorage.create(CVS_FILE, {
    userId,
    title: data.title || 'Untitled CV',
    templateId: data.templateId || 'tpl_classic',
    personal: data.personal || {},
    summary: data.summary || '',
    experiences: data.experiences || [],
    education: data.education || [],
    skills: data.skills || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    achievements: data.achievements || [],
    organizations: data.organizations || [],
    customSections: data.customSections || [],
    isPublic: data.isPublic || false
  }, 'cv');
}

async function updateCv(id, data) {
  const existing = await jsonStorage.findById(CVS_FILE, id);
  if (!existing) return null;

  // Only allow updating certain fields
  const allowed = [
    'title', 'templateId', 'personal', 'summary',
    'experiences', 'education', 'skills', 'projects',
    'certifications', 'languages', 'achievements',
    'organizations', 'customSections', 'isPublic'
  ];
  const updateData = {};
  allowed.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });

  return await jsonStorage.update(CVS_FILE, id, updateData);
}

async function deleteCv(id) {
  return await jsonStorage.remove(CVS_FILE, id);
}

async function duplicateCv(id, userId) {
  const original = await jsonStorage.findById(CVS_FILE, id);
  if (!original) return null;

  const { id: _, createdAt, updatedAt, ...rest } = original;
  return await jsonStorage.create(CVS_FILE, {
    ...rest,
    userId,
    title: `${original.title} (Copy)`,
    experiences: (original.experiences || []).map(e => ({ ...e })),
    education: (original.education || []).map(e => ({ ...e })),
    skills: (original.skills || []).map(s => ({ ...s })),
    projects: (original.projects || []).map(p => ({ ...p })),
    certifications: (original.certifications || []).map(c => ({ ...c })),
    languages: (original.languages || []).map(l => ({ ...l })),
    achievements: (original.achievements || []).map(a => ({ ...a })),
  }, 'cv');
}

module.exports = {
  getCvsByUserId,
  getCvById,
  createCv,
  updateCv,
  deleteCv,
  duplicateCv
};
