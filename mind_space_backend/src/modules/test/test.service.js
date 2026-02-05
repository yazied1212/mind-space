import { Answer } from "../../db/models/answers.js"
import { Question } from "../../db/models/questions.js"
import { Test } from "../../db/models/test.js"
import { AppError, messages, testStatus } from "../../utils/index.js"

export const createTest = async (req,res,next)=>{

    const {type}=req.params
    await Test.create({
        userId:req.authUser._id,
        type
    })

    const questions=await Question.find({
        type:type
    }).populate({
        path:"answers",
        select:"answer"
    })
    
    if(questions.length===0){
        return next(new AppError(messages.questions.notFound))
    }

    return res.status(201).json({
        success:true,
        message:messages.test.createdSuccessfully,
        data:questions
    })

}


export const testResult=async(req,res,next)=>{
    const{testId}=req.params
    const {submittedAnswers}=req.body
  

    const test=await Test.findById(testId)
    if(!test){
        return next(new AppError(messages.test.notFound,404))
    }

    const answers=await Answer.find({
        _id:{$in:submittedAnswers},
        isCorrect:true
    }).select("isCorrect")

    test.score=answers.length
    test.status=testStatus.completed
    await test.save()

    return res.status(200).json({
        success:true,
        data:{
            score:test.score
        }
    })


}