import { OAuth2Client } from "google-auth-library";
import { OTP } from "../../db/models/otp.js";
import { User } from "../../db/models/user.js";
import { generateAndSendOtp } from "../../middlewares/index.js";
import { AppError, messages, provider, sendEmail, signToken, verifyToken } from "../../utils/index.js";
import bcrypt from "bcrypt"
import { getNewLoginCredentials, logoutEnum } from "../../utils/token/getNewCredentials.js";
import { TokenModel } from "../../db/models/token.js";

export const signUp = async (req, res, next) => {

  const { email, userName, password, gender, role ,age,specialty} = req.body;

  let secure_url, public_id;
   if(req.file){
  const result = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `mind-space/users/${email}/CV`}
  );
  
  secure_url = result.secure_url;
  public_id = result.public_id;
}

  
  const userData={
    userName,
    email,
    password,
    gender,
    role,
    age,
  }
  if(role==roles.therapist){
    userData.specialty=specialty,
    userData.cv={secure_url,public_id}
  }

  const createdUser = await User.create(userData);

    const token=signToken({payload:{id:createdUser._id},options:{expiresIn:"1m"}})
    const link=`http://localhost:3000/auth/activate-account/${token}`
    const isSent=await sendEmail({
        to:email,
        subject:"activate your account",
        html:`<p>to activate your account please click<a href=${link}>here</a></p>`
    })
    if(!isSent){
        return next(new AppError("fail to send email please try again"))
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
    return next(new AppError(error.message));
  }

  const user = await User.findByIdAndUpdate(id, { isConfirmed: true });
  if (!user) {
    return next(new AppError(messages.user.notFound,  404 ));
  }

  return res.status(200).json({
    success: true,
    message: "account activated successfully",
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(messages.user.invalidEorP, 401));
  }

  if (user.bannedUntil && user.bannedUntil < Date.now()) {
    user.bannedAt = undefined;
    user.bannedUntil = undefined;
    user.bannedBy = undefined;
    await user.save();
  }

  if (user.bannedUntil && user.bannedUntil > Date.now()) {
    return next(new AppError("your account is temporarily banned", 403));
  }
  
  if(user.role==roles.therapist&&user.cvStatus==cvStatuses.pending){
    return next(new AppError("please wait for CV verification"))
  }   

  if(user.cvStatus==cvStatuses.rejected){
    return next(new AppError("your cv got rejected",401))
  } 

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new AppError(messages.user.invalidEorP, 401));
  }

  if (user.isConfirmed === false) {
    return next(new AppError("please activate your account", 401));
  }

  if (user.isDeleted === true) {
    user.isDeleted = false;
    await user.save();
  }

  if (user.twoFA === true) {
    await generateAndSendOtp(user.email);
    return res.status(201).json({
      success: true,
      message: messages.otp.createdSuccessfully,
    });
  }

 const NewCredentials = await getNewLoginCredentials(user);

  return res.status(200).json({
    success: true,
    message: messages.user.login,
    data: NewCredentials,
  });
};

export const logout = async (req, res, next) => {
  const { flag } = req.body;

  switch (flag) {
    case logoutEnum.logoutFromAllDevices:
      await User.updateOne(
        { _id: req.authUser._id },
        {
          changeCredentialsTime: Date.now(),
        }
      );
      break;

    default:
      await TokenModel.create({
        jti: req.decoded.jti,
        userId: req.authUser._id,
        expiresAt: new Date(req.decoded.exp * 1000),
      });
      break;
  }

  return res.status(200).json({
    success: true,
    message: messages.user.logout,
  });
};
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  const { error, id, iat } = verifyToken(refreshToken);

  if (error) {
    return next(new AppError(error.message));
  }

  const user = await User.findById(id);
  if (user.lastPassUpdate && user.lastPassUpdate.getTime() > iat * 1000) {
    return next(new AppError("please log in again"));
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
  await generateAndSendOtp(email);

  return res.status(201).json({
    success: true,
    message: messages.otp.createdSuccessfully,
  });
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const otpMatch = await OTP.findOne({ email: email, otp: otp });
  if (!otpMatch) {
    return next(new AppError("invalid code",  400 ));
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
    return next(new AppError(messages.user.notFound,  404 ));
  }

  return res.status(200).json({
    success: true,
    message: "password updated successfully",
  });
};

//2fa
export const twoFaSendOtp = async (req, res, next) => {
  await generateAndSendOtp(req.authUser.email);
  return res.status(201).json({
    success: true,
    message: messages.otp.createdSuccessfully,
  });
};

export const enable2FA = async (req, res, next) => {
  const { otp } = req.body;
  const otpMatch = await OTP.findOne({ email: req.authUser.email, otp: otp });
  if (!otpMatch) {
    return next(new AppError("invalid code", 400 ));
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
    return next(new AppError("invalid code",  400 ));
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


export const Disable2Fa=async(req,res,next)=>{

  const {otp}=req.body

  const otpMatch = await OTP.findOne({ email: req.authUser.email, otp: otp });
  if (!otpMatch) {
    return next(new AppError("invalid code",  400 ));
  }

  await User.findByIdAndUpdate(req.authUser._id,{
    twoFA:false
  })


  return res.status(200).json({
    success:true,
    message:"2 step verification disabled successfully"
  })

}



// login with google
const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

export const googleLogin = async (req, res, next) => {
  const { idToken, role } = req.body;
  const { email, picture, name } = await verifyGoogleToken(idToken);

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      pfp: picture,
      userName: name,
      provider: provider.google,
      isConfirmed: true,
      role,
    });
  }

  if (user.bannedUntil && user.bannedUntil < Date.now()) {
    user.bannedAt = null;
    user.bannedUntil = null;
    await user.save();
  }

  if (user.bannedUntil && user.bannedUntil > Date.now()) {
    return next(new AppError("your account is temporarily banned", 403));
  }

  if (user.isDeleted === true) {
    user.isDeleted = false;
    await user.save();
  }

 const NewCredentials = await getNewLoginCredentials(user);

  return res.status(200).json({
    success: true,
    message: messages.user.login,
    data: NewCredentials,
  });
};