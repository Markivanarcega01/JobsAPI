const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;
  const job = await Job.findOne({ createdBy: userID, _id: jobID });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }
  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID; // etong req.user sa authentication
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
  //res.json({user:req.user,body:req.body})
};

const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
    body: { company, position },
  } = req;
  if (!company || !position) {
    throw new BadRequestError("Company and Position fields cannot be empty");
  }
  const job = await Job.findOneAndUpdate(
    { createdBy: userID, _id: jobID },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }
  res.status(StatusCodes.CREATED).json(job);
};

const softDelete = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID }
  } = req;
  const softDelete = await Job.findOneAndUpdate(
    { createdBy: userID, _id: jobID },
    req.body,
    { new: true }
  );
  res.status(StatusCodes.OK).json(softDelete);
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const deleteJob = await Job.findOneAndDelete({
    createdBy: userID,
    _id: jobID,
  });
  if (!deleteJob) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }
  res.status(StatusCodes.OK).json(deleteJob);
};
const deleteAllJobs = async (req, res) => {
  const {
    user: { userID },
  } = req;

  const deleteAllJobs = await Job.deleteMany({ createdBy: userID });

  if (!deleteAllJobs) {
    throw new NotFoundError(`No jobs remaining`);
  }
  res.status(StatusCodes.OK).json(deleteAllJobs);
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  deleteAllJobs,
  softDelete,
};
