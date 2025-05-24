import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react"
import { FaXmark } from "react-icons/fa6"
import fetchData from "../../../utils/fetchData"
import {CourseProps } from "../../../utils/types"
import { useCookies } from "react-cookie"

type CourseUploadProp = {
    course:{
        title:string,
        description:string
        files: File[];
    },
    id:string
    isShown:boolean
    setIsShown:Dispatch<SetStateAction<boolean>>
    setCourse:Dispatch<SetStateAction<{
        title:string,
        description:string,
        files: File[];
    }>>
    setCourses:Dispatch<SetStateAction<CourseProps>>
}
export default function Popover({course,setCourse,isShown,setIsShown,setCourses,id}:CourseUploadProp) {
    const [cookies] = useCookies(["auth_token"]);
  const sectionRef = useRef<HTMLElement|null>(null)
  const handleCloseModal = (e:React.MouseEvent)=> {
    e.stopPropagation();
    if(sectionRef.current === e.target){
        setIsShown(false);
    }
  }
  const handleCreateCourse = async ()=>{
      setIsShown(true);
      try {
        const request = await fetchData(`/course/add/${id}`,"POST",Object.entries(course).filter(([key])=>key!=="files").reduce((acc,[key,value])=>({...acc,[key]:value}),{}),cookies.auth_token,"formData","json",course.files);
        if(request.message){
          alert(request.message);
        }else if(request.course){
          setCourses((prev)=>({
            ...prev,
            courses: [...prev.courses,{
                title:request.course.title,
                description:request.course.description,
                extra:request.course.extra,
                resource:request.course.resource,
                author:request.course.author,
                quizzes:request.course.quizzes,
                _id:request.course._id,
                views:request.course.views,
            }],
          }));
        }
        setIsShown(false);
      } catch (error) {
        console.log(error);
      }finally{
        setCourse({
            title:"",
            description:"",
            files:[],
        })
      }
    }
    return (
    <section ref={sectionRef} onClick={(e)=>handleCloseModal(e)} className={`fixed top-0 left-0 w-screen h-screen flex justify-center items-center backdrop-blur-lg backdrop-opacity-75 z-20 ${isShown?'':'hidden'} popover`}>
        <div className="flex flex-col justify-center items-center gap-2 bg-slate-400 dark:bg-slate-600 shadow-md p-4 rounded-md relative">
            <h2 className="text-2xl text-gray-800 dark:text-slate-300">Create a new Course</h2>
            <button onClick={()=>setIsShown(false)} className="absolute top-1 right-1"><FaXmark size={20}/></button>
            <div className="w-full flex flex-col justify-start items-center gap-2-1">
                <label className="w-full" htmlFor="title">title</label>
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600" type="text" name="title" id="title" value={course.title} onChange={(e) => setCourse(prev=>{return {...prev,title:e.target.value}})}/>
            </div>
            <div className="w-full flex flex-col justify-start items-center gap-2-1">
                <label className="w-full" htmlFor="description">description</label>
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600" type="text" name="description" id="description" value={course.description} onChange={(e) => setCourse(prev=>{return {...prev,description:e.target.value}})}/>
            </div>
            <div className="w-full flex flex-col justify-start items-center gap-2-1">
                <label className="w-full" htmlFor="file">select file</label>
                <input multiple onChange={(e: ChangeEvent<HTMLInputElement>)=>{
                    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
                    setCourse((prev) => ({
                      ...prev,
                      files: selectedFiles,
                    }));
                }} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600" type="file" name="file" id="file"/>
            </div>
            <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
                {
                    Array.from(course.files).map((f, idx) => {
                        return (
                            <div
                                key={idx}
                                className="rounded bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300 relative border shadow-md p-2"
                            >
                                <p>{f.name}</p>
                                <p>{f.type}</p>
                                <p>{(f.size / 1024).toFixed(2)} KB</p>
                                <button
                                    onClick={() => {
                                        setCourse((prev) => {
                                            const files = [...prev.files];
                                            files.splice(idx, 1);
                                            return { ...prev, files };
                                        });
                                    }}
                                    className="mt-2 p-1 bg-red-500 text-white rounded absolute top-0 right-0"
                                >
                                    <FaXmark size={10}/>
                                </button>
                            </div>
                        );
                    })
                }

            </div>
            <button onClick={handleCreateCourse} className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Create Course</button>
        </div>
    </section>
  )
}
