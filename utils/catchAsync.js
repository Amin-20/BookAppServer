const upload=require('./upload')

exports.catchAsync=(fn)=>{
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
};



exports.catchAsyncWithFile = (fn) => {
  return (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return next(err);
      }
      fn(req, res, next).catch(next);
    });
  };
};