import { FieldValues, useForm } from 'react-hook-form';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { emailRegex } from '../../utils/constants';
import fetchData from "../../utils/fetchData"
import { useCookies } from 'react-cookie';
import { useContext } from 'react';
import LoginContext from '@/providers/LoginContext';
const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm();
  const [,setCookie] = useCookies(["auth_token"])
  const {setIsLoggedIn} = useContext(LoginContext);
  const navigate = useNavigate();
  if(JSON.parse(localStorage.getItem("isLoggedIn")||"false")){
    navigate("/dashboard");
    return;
  }
  const onSubmit =async (data: FieldValues) => {
    reset();
    try {
      const request = await fetchData("/user/signup","POST",data,"","json","json");
      if(request.user_message){
        console.log(request.user_message);
        setError("user_message",{
          message:request.user_message,
          type:"validate"
        });
      }else if(request.email_message){
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
          expires:new Date(Date.now() + 7 * 60 * 60 * 1000),
          maxAge:7 * 60 * 60 * 1000
        })
        redirect("/dashboard")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[clamp(320px,60%,450px)] flex flex-col justify-center items-center gap-6 backdrop-blur-md p-8 rounded-lg shadow-lg border border-gray-200"
      >
        <h2 className="mb-6 text-3xl font-semibold text-blue-900">Create an Account</h2>

        <div className="flex flex-col items-start justify-start w-full gap-2">
          <label htmlFor="firstName" className="text-sm text-gray-700">First Name</label>
          <input
            {...register('firstName', {
              required: "First name is required", 
              minLength: { value: 2, message: "First name must be at least 2 characters" },
              maxLength: { value: 50, message: "First name cannot exceed 50 characters" },
            })}
            type="text"
            name="firstName"
            id="firstName"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"
          />
          {errors.firstName && <p className="text-red-500">{`${errors.firstName.message}`}</p>}
          {errors.user_message && <p className="text-red-500">{`${errors.user_message.message}`}</p>}
        </div>

        <div className="flex flex-col items-start justify-start w-full gap-2">
          <label htmlFor="lastName" className="text-sm text-gray-700">Last Name</label>
          <input
            {...register('lastName', {
              required: "Last name is required",
              minLength: { value: 2, message: "Last name must be at least 2 characters" },
              maxLength: { value: 50, message: "Last name cannot exceed 50 characters" },
            })}
            type="text"
            name="lastName"
            id="lastName"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"
          />
          {errors.lastName && <p className="text-red-500">{`${errors.lastName.message}`}</p>}
          {errors.user_message && <p className="text-red-500">{`${errors.user_message.message}`}</p>}
        </div>

        <div className="flex flex-col items-start justify-start w-full gap-2">
          <label htmlFor="email" className="text-sm text-gray-700">Email</label>
          <input
            {...register('email', {
              required: "Email is required",
              pattern: {
                value: emailRegex.fullMatch,
                message: "Please enter a valid email address"
              },
              minLength: { value: 5, message: "Email must be at least 5 characters" }
            })}
            type="email"
            name="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"
          />
          {errors.email && <p className="text-red-500">{`${errors.email.message}`}</p>}
          {errors.email_message && <p className="text-red-500">{`${errors.email_message.message}`}</p>}
        </div>

        <div className="flex flex-col items-start justify-start w-full gap-2">
          <label htmlFor="password" className="text-sm text-gray-700">Password</label>
          <input
            {...register('password', {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              maxLength: { value: 50, message: "Password cannot exceed 50 characters" },
            })}
            type="password"
            name="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600"
          />
          {errors.password && <p className="text-red-500">{`${errors.password.message}`}</p>}
          {errors.password_message && <p className="text-red-500">{`${errors.password_message.message}`}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full py-2 font-semibold transition-all duration-300 ease-in-out bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 focus:outline-none text-center"
        >
          Signup
        </button>

        <div className="w-full text-center flex flex-col justify-center items-center gap-2">
          <span className="text-sm text-gray-700">Already have an account?</span>
          <Link to="/login" className="cursor-pointer w-full py-2 font-semibold text-slate-500 transition-all duration-300 ease-in-out border-[2px] border-slate-500 rounded-lg hover:bg-blue-700 active:scale-95 focus:outline-none hover:text-white text-center text-md">
            Login
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Signup;
