import { Menu, School } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from './button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import DarkMode from '@/DarkMode';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const [logoutUser,{data,isSuccess}] = useLogoutUserMutation();
    useEffect(()=>{
        if(isSuccess){
            toast.success(data.message || "User Logout");
        }
    },[isSuccess]);

    const logoutHander = async()=>{
        await logoutUser();
        navigate("/login");
    }

    return (
        <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            <div className='md:flex max-w-7xl mx-auto hidden justify-between items-center gap-10 h-full '>
                <div className='flex items-center gap-2'>
                    <School size={"30"} />
                    <Link to="/"><h1 className='hidden md:block font-extrabold text-2xl'>E-Learning</h1></Link>
                </div>

                <div className='flex items-center gap-8'>
                    {
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link to="/my-learning">My learning</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link to="/profile">Edit Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={logoutHander}>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    {user.role === "instructor" && (
                                        <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link to="/admin/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className='flex gap-2 items-center'>
                                <Button className="cursor-pointer" onClick={()=>navigate("/login")} variant="outline">Login</Button>
                                <Button className="cursor-pointer" onClick={()=>navigate("/login")}>Signup</Button>
                            </div>
                        )
                    }
                    <DarkMode />
                </div>

            </div>

            <div className='flex md:hidden items-center justify-between px-4 h-full'>
                <h1 className='font-extrabold text-2xl'>E-Learning</h1>
                <MobileNavbar user={user} />
            </div>

        </div>
    )
}
export default Navbar

const MobileNavbar = ({user}) => {
    const navigate = useNavigate();
    const [logoutUser,{data,isSuccess}] = useLogoutUserMutation();
    const logoutHander = async()=>{
        await logoutUser();
        navigate("/login");
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className='rounded-full hover:bg-gray-200' variant="outline">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className='flex flex-row justify-between mt-4'>
                    <SheetTitle><Link to="/">E-Learning</Link></SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <nav className='flex flex-col space-y-4 p-4'>
                    <Link to="/my-learning">My Learning</Link>
                    <Link to="/profile">Edit Profile</Link>
                    <span onClick={logoutHander}>Logout</span>
                </nav>
                {
                    user?.role == "instructor" && (
                        <SheetFooter>
                            <Button onClick={()=>navigate('/admin/dashboard')} type="submit">Dashboard</Button>
                        </SheetFooter>
                    )
                }

            </SheetContent>
        </Sheet>
    )
}