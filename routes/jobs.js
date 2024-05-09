const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  deleteAllJobs,
  softDelete
} = require("../controllers/jobs");

router.route('/').get(getAllJobs).post(createJob).delete(deleteAllJobs)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)
router.route('/soft/:id').patch(softDelete)
module.exports = router
