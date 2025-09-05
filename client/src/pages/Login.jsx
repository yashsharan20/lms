import { AppWindowIcon, CodeIcon, Loader2 } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"


 const Login = () => {
    const [loginInput,setLoginInput] = useState({
        email:"",
        password:""
    });
    const [signupInput,setSignupInput] = useState({
        name:"",
        email:"",
        password:""
    });
    const navigate = useNavigate();
    const [registerUser,{data:registerData,error:registerError,isLoading:registerIsLoading,isSuccess:registerIsSuccess}] = useRegisterUserMutation();
    const [loginUser,{data:loginData,error:loginError,isLoading:loginIsLoading,isSuccess:loginIsSuccess}] = useLoginUserMutation();

    const changeInputHandler = (e,type) =>{
        const {name,value} = e.target;
        if(type === "signup"){
            setSignupInput({...signupInput,[name]:value});
        }else{
            setLoginInput({...loginInput,[name]:value});
        }
    }

    const handleRegistration = async(type) =>{
        const inputData = type === "signup" ? signupInput:loginInput;
        const action = type === "signup" ? registerUser:loginUser;
        await action(inputData);
    }

    useEffect(()=>{
      if(registerIsSuccess && registerData){
        toast.success(registerData.message || "Signup successfully");
        navigate("/");
      }
      if(loginIsSuccess && loginData){
        toast.success(loginData.message || "Login successfully");
        navigate("/");
      }
      if(registerError){
        toast.error(registerError.data.message || "Signup Failed");
      }
      if(loginError){
        toast.error(loginError?.data?.message || "Login Failed");
      }
    },[loginIsLoading,registerIsLoading,loginData,registerData,loginError,registerError])

  return (
       <div className="flex w-auto mt-20 items-center justify-center">
      <Tabs defaultValue="signup">
        <TabsList className="grid w-[360px] grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
               Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">Name</Label>
                <Input type="text" name="name" value={signupInput.name} onChange={(e)=>changeInputHandler(e,"signup")} placeholder="Virat Kohli" required="true"/>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Email</Label>
                <Input type="email" name="email" value={signupInput.email} onChange={(e)=>changeInputHandler(e,"signup")} placeholder="vk@gmail.com" required="true"/>
              </div>
             <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Password</Label>
                <Input type="password" name="password" value={signupInput.password} onChange={(e)=>changeInputHandler(e,"signup")} placeholder="********" required="true"/>
              </div>
            </CardContent>
            <CardFooter>
               <Button disabled={registerIsLoading} onClick={()=>handleRegistration("signup")}>{
                registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait 
                  </>
                ):(
                  "Signup"
                )
                }</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid gap-3">
                <Label>Email</Label>
                <Input type="email" name="email" value={loginInput.email} onChange={(e)=>changeInputHandler(e,"login")} placeholder="vk@gmail.com" required="true"/>
              </div>
             <div className="grid gap-3">
                <Label>Password</Label>
                <Input type="password" name="password" value={loginInput.password} onChange={(e)=>changeInputHandler(e,"login")}  placeholder="********" required="true"/>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loginIsLoading} onClick={()=>handleRegistration("login")}>{
                loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait 
                  </>
                ):(
                  "Login"
                )
                }</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
  )
}

export default Login;
