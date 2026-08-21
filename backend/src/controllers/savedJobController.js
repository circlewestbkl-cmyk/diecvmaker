const savedJobService = require('../services/savedJobService');
const jobService = require('../services/jobService');

// GET /api/saved-jobs
async function getSavedJobs(req, res, next) {
  try {
    const saved = await savedJobService.getSavedJobsByUserId(req.user.id);

    // Enrich with job details
    const enriched = await Promise.all(
      saved.map(async (s) => {
        const job = await jobService.getJobById(s.jobId);
        return {
          ...s,
          job: job || null
        };
      })
    );

    // Filter out entries where job no longer exists
    const valid = enriched.filter(s => s.job);

    res.json({
      success: true,
      data: valid,
      message: 'Saved jobs retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/saved-jobs
async function saveJob(req, res, next) {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    // Verify job exists
    const job = await jobService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const saved = await savedJobService.saveJob(req.user.id, jobId);
    res.status(201).json({
      success: true,
      data: saved,
      message: 'Job saved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/saved-jobs/:jobId
async function unsaveJob(req, res, next) {
  try {
    const removed = await savedJobService.unsaveJob(req.user.id, req.params.jobId);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Saved job not found' });
    }
    res.json({
      success: true,
      data: null,
      message: 'Job unsaved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/saved-jobs/check/:jobId
async function checkSaved(req, res, next) {
  try {
    const isSaved = await savedJobService.isJobSaved(req.user.id, req.params.jobId);
    res.json({
      success: true,
      data: { isSaved },
      message: 'Check completed'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSavedJobs, saveJob, unsaveJob, checkSaved };
