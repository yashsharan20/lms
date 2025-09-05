import Stripe from "stripe"
import {Course} from "../models/course.model.js"
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import User from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async(req,res)=>{
    try {
        const userId = req.id 
        const {courseId} = req.body.courseId
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        } 
        const newPurchase = new CoursePurchase({
            courseId,
            userId,
            amount:course.coursePrice,
            status:"pending"
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[
                {
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name:course.courseTitle,
                            images:[course.courseThumbnail]
                        },
                        unit_amount:course.coursePrice * 100
                    },
                    quantity:1
                }
            ],
            mode:"payment",
            success_url:`http://localhost:5173/course-progress/${courseId}`,
            cancel_url:`http://localhost:5173/course-detail/${courseId}`,
            metadata:{
                courseId:courseId,
                userId:userId,
            },
            shipping_address_collection:{
                allowed_countries:["IN"],
            }
        });
        if(!session.url){
            return res.status(400).json({
                success:false,
                message:"Error while creating session"
            });
        }
        newPurchase.paymentId = session.id 
        await newPurchase.save();

        return res.status(200).json({
            success:true,
            url:session.url
        });
    } catch (error) {
        console.log(error);
    }
}

export const webhook = async (req,res)=>{
    let event;
    try {
        const payloadString = JSON.stringify(req.body,null,2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload:payloadString,
            secret 
        });
        event = stripe.webhooks.constructEvent(payloadString,header,secret);
    } catch (error) {
        console.log("Webhook error",error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }
    if(event.type === "checkout.session.completed"){
        try {
            const session = event.data.object 

            const purchase = await CoursePurchase.findOne({
                paymentId:session.id
            }).populate({path:"courseId"});

            if(!purchase){
                return res.status(404).json({message:"Purchase not found"});
            }
            if(session.amount_total){
                purchase.amount = session.amount_total/100;
            }
            purchase.status = "completed";
            if(purchase.courseId && purchase.courseId.lectures.length > 0){
                await Lecture.updateMany(
                    {_id:{$in:purchase.courseId.lectures}},
                    {$set:{isPreviewFree:true}}
                );
            }
            await purchase.save();
            await User.findByIdAndUpdate(
                purchase.userId,
                {$addToSet:{enrolledCourses:purchase.courseId._id}},
                {new:true}
            );

    
            console.log( purchase.courseId._id);
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                {$addToSet:{enrolledStudent:purchase.userId}},
                {new:true}
            );
            
        } catch (error) {
            console.error("Error handling event:",error);
            return res.status(500).json({
                message:"Internal Server Error"
            });
        }
    }
}

export const getCourseDetailWithPurchaseStatus = async(req,res)=>{
    try {
        const {courseId} = req.params 
        const userId = req.id 
        const course = await Course.findById(courseId).populate({path:'creator'}).populate({
            path:'lectures'
        });
        const purchased = await CoursePurchase.findOne({userId,courseId});
        if(!course){
            return res.status(404).json({
                message:"course not found"
            });
        }
        return res.status(200).json({
            course,
            purchased:!!purchased
        });
    } catch (error) {
        console.log(error);
    }
}
export const getAllPurchasedCourse = async (_,res) =>{
    try {
        const purchasedCourse = await CoursePurchase.find({status:'completed'}).populate("courseId").populate("userId");
        if(!purchasedCourse){
            return res.status(404).json({
                purchasedCourses:[]
            });
        }
        return res.status(200).json({
            purchasedCourse
        });
    } catch (error) {
        console.log(error);
    }
}