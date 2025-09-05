import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

const CourseTab = () => {
    const navigate = useNavigate();
    const params = useParams();
    const courseId = params.courseId;

    const {data:courseByIdData,isLoading:courseByIdLoading,refetch} = useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true});
    const [publishCourse] = usePublishCourseMutation();

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });
    const [previewThumbnail,setPreviewThumbnail] = useState('');

    useEffect(()=>{
        if(courseByIdData?.course){
            const course = courseByIdData?.course;
            setInput({
                courseTitle:course?.courseTitle,
                subTitle:course?.subTitle,
                description:course?.description,
                category: course?.category,
                courseLevel: course?.courseLevel,
                coursePrice: course?.coursePrice,
                courseThumbnail:course?.courseThumbnail
            });
        }
    },[courseByIdData]);

    console.log(input.description);
    const [editCourse,{data,isLoading,isSuccess,error}] = useEditCourseMutation();

    const changeEventHandler = (e) => {
        const { name, value } = e.target
        console.warn(name,value);
        setInput({ ...input, [name]: value });
    }
    const getSelectCategory = (value) =>{
        setInput({...input,category:value});
    }
    const getCourseLevel = (value) =>{
        setInput({...input,courseLevel:value});
    }
    const selectThumbnail = (e) =>{
        const file = e.target.files?.[0];
        if(file){
            setInput({...input,courseThumbnail:file});
            const fileReader = new FileReader();
            fileReader.onloadend = () =>  setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }
    const updateCourseHandler = async () =>{
        const formData = new FormData();
        formData.append("courseTitle",input.courseTitle);
        formData.append("subTitle",input.subTitle);
        formData.append("description",input.description);
        formData.append("category",input.category);
        formData.append("courseLevel",input.courseLevel);
        formData.append("coursePrice",input.coursePrice);
        formData.append("courseThumbnail",input.courseThumbnail);
        await editCourse({formData,courseId});
    }

    const publishStatusHandler = async(action) =>{
        try {
            const response = await publishCourse({courseId,query:action});
            if(response.data){
                refetch();
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to publish or unpublish course");
        }
    }

    useEffect(()=>{
        if(isSuccess){
            toast.success(data?.message || "Course update.");
        }
        if(error){
            toast.error(error?.data.message || "Failed to update course");
        }
    },[error,isSuccess]);

    if(courseByIdLoading) return <h1>Loading...</h1>

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>Make changes to your course here. Click Save when you're done.</CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button disabled={courseByIdData?.course.lectures.length === 0} onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished ? "false":"true")} variant={'outline'}>
                        {
                            courseByIdData?.course.isPublished ? "Unpublished" : "Published"
                        }
                    </Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Course Title</Label>
                        <Input type={'text'} value={input.courseTitle} onChange={changeEventHandler} name="courseTitle" placeholder="Ex. Fullstack Developer" />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input type={'text'} value={input.subTitle} onChange={changeEventHandler} name="subTitle" placeholder="Ex. Become a FullStack developer from zero to hero in 2 months" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor value={input.description} name="description" input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5'>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={getSelectCategory}>
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

                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={getCourseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Price in (INR)</Label>
                            <Input type="number" name="coursePrice" className={'w-fit'} value={input.coursePrice} onChange={changeEventHandler} placeholder="199"/>
                        </div>

                    </div>

                       <div>
                            <Label>Course Thumbnail</Label>
                            <Input type="file" onChange={selectThumbnail} accept="image/*" className={'w-fit'}/>
                            {
                                previewThumbnail && (
                                    <img src={previewThumbnail} className='w-64 my-2' alt="Course Thumbnail"/>
                                )
                            }
                        </div>

                        <Button onClick={()=>navigate("/admin/course")} variant={'outline'}>Cancel</Button>
                        <Button onClick={updateCourseHandler} className="ml-2" disabled={isLoading}>{
                            isLoading ? (<>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please wait
                            </>):(
                                "Save"
                            )
                        }</Button>
                </div>
            </CardContent>
        </Card>
    )
}
export default CourseTab