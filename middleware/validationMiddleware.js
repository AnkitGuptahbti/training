import { TryCatch, ErrorHandler } from "../utilty/utility.js";

 const validate = (schema) =>
  TryCatch(async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      console.log("first")
      return next(new ErrorHandler(err.errors.join(", "), 400));
    }
  });
  export default validate;
