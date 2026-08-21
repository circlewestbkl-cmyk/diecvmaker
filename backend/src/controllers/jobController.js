const jobService = require('../services/jobService');

// GET /api/jobs
async function getJobs(req, res, next) {
  try {
    const jobs = await jobService.getAllJobs(req.query);
    res.json({
      success: true,
      data: jobs,
      message: 'Jobs retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/jobs/:id
async function getJob(req, res, next) {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({
      success: true,
      data: job,
      message: 'Job retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/jobs
async function createJob(req, res, next) {
  try {
    const job = await jobService.createJob({
      ...req.body,
      postedBy: req.user.id
    });
    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully'
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/jobs/:id
async function updateJob(req, res, next) {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    const updated = await jobService.updateJob(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Job updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/jobs/:id
async function deleteJob(req, res, next) {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    await jobService.deleteJob(req.params.id);
    res.json({
      success: true,
      data: null,
      message: 'Job deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };
