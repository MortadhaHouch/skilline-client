import {emailRegex} from "../../utils/constants"
import { Link, useNavigate } from 'react-router-dom';
import {FieldValues, useForm} from "react-hook-form"
import fetchData from "../../utils/fetchData";
import LoginContext from "@/providers/LoginContext";
import { useContext } from "react";
import { useCookies } from "react-cookie";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
    reset,
    setError,
  } = useForm();
  const {setIsLoggedIn} = useContext(LoginContext);
  const [,setCookie] = useCookies(["auth_token"])
  const navigate = useNavigate();
  const onSubmit =async (data: FieldValues) => {
      reset();
      try {
        const request = await fetchData("/user/login","POST",data,"","json","json");
        if(request.email_message){
          console.log(request.email_message);
          setError("email_message",{
            message:request.email_message,
            type:"validate"
          });
        }else if(request.password_message){
          console.log(request.password_message);
          setError("password_message",{
            message:request.password_message,
            type:"validate"
          });
        }
        else if(request.token){
          setIsLoggedIn(true);
          const user = request.user;
          localStorage.setItem("firstName",user.firstName);
          localStorage.setItem("lastName",user.lastName);
          localStorage.setItem("email",user.email);
          localStorage.setItem("avatar",user.avatar);
          localStorage.setItem("isLoggedIn",JSON.stringify(true));
          setCookie("auth_token",request.token,{
            path:"/",
            expires:new Date(Date.now() + 7 * 60 * 60 * 1000)
          })
          navigate("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <main className="flex flex-col items-center justify-center w-screen min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[clamp(320px,60%,450px)] flex flex-col justify-center items-center gap-6 backdrop-blur-md p-8 rounded-lg shadow-lg border">
        <h2 className="mb-6 text-3xl font-semibold text-blue-700">Login to Skilline</h2>
        <div className="flex flex-col items-start justify-start w-full gap-2">
          <label htmlFor="email" className="text-gray-500 text-lg">Email</label>
          <input
            {
              ...register("email", {
                required: "Email is required",
                pattern: {
                  value: emailRegex.fullMatch,
                  message: "Invalid email format",
                },
              })
            }
            type="email"
            name="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"
            placeholder="Enter your email address"
            aria-label="Email"
          />
          {errors.email && <p className="text-red-500">{`${errors?.email?.message}`}</p>}
          {errors.user_message && <p className="text-red-500">{`${errors.user_message.message}`}</p>}
        </div>
        <div className="flex flex-col items-start justify-start w-full gap-2">
          <label htmlFor="password" className="text-gray-500 text-lg">Password</label>
          <input
            {
              ...register("password",{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                }
              })
            }
            type="password"
            name="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500">{`${errors?.password?.message}`}</p>}
          {errors.password_message && <p className="text-red-500">{`${errors.password_message.message}`}</p>}
        </div>
        <div className="flex justify-end w-full">
          <a href="#" className="text-blue-600 hover:text-blue-700">Forgot your password?</a>
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="cursor-pointer w-full p-4 font-semibold text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 focus:outline-none"
        >
          Login
        </button>
        <div className="w-full text-center flex flex-col justify-center items-center gap-2">
          <span className="text-sm text-gray-700">You don't have an account?</span>
          <Link to='/signup' className="cursor-pointer w-full py-2 font-semibold text-slate-500 transition-all duration-300 ease-in-out border-[2px] border-slate-500 rounded-lg hover:bg-blue-700 hover:text-white active:scale-95 focus:outline-none text-md">
            Signup
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Login;
