import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Question, Quiz } from "../../../utils/types"; // Assuming these are imported correctly from your types file
import { DialogTrigger } from "@radix-ui/react-dialog";
import fetchData from "../../../utils/fetchData";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { FaXmark } from "react-icons/fa6";

interface QuizPopoverProps {
  quiz: Quiz;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  course: string;
}

export default function QuizPopover({ quiz, isOpen, setIsOpen,course }: QuizPopoverProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Map<string, { answer: string, time: number }>>(new Map());
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questionTimers] = useState<Map<number, number>>(new Map());
  const {id : communityId} = useParams() as {id : string};
  const [results,setResults] = useState<{answer:string,isCorrect:boolean,time:number,correctAnswer:string}[]>([])
  const [cookies] = useCookies(["auth_token"])
  useEffect(() => {
    const totalTime = quiz.questions.reduce((acc, question) => acc + question.time, 0);
    setRemainingTime(totalTime);
  }, [quiz]);
  useEffect(() => {
    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          moveToNextQuestion();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);
  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = new Map(prevAnswers);
      newAnswers.set(questionId, { answer, time: questionTimers.get(currentQuestionIndex) ?? 0 });
      return newAnswers;
    });
  };

  useEffect(()=>{
    console.log(userAnswers);
  },[userAnswers])
  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };
  const handleConfirm =async () => {
    if(currentQuestionIndex === quiz.questions.length - 1){
        const answers:{answer:string,time:number}[] = []
        userAnswers.forEach((value)=>{
            answers.push({answer:value.answer,time:value.time})
        })
        console.log(answers);
        const request = await fetchData(`/quiz/${communityId}/${course}/${quiz._id}`,"POST",{answers},cookies.auth_token,"json","json");
        if(request.results){
            console.log(request);
            setResults(request.results);
            setRemainingTime(0);
        }
        setIsConfirmed(true);
        // alert("Confirmed! You can now close the dialog.");
        // setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={()=>{
        if(isConfirmed && results.length > 0){
            setIsOpen(false);
        }
    }}>
      <DialogTrigger>
        <button>Open Quiz</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col justify-center items-center gap-4 p-4">
        <DialogHeader>
          <DialogTitle>{quiz.topic}</DialogTitle>
          <DialogDescription>
            {quiz.creator.firstName} {quiz.creator.lastName}
          </DialogDescription>
        </DialogHeader>
        <p className="text-lg font-semibold">Remaining Time: {remainingTime} seconds</p>

        <Carousel className="w-full">
          <CarouselContent className="w-full">
            {quiz.questions.map((question: Question, idx: number) => (
              <CarouselItem
                key={idx}
                className="flex flex-col gap-4"
                style={{ display: currentQuestionIndex === idx ? "block" : "none" }} // Show only the current question
              >
                <div className="flex flex-col gap-4">
                  <p className="text-gray-700">{question.question}</p>
                  <ul className="flex flex-col gap-2">
                    {question.options.map((option, optionIdx) => (
                            <li key={optionIdx} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id={`option-${question}-${optionIdx}`}
                                    name={`question-${question}`}
                                    value={option}
                                    onChange={() => handleAnswerChange(question._id, option)}
                                />
                                <label htmlFor={`option-${question._id}-${optionIdx}`} className="text-sm">
                                    {option}
                                </label>
                            </li>
                    ))}
                    <div>
                        {
                            results.length > 0 && results[idx] && (
                                <div className="flex flex-col justify-between gap-2" key={idx}>
                                    <span className={`w-full p-1 rounded-md flex flex-row justify-start items-center gap-1 ${results[idx].isCorrect ? "text-green-600 bg-green-100" : "text-red-500 bg-red-100"}`}>your answer   {results[idx].isCorrect ? <Check color="green"/>:<FaXmark color="red"/>}{results[idx].answer}</span>
                                    <span className={`w-full p-1 rounded-md ${userAnswers.get(question._id)?.time || 0 < results[idx].time ? "text-green-600 bg-green-100" : "text-red-500 bg-red-100"}`}>{results[idx].time}</span>
                                    <span className="w-full p-1 rounded-md flex flex-row justify-start items-center text-green-500 bg-green-100">correct answer   {results[idx].isCorrect && <Check color="green"/>} {results[idx].correctAnswer}</span>
                                </div>
                            )
                        }
                    </div>
                  </ul>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} />
          <CarouselNext disabled={currentQuestionIndex === quiz.questions.length - 1} onClick={moveToNextQuestion} />
        </Carousel>

        <div className="flex justify-between w-full mt-4">
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleConfirm}
            disabled={currentQuestionIndex!== quiz.questions.length - 1 || isConfirmed}
          >
            Confirm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
