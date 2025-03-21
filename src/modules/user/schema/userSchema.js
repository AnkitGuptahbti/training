import yup from "yup"


const userSignupSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(3).required(),
});

const userLoginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const resetPasswordSchema = yup.object({
  email: yup.string().email().required(),
  newPassword: yup.string().min(3).required(),
});

const changePasswordSchema = yup.object({
  oldPassword: yup.string().required(),
  newPassword: yup.string().min(6).required(),
});

export {
  userSignupSchema,
  userLoginSchema,
  resetPasswordSchema,
  changePasswordSchema,
}