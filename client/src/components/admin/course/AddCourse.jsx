import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () =>{
    const navigate = useNavigate();
    const [courseTitle,setCourseTitle] = useState("");
    const [category,setCategory] = useState("");

    const [createCourse,{data,error,isSuccess,isLoading}] = useCreateCourseMutation();

    const createCourseHandler = async() =>{
        await createCourse({courseTitle,category});
    }

    useEffect(()=>{
        if(isSuccess){
            toast.success(data?.message || "Course created.");
            navigate('/admin/course');
        }
        if(error){
            toast.error(data?.message);
        }
    },[isSuccess,error])

    const getSelecteCategory = (value) =>{
        setCategory(value);
    }

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">Lets add course, add some basic course details from your new course</h1>
                <p className="text-sm">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, temporibus.</p>
            </div>
            <div className="space-y-4">
                <div>   
                    <Label>Title</Label>
                    <Input type="text" onChange={(e)=>setCourseTitle(e.target.value)} name="courseTitle" placeholder="Your course name"/>
                </div>
                 <div>   
                    <Label>Category</Label>
                       <Select onValueChange={getSelecteCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            <SelectItem value="Next JS">Next JS</SelectItem>
                            <SelectItem value="Data Science">Data Science</SelectItem>
                            <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                            <SelectItem value="FullStack Development">FullStack Development</SelectItem>
                            <SelectItem value="Backend Development">Backend Development</SelectItem>
                            <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                            <SelectItem value="Javascript">Javascript</SelectItem>
                            <SelectItem value="Python">Python</SelectItem>
                            <SelectItem value="Docker">Docker</SelectItem>
                            <SelectItem value="MongoDB">MongoDB</SelectItem>
                            <SelectItem value="HTML">HTML</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                </div>
                <div className="gap-2 flex items-center"> 
                    <Button onClick={()=>navigate('/admin/course')} variant="outline">Back</Button>
                    <Button onClick={createCourseHandler} diasabled={isLoading}>{
                        isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                            </>):(
                                "Create"
                            )
                        }</Button>
                </div>
            </div>
        </div>
    )
}
export default AddCourse