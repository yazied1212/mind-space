import { Answer } from "../../db/models/answers.js"
import { Question } from "../../db/models/questions.js"
import { Report } from "../../db/models/report.js"
import { User } from "../../db/models/user.js"
import { AppError, cvStatuses, messages, sendEmail } from "../../utils/index.js"
import { SG } from "../../db/models/support_group.js"

export const addQuestions=async(req,res,next)=>{

    const questionData=req.body.questions

    const questions=questionData.map(q=>({
        question:q.question,
        type:q.type
    }))

    const createdQuestions=await Question.insertMany(questions)
    

    const answersToInsert=[]
    for(let i=0;i<createdQuestions.length;i++){

        const questionId=createdQuestions[i]._id
        const currentQuestion=questionData[i]

        for(let j=0;j<currentQuestion.answers.length;j++){

            answersToInsert.push({
                answer:currentQuestion.answers[j].answer,
                points:currentQuestion.answers[j].points,
                questionId:questionId,
            })
        }

    }

    await Answer.insertMany(answersToInsert) 

    return res.status(201).json({
        success:true,
        message:messages.questions.createdSuccessfully
    })
}

export const viewQuestions=async (req,res,next)=>{

    const questions=await Question.find().populate(
        {path:"answers",
        select:"answer -questionId"})
    if(questions.length===0){
        return next(new AppError(messages.questions.notFound))
    }  
    
    return res.status(200).json({
        success:true,
        data:questions
    })
}

// (ban user) ban account

export const BanAccount = async (req, res, next) => {
  const { id } = req.params;
  const { duration } = req.body;

  if (req.authUser.role !== "admin") {
    return next(
      new AppError("you are not authorized to ban this account", 403)
    );
  }

    const bannedUntil = new Date(
    Date.now() + duration * 24 * 60 * 60 * 1000
  );

  const updatedUser = await User.findOneAndUpdate(
    { _id: id, deletedAt: { $exists: false } },
    {
      bannedAt: Date.now(),
      bannedUntil,
      bannedBy: req.authUser._id,
    },
    { new: true }
  );

  if (!updatedUser) {
    return next(new AppError("user not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: `account banned for ${duration} days`,
    data: updatedUser,
  });
};

export const UnBanAccount = async (req, res, next) => {
  const { id } = req.params;
  if (req.authUser.role !== "admin") {
    return next(
      new AppError("you are not authorized to unban this account", 403)
    );
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: id, deletedAt: { $exists: false } },
    {
    $unset: {
      bannedAt: 1,
      bannedUntil: 1,
      bannedBy: 1,
    },
  },
  { new: true }
);

  if (!updatedUser) {
    return next(new AppError("user not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Account unbanned successfully",
    data: updatedUser,
  });
};


export const deleteQuestion=async(req,res,next)=>{

    const{id}=req.params
    const question=await Question.findByIdAndDelete(id)

    if(!question){
        return next(new AppError(messages.question.notFound))
    }

    await Answer.deleteMany({questionId:id})

    return res.status(200).json({
        success:true,
        message:messages.question.deletedSuccessfully
    })
}


export const updateQuestion=async(req,res,next)=>{

    const {id}=req.params
    const {question,type}=req.body

    const q=await Question.findByIdAndUpdate(id,{
       question:question,
       type:type
    })
    if(!q){
        return next(new AppError(messages.question.notFound,404))
    }
    
    
    return res.status(200).json({
        success:true,
        message:messages.question.updatedSuccessfully
    })

}

export const updateAnswer=async(req,res,next)=>{

    const {id}=req.params
    const {answer,points}=req.body

    const q=await Answer.findByIdAndUpdate(id,{
       answer:answer,
       points:points
    })
    if(!q){
        return next(new AppError(messages.answer.notFound,404))
    }
    
    
    return res.status(200).json({
        success:true,
        message:messages.answer.updatedSuccessfully
    })

}


export const viewUsers=async(req,res,next)=>{

    let { page, size } = req.query;
    if (!page) {
     page = 1;
    }
    if (!size) {
        size = 20;
     }
    const skip = (page - 1) * size;

    const users=await User.find({},{userName:1,email:1},{limit:size,slip:skip})
    
    if(users.length===0){
        return next(new AppError(messages.users.notFound,404))
    }

    return res.status(200).json({
        success:true,
        data:users
    })
}


export const viewCVs= async(req,res,next)=>{

  const data= await User.find({
    cv:{$exists:true},
    cvStatus:cvStatuses.pending
  },{cv:1})

  if(data.length===0){
    return next(new AppError("no cv found",404))
  }

  return res.status(200).json({
    success:true,
    data:data
  })

}

export const judgeCV= async(req,res,next)=>{

  const{id}=req.params
  const{decision}=req.body

  const user=await User.findByIdAndUpdate(id,{
    cvStatus:decision
  })

  if(!user){
    return next(new AppError(messages.user.notFound))
  }
  

    const isSent=await sendEmail({
            to:user.email,
            subject:"cv",
            html:`<p>your cv got ${decision}</a></p>`
        })
        if(!isSent){
            return next(new AppError("fail to send email please try again"))
        }
  

  return res.status(200).json({
    success:true,
    message:`the cv is ${decision}`
  })


  

}

export const viewReports=async(req,res,next)=>{

  let { page, size } = req.query;
    if (!page) {
     page = 1;
    }
    if (!size) {
        size = 20;
     }
    const skip = (page - 1) * size;


    const reports=await Report.find({},{createdAt:0,updatedAt:0},{limit:size,slip:skip})

    if(reports.length==0){
      res.status(404).json({
        success:false,
        message:messages.report.notFound
      })
    }

    res.status(200).json({
      success:true,
      data:reports
    })
}

