const cvService = require('../services/cvService');
const { generatePdf } = require('../services/pdfService');
const profileService = require('../services/profileService');

// GET /api/cvs
async function getCvs(req, res, next) {
  try {
    const cvs = await cvService.getCvsByUserId(req.user.id);
    res.json({
      success: true,
      data: cvs,
      message: 'CVs retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/cvs
async function createCv(req, res, next) {
  try {
    const cv = await cvService.createCv(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: cv,
      message: 'CV created successfully'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/cvs/:id
async function getCv(req, res, next) {
  try {
    const cv = await cvService.getCvById(req.params.id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    if (cv.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({
      success: true,
      data: cv,
      message: 'CV retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cvs/:id
async function updateCv(req, res, next) {
  try {
    const cv = await cvService.getCvById(req.params.id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    if (cv.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const updated = await cvService.updateCv(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'CV updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cvs/:id
async function deleteCv(req, res, next) {
  try {
    const cv = await cvService.getCvById(req.params.id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    if (cv.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    await cvService.deleteCv(req.params.id);
    res.json({
      success: true,
      data: null,
      message: 'CV deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/cvs/:id/duplicate
async function duplicateCv(req, res, next) {
  try {
    const cv = await cvService.getCvById(req.params.id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    if (cv.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const duplicated = await cvService.duplicateCv(req.params.id, req.user.id);
    res.status(201).json({
      success: true,
      data: duplicated,
      message: 'CV duplicated successfully'
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cvs/:id/public
async function togglePublic(req, res, next) {
  try {
    const cv = await cvService.getCvById(req.params.id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    if (cv.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const updated = await cvService.updateCv(req.params.id, { isPublic: req.body.isPublic });
    res.json({
      success: true,
      data: updated,
      message: 'CV visibility updated'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/cvs/:id/pdf
async function downloadPdf(req, res, next) {
  try {
    const cv = await cvService.getCvById(req.params.id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }
    if (cv.userId !== req.user.id && !cv.isPublic) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Merge profile data into personal if empty
    if (!cv.personal?.fullName) {
      const profile = await profileService.getProfile(cv.userId);
      if (profile) {
        cv.personal = {
          fullName: profile.fullName || cv.personal?.fullName || '',
          professionalTitle: profile.professionalTitle || cv.personal?.professionalTitle || '',
          email: cv.personal?.email || '',
          phone: profile.phone || cv.personal?.phone || '',
          location: profile.location || cv.personal?.location || '',
          website: profile.website || cv.personal?.website || '',
          linkedin: profile.linkedin || cv.personal?.linkedin || '',
          github: profile.github || cv.personal?.github || ''
        };
      }
    }

    const pdfBuffer = await generatePdf(cv);
    const safeName = (cv.personal?.fullName || 'CV').replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_');
    const fileName = `CV-${safeName}.pdf`;
    const encodedFileName = encodeURIComponent(fileName);

    // Set proper headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Send the buffer directly
    res.end(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err.message);
    next(err);
  }
}

module.exports = { getCvs, createCv, getCv, updateCv, deleteCv, duplicateCv, togglePublic, downloadPdf };
