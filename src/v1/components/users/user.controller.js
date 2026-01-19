const User = require("./user.model");
const catchAsync = require('../../../utils/catchAsync');
const AppError = require('../../../utils/appError');


exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
}); 

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});


exports.updateUserRole = catchAsync(async (req, res, next) => {

  const { role } = req.body;

  // 1) Validate role
  if (!['user', 'admin'].includes(role)) {
    return next(new AppError('Role must be either user or admin', 400));
  }
  console.log(req.body.id);
  // 2) Find user
  const user = await User.findById(req.body.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // 3) Update role
  user.role = role;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});