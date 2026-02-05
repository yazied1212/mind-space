import { Answer } from "../../db/models/answers.js"
import { Question } from "../../db/models/questions.js"
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
        return next(new AppError(messages.questions.notFound))
    }

    await Answer.deleteMany({questionId:id})

    return res.status(200).json({
        success:true,
        message:messages.questions.deletedSuccessfully
    })
}
