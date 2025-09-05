import React from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

const Course = ({course}) => {
    console.warn(course);
    return (
        <Link to={`/course-detail/${course?._id}`}>
            <Card className='overflow-hidden pt-0 cursor-pointer rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300'>
                <div className="relative">
                    <img className="w-full h-36 object-cover rounded-t-lg" alt="Course"
                        src={course?.courseThumbnail} />
                </div>
                <CardContent className="px-5">
                    <h1 className="hover:underline font-bold text-lg truncate">{course?.courseTitle}</h1>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 my-2">
                            <Avatar>
                                <AvatarImage src={course?.creator?.photoUrl || "https://github.com/shadcn.png"} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1 className="font-medium text-sm">{course?.creator.name}</h1>
                        </div>
                        <Badge className='bg-blue-600 text-white px-2 py-1 text-xs rounded-full'>{course?.courseLevel}</Badge>
                    </div>
                    <div className="text-lg font-bold">
                        <span>{course?.coursePrice}₹</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
export default Course;