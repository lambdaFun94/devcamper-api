// @desc     Get all Bootcamps
// @route    GET /api/vi/bootcamps
// @access   Public
export const getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "show all bootcamps" });
};

// @desc     Get a single Bootcamp
// @route    GET /api/vi/bootcamps/:id
// @access   Public
export const getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `show bootcamp ${req.params.id}` });
};

// @desc     Create a new bootcamp
// @route    POST /api/vi/bootcamps
// @access   Private
export const createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "create new bootcamp" });
};

// @desc     Update bootcamp
// @route    PUT /api/vi/bootcamps/:id
// @access   Private
export const updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `update bootcamp ${req.params.id}` });
};

// @desc     Delete bootcamp
// @route    DELETE /api/vi/bootcamps/:id
// @access   Private
export const deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `delete bootcamp ${req.params.id}` });
};
