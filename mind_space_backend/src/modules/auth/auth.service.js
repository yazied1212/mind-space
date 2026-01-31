import { OTP } from "../../db/models/otp.js";
import { User } from "../../db/models/user.js";
import { generateAndSendOtp } from "../../middlewares/otp.js";
import { messages, sendEmail, signToken, verifyToken } from "../../utils/index.js";
import bcrypt from "bcrypt"

export const signUp = async (req, res, next) => {

  const { email, userName, password, gender, role ,age} = req.body;

  const createdUser = await User.create({
    userName,
    email,
    password,
    gender,
    role,
    age
  });
  

    const token=signToken({payload:{id:createdUser._id},options:{expiresIn:"1m"}})
    const link=`http://localhost:3000/auth/activate-account/${token}`
    const isSent=await sendEmail({
        to:email,
        subject:"activate your account",
        html:`<p>to activate your account please click<a href=${link}>here</a></p>`
    })
    if(!isSent){
        return next(new Error("fail to send email please try again"))
    }

  //res
  return res.status(201).json({
    success: true,
    message: messages.user.createdSuccessfully,
    data:createdUser,
  });
};


export const activateAccount = async (req, res, next) => {
  const token = req.params.token;
  const { id, error } = verifyToken(token);
  if (error) {
    return next(new Error(error.message));
  }

  const user = await User.findByIdAndUpdate(id, { isConfirmed: true });
  if (!user) {
    return next(new Error(messages.user.notFound, { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "account activated successfully",
  });
};



export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const emailExists = await User.findOne({ email: email });
  if (!emailExists) {
    return next(new Error(messages.user.invalidEorP, { cause: 401 }));
  }

  const match = bcrypt.compareSync(password, emailExists.password);
  if (!match) {
    return next(new Error(messages.user.invalidEorP, { cause: 401 }));
  }

  if(emailExists.isConfirmed===false){
        return next(new Error("please activate your account",{cause:401}))
    }

  if (emailExists.isDeleted === true) {
    emailExists.isDeleted = false;
    await emailExists.save();
  }

  if (emailExists.twoFA === true) {
    generateAndSendOtp(emailExists.email);
    return res.status(201).json({
      success: true,
      message: messages.otp.createdSuccessfully,
    });
  }

  const accessToken = signToken({
    payload: { id: emailExists._id },
    options: { expiresIn: "1h" },
  });
  const refreshToken = signToken({
    payload: { id: emailExists._id },
    options: { expiresIn: "1y" },
  });

  return res.status(200).json({
    success: true,
    message: messages.user.login,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};


export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  const { error, id, iat } = verifyToken(refreshToken);

  if (error) {
    return next(new Error(error.message));
  }

  const user = await User.findById(id);
  if (user.lastPassUpdate && user.lastPassUpdate.getTime() > iat * 1000) {
    return next(new Error("please log in again"));
  }

  const accessToken = signToken({
    payload: { id: id },
    options: { expiresIn: "1h" },
  });

  return res.status(201).json({
    success: true,
    accessToken: accessToken,
  });
};

//verify otp and forget password

//send otp
export const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  generateAndSendOtp(email);

  return res.status(201).json({
    success: true,
    message: messages.otp.createdSuccessfully,
  });
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const otpMatch = await OTP.findOne({ email: email, otp: otp });
  if (!otpMatch) {
    return next(new Error("invalid code", { cause: 400 }));
  }

  return res.status(200).json({
    success: true,
    message: "otp verified successfully",
  });
};

export const forgetPassword = async (req, res, next) => {
  const { newPassword, email } = req.body;

  const user = await User.findOneAndUpdate(
    { email: email },
    { password: newPassword },
  );
  if (!user) {
    return next(new Error(messages.user.notFound, { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "password updated successfully",
  });
};

//2fa
export const twoFaSendOtp = async (req, res, next) => {
  generateAndSendOtp(req.authUser.email);
  return res.status(201).json({
    success: true,
    message: messages.otp.createdSuccessfully,
  });
};

export const enable2FA = async (req, res, next) => {
  const { otp } = req.body;
  const otpMatch = await OTP.findOne({ email: req.authUser.email, otp: otp });
  if (!otpMatch) {
    return next(new Error("invalid code", { cause: 400 }));
  }

  const user = req.authUser;

  user.twoFA = true;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "2 step verification enabled successfully",
  });
};

//verify login otp
export const twoFaLogin = async (req, res, next) => {
  const { otp, email } = req.body;
  const otpMatch = await OTP.findOne({ email: email, otp: otp });
  if (!otpMatch) {
    return next(new Error("invalid code", { cause: 400 }));
  }

  const emailExists = await User.findOne({ email: email });
  const accessToken = signToken({
    payload: { id: emailExists._id },
    options: { expiresIn: "1h" },
  });
  const refreshToken = signToken({
    payload: { id: emailExists._id },
    options: { expiresIn: "1y" },
  });

  return res.status(200).json({
    success: true,
    message: messages.user.login,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};
