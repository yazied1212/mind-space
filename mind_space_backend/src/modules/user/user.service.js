import { User } from "../../db/models/user.js";
import { defaultPfpId, defaultPfpUrl, messages } from "../../utils/index.js";
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

//(ban user)freeze account

export const freezeACcount =async (req,res,next)=>{

    const {userId} = req.params;
    
    if(userId && req.authUser.role !== "admin")
        return next(new AppError("you are not authorized to freeze this account",403))


const updatedUser = await User.findOneAndUpdate(
  { _id: userId, deletedAt: { $exists: false } },
  {  
    freezedAt: Date.now(),
    freezedBy: req.authUser._id
  },
  { new: true }
);
return res.status(200).json({
    success: true,
    message: "account frozen successfully",
    data:updateUser ,
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


export const resetPfp= async(req,res,next)=>{

  if(req.authUser.pfp.secure_id==defaultPfpId){
    return next(new AppError(messages.pfp.notFound,404))
  }

  await cloudinary.uploader.destroy(req.authUser.pfp.public_id);

  await User.findByIdAndUpdate(req.authUser._id,{
    pfp:{secure_url:defaultPfpUrl,public_id:defaultPfpId}
  })

  return res.status(200).json({
    success:true,
    message:messages.pfp.deletedSuccessfully
  })
}


