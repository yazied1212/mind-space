import { Types } from "mongoose"
import { Answer } from "../../db/models/answers.js"
import { Question } from "../../db/models/questions.js"
import { Test } from "../../db/models/test.js"
import { AppError, messages, questionsNumber, testStatus } from "../../utils/index.js"

export const createTest = async (req,res,next)=>{

    const {type}=req.params
    const test=await Test.create({
        userId:req.authUser._id,
        type
    })

    const questions=await Question.find({
        type:type
    })
    .select("-createdAt -updatedAt")
    .populate({
        path:"answers",
        select:"answer -questionId"
    })
    
    if(questions.length===0){
        return next(new AppError(messages.questions.notFound))
    }

    return res.status(201).json({
        success:true,
        message:messages.test.createdSuccessfully,
        data:[
            {testId:test._id},
            questions
        ]
    })

}


export const testResult=async(req,res,next)=>{
    const{testId}=req.params
    const {submittedAnswers}=req.body
  

    const test=await Test.findById(testId)
    if(!test){
        return next(new AppError(messages.test.notFound,404))
    }

    const answers=await Answer.aggregate([
        {$match:{_id:{$in:submittedAnswers.map(id => new Types.ObjectId(id))}}},
        { $group: { _id: null, totalScore: { $sum: "$points" }}}
    ])

    if(answers.length===0/*||answers.length!=questionsNumber*/){
        return next(new AppError("please answer every question"))
    }

    test.score=answers[0].totalScore
    test.status=testStatus.completed
    await test.save()
    

    return res.status(200).json({
        success:true,
        data:{
            score:test.score
        }
    })


}