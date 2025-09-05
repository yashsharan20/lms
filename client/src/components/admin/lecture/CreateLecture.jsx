import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateLectureMutation, useEditCourseMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Label } from '@radix-ui/react-label'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { courseId } = params;
    const [lectureTitle, setLectureTitle] = useState("");

    const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

    const { data: lectureData, isLoading: lectureLoading, isError: lectureError,refetch } = useGetCourseLectureQuery(courseId);
    console.warn(lectureData);

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    }

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data.message);
        }
        if (error) {
            toast.error(error.data.message);
        }
    }, [isLoading, isSuccess, error]);

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">Lets add lectures, add some basic course details from your new lecture</h1>
                <p className="text-sm">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, temporibus.</p>
            </div>
            <div className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} name="lectureTitle" placeholder="Your Title Name" />
                </div>
                <div className="gap-2 flex items-center">
                    <Button onClick={() => navigate(`/admin/course/${courseId}`)} variant="outline">Back to course</Button>
                    <Button onClick={createLectureHandler} diasabled={isLoading}>{
                        isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                            </>) : (
                            "Create lecture"
                        )
                    }</Button>
                </div>
                <div className="mt-10">
                    {
                        lectureLoading ? (<p>Loading lecture...</p>) 
                        : lectureError ? (<p>Failed to load lectures</p>)
                        : lectureData.lectures.length == 0 ? (<p>No lectures available</p>) 
                        :(
                            lectureData.lectures.map((lecture,index)=>(
                                <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default CreateLecture