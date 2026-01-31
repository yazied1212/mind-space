import { User } from "../../db/models/user.js";
import { defaultPfpId, messages } from "../../utils/index.js";
import cloudinary from "../../utils/multer/cloud-config.js";

//get profile
export const profile = (req, res, next) => {

  const userExists = req.authUser;

  return res.status(200).json({
    success: true,
    data: userExists,
  });
};


//deactivate account
export const deactivate = async (req, res, next) => {
  const userExists = req.authUser;
  await User.findByIdAndUpdate(userExists._id, {
    isDeleted: true,
    deletedAt: Date.now(),
  });

  return res.status(200).json({
    success: true,
    message:
      "account deactivated successfully , it will get deleted automatically after 30 days",
  });
};

//update user
export const updateUser = async (req, res, next) => {
  const userExists = req.authUser;
  await User.findByIdAndUpdate(userExists._id, { ...req.body });

  return res.status(200).json({
    success: true,
    message: messages.user.updatedSuccessfully,
  });
};

export const upPfp = async (req, res, next) => {

  if (req.authUser.public_id != defaultPfpId) {
    await cloudinary.uploader.destroy(req.authUser.pfp.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `mind-space/users/${req.authUser._id}/pfp`,
    },
  );

  const pfp = await User.findByIdAndUpdate(req.authUser._id, {
    pfp: { secure_url, public_id },
  });

  return res.status(200).json({
    success: true,
    message: "profile picture uploaded successfully",
    data: pfp.pfp,
  });
};


