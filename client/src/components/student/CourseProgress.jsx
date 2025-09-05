import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardTitle } from '../ui/card'
import { CheckCircle, CirclePlay } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useCompleteCourseMutation, useGetCourseProgressQuery, useIncompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const CourseProgress = () => {
    const isCompleted = true
    const params = useParams()
    const {courseId} = params

    const [completeCourse,{data:markCompleteData,isSuccess:completedSuccess}] = useCompleteCourseMutation()
    const [incompleteCourse,{data:markInCompleteData,isSuccess:incompleteSuccess}] = useIncompleteCourseMutation()
    const {data,isLoading,isError,refetch} = useGetCourseProgressQuery(courseId)
    const [updateLectureProgress] = useUpdateLectureProgressMutation()

    const [currentLecture,setCurrentLecture] = useState(null);

    useEffect(() => {
        if (completedSuccess) {
            toast.success(markCompleteData.message);
        }
        if (incompleteSuccess) {
            toast.success(markInCompleteData.message);
        }
        refetch();
    }, [completedSuccess, incompleteSuccess]);

    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Failed to load course details</p> 

    const {completed,courseDetails,progress} = data.data
    const {courseTitle} = courseDetails
        console.log(courseDetails);

    const initialLecture = currentLecture || courseDetails.lectures && courseDetails.lectures[0];
    console.warn(initialLecture); 

    const isLectureCompleted = (lectureId) =>{
        return progress.some((prog)=>prog.lectureId === lectureId && prog.viewed)
    }


    const handleLectureProgress = async (lectureId) =>{
        try {
            await updateLectureProgress({courseId,lectureId});
            refetch(); 
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectLecture = async(lecture) =>{
        setCurrentLecture(lecture);
        await handleLectureProgress(lecture?._id);
    }

    const handleCompleteCourse = async (courseId) =>{
        console.warn(courseId);
        await completeCourse(courseId)
    }

    const handleInompleteCourse = async (courseId) =>{
        await incompleteCourse(courseId)
    }

    return (
        <div className='max-w-7xl mx-auto p-4'>
            <div className="flex justify-between mb-4">
                <h1 className='text-2xl font-bold'>{courseTitle}</h1>
                <Button onClick={ ()=>completed ? handleInompleteCourse(courseId) : handleCompleteCourse(courseId)} variant={completed ? "outline":"default"}>
                   {completed ? <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span></div> : <div> <span>Mark as completed</span></div>}  
                </Button>
            </div>

            <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
                    <div>
                        <video onPlay={()=>handleLectureProgress(currentLecture?._id || initialLecture._id)} src={currentLecture?.videoUrl || initialLecture.videoUrl} className='w-full h-auto md:rounded-lg' controls />
                    </div>
                    <div className='mt-2'>
                        <h3 className='font-medium text-lg'>{`Lecture-${courseDetails.lectures.findIndex((lecture)=>lecture._id === (currentLecture?._id || initialLecture._id) )+1}: ${initialLecture?.lectureTitle || currentLecture?.lectureTitle}`}</h3>
                    </div>
                </div>
                <div className='flex flex-col w-full md:w-2/5 border-t md:pl-3 md:border-t-0 md:border-l border-gray-200'>
                    <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
                    <div className='flex-1 overflow-y-auto'>
                        {
                            courseDetails?.lectures.map((lecture)=>(
                                <Card onClick={()=>handleSelectLecture(lecture)} key={lecture?._id} className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id ? 'bg-gray-200 dark:dark-bg-gray-800':''}`}>
                                    <CardContent className={'flex items-center justify-between'}>
                                        <div className='flex items-center'>
                                        {
                                            isLectureCompleted(lecture._id)?(<CheckCircle size={24} className='text-green-500 mr-2'/>):(
                                                <CirclePlay size={24} className="text-gray-500 mr-2"/>
                                            )
                                        }
                                        <div>
                                            <CardTitle className={'text-lg font-medium'}>{lecture.lectureTitle}</CardTitle>
                                        </div>
                                        </div>
                                        {
                                            isLectureCompleted(lecture._id) && (
                                                <Badge variant={'outline'} className={'bg-green-200 text-green-600'}>Completed</Badge>
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CourseProgress