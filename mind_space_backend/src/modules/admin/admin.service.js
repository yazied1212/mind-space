import { Answer } from "../../db/models/answers.js"
import { Question } from "../../db/models/questions.js"
import { User } from "../../db/models/user.js"
import { AppError, messages } from "../../utils/index.js"

export const addQuestions=async(req,res,next)=>{

    const questionData= Array.isArray(req.body)?req.body:[req.body]

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
                isCorrect:currentQuestion.answers[j].isCorrect,
                questionId:questionId[i],
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
        select:"answer"})
    if(questions.length===0){
        return next(new AppError(messages.questions.notFound))
    }  
    
    return res.status(200).json({
        success:true,
        data:questions
    })
}


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

    const {id}=req.body
    const {question}=req.body

    const q=await Question.findByIdAndUpdate(id,{
       question:question 
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

    const {id}=req.body
    const {answer}=req.body

    const q=await Answer.findByIdAndUpdate(id,{
       answer:answer 
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