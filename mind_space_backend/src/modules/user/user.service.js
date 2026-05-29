import { Report } from "../../db/models/report.js";
import { Session } from "../../db/models/session.js";
import { User } from "../../db/models/user.js";
import { AppError, defaultPfpId, defaultPfpUrl, messages, roles } from "../../utils/index.js";
import cloudinary from "../../utils/multer/cloud-config.js";



//get profile
export const profile = async(req, res, next) => {

  const userExists = req.authUser.toObject();
  if(userExists.role==roles.therapist){

    const patients= await Session.distinct("userId",{therapistId: userExists._id,})
    
    userExists.patients=patients.length
  }

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

export const report=async(req,res,next)=>{

  const {id}=req.params
  const{reason,content}=req.body
  const report=await Report.create(
    {
      userId:req.authUser._id,
      reportedUserId:id,
      reason:reason,
      content:content
    }
  )

  res.status(201).json({
    success:true,
    message:messages.report.createdSuccessfully,
    data:report
  })

}



export const getTherapists=async(req,res,next)=>{

  let { page, size } = req.query;
    if (!page) {
     page = 1;
    }
    if (!size) {
        size = 20;
     }
    const skip = (page - 1) * size;

  const therapists=await User.find({role:roles.therapist},{_id:1,userName:1,pfp:1,experience:1,specialty:1},{limit:size,slip:skip})

  if(therapists.length===0){
    return next(new AppError(messages.therapist.notFound,404))
  }

  return res.status(200).json({
    success:true,
    data:therapists
  })
}



export const myPatients=async(req,res,next)=>{

   let { page, size } = req.query;
    if (!page) {
     page = 1;
    }
    if (!size) {
        size = 20;
     }
    const skip = (page - 1) * size;

   const patientsId= await Session.distinct("userId",{therapistId:req.authUser._id})

   if(patientsId.length===0){
    return next(new AppError(messages.patient.notFound,404))
   }

   const patients=await User.find({_id:{$in:patientsId}},{_id:1,userName:1,pfp:1})

  return res.status(200).json({
    success:true,
    data:patients
  })

}