const applicationService = require('../services/applicationService');
const jobService = require('../services/jobService');

// GET /api/applications
async function getApplications(req, res, next) {
  try {
    const applications = await applicationService.getApplicationsByUserId(req.user.id);

    // Enrich with job details
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const job = await jobService.getJobById(app.jobId);
        return {
          ...app,
          job: job || { title: 'Unknown Job', company: 'Unknown' }
        };
      })
    );

    res.json({
      success: true,
      data: enriched,
      message: 'Applications retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/stats
async function getApplicationStats(req, res, next) {
  try {
    const stats = await applicationService.getApplicationStats(req.user.id);
    res.json({
      success: true,
      data: stats,
      message: 'Stats retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/:id
async function getApplication(req, res, next) {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const job = await jobService.getJobById(application.jobId);
    res.json({
      success: true,
      data: { ...application, job: job || null },
      message: 'Application retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/applications
async function createApplication(req, res, next) {
  try {
    // Verify job exists
    const job = await jobService.getJobById(req.body.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const application = await applicationService.createApplication(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: { ...application, job },
      message: 'Application submitted successfully'
    });
  } catch (err) {
    if (err.message === 'You have already applied to this job') {
      return res.status(409).json({ success: false, message: err.message });
    }
    next(err);
  }
}

// PATCH /api/applications/:id
async function updateApplication(req, res, next) {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updated = await applicationService.updateApplication(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Application updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/applications/:id
async function deleteApplication(req, res, next) {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await applicationService.deleteApplication(req.params.id);
    res.json({
      success: true,
      data: null,
      message: 'Application deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getApplications, getApplicationStats, getApplication, createApplication, updateApplication, deleteApplication };
