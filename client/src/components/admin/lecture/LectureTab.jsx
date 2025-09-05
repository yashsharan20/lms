import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import { Loader, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
const LectureTab = () => {
    const [lectureTitle,setLectureTitle] = useState("");
    const [uploadVideoInfo,setUploadVideoInfo] = useState(null);
    const [isFree,setIsFree] = useState(false);
    const [mediaProgress,setMediaProgress] = useState(false);
    const [uploadProgress,setUploadProgress] = useState(0);
    const [btnDisable,setBtnDisable] = useState(true);

    const [editLecture,{data,isLoading,error,isSuccess}] = useEditLectureMutation()
    const [removeLecture,{data:removeData,isLoading:removeLoading,isSuccess:removeSuccess}] = useRemoveLectureMutation()
 
    const MEDIA_API = "http://localhost:8080/api/v1/media";
    const params = useParams();
    const {courseId,lectureId} = params

    const {data:lectureData} = useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;
    useEffect(()=>{
        if(lecture){
            setLectureTitle(lecture.lectureTitle)
            setIsFree(lecture.isPreviewFree);
            setUploadVideoInfo(lecture.videoUrl,lecture.lecture);
        }
    },[lecture]);
    console.warn(lectureData);


    const fileChangeHandler = async (e)=>{
        const file = e.target.files?.[0];
        if(file){
            const formData = new FormData();
            formData.append("file",file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`,formData,{
                    onUploadProgress:({loaded,total})=>{
                        setUploadProgress(Math.round((loaded*100)/total))
                    }
                });
                console.log(res);
                if(res.data.success){
                    setUploadVideoInfo({videoUrl:res.data.data.url,publicId:res.data.data.public_id});
                    setBtnDisable(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error("video upload failed");
                console.log(error);
            }finally{
                setMediaProgress(false);
            }
        }
    }

    const editLectureHandler = async() =>{
        await editLecture({lectureTitle,videoInfo:uploadVideoInfo,isPreviewFree:isFree,courseId,lectureId});
    }

    const removeLectureHandler = async()=>{
        await removeLecture(lectureId);
    }

    useEffect(()=>{
        if(isSuccess){
            toast.success(data.message);
        }
        if(error){
            toast.error(error.data.message);
        }
    },[isSuccess,error]);

    useEffect(()=>{
        if(removeSuccess){
            toast.success(removeData.message);
        }
    },[removeSuccess])

    return (
        <Card>
            <CardHeader className={'flex justify-between'}>
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make changes and save when done.</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button  disabled={removeLoading} onClick={removeLectureHandler} variant="destructive"
                    >
                    {removeLoading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please wait</>:"Remove Lecture"}</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input type="text" value={lectureTitle} onChange={(e)=>setLectureTitle(e.target.value)} placeholder="Ex. Introduction to Javascript" />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-600'>*</span></Label>
                    <Input type="file" onChange={fileChangeHandler} accept="video/*" className={'w-fit'} />
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Is this video FREE</Label>
                </div>
                {
                    mediaProgress && (
                        <div className='my-4'>
                            <Progress value={uploadProgress} className="w-[60%]" />
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }
                <div className='mt-4'>
                    <Button disabled={isLoading} onClick={editLectureHandler}>
                        { isLoading ? (<><Loader2/> Please wait</>):("Update Lecture") }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
export default LectureTab