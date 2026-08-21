const jsonStorage = require('./jsonStorageService');

const PROFILES_FILE = 'profiles.json';

async function getProfile(userId) {
  return await jsonStorage.findOne(PROFILES_FILE, p => p.userId === userId);
}

async function createOrUpdateProfile(userId, data) {
  const existing = await getProfile(userId);
  if (existing) {
    return await jsonStorage.update(PROFILES_FILE, existing.id, { ...data, userId });
  }
  return await jsonStorage.create(PROFILES_FILE, { ...data, userId }, 'profile');
}

module.exports = { getProfile, createOrUpdateProfile };
