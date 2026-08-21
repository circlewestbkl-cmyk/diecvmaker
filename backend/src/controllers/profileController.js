const profileService = require('../services/profileService');

// GET /api/profile
async function getProfile(req, res, next) {
  try {
    const profile = await profileService.getProfile(req.user.id);
    res.json({
      success: true,
      data: profile || {},
      message: 'Profile retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/profile
async function updateProfile(req, res, next) {
  try {
    const { fullName, professionalTitle, phone, location, website, linkedin, github, bio } = req.body;

    const profile = await profileService.createOrUpdateProfile(req.user.id, {
      fullName,
      professionalTitle,
      phone,
      location,
      website,
      linkedin,
      github,
      bio
    });

    res.json({
      success: true,
      data: profile,
      message: 'Profile updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/profile/avatar
async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const profile = await profileService.createOrUpdateProfile(req.user.id, { avatar: avatarUrl });

    res.json({
      success: true,
      data: { avatar: avatarUrl },
      message: 'Avatar uploaded successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, uploadAvatar };
