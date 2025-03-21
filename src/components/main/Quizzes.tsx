import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Quiz, QuizProps } from "../../../utils/types";
import fetchData from "../../../utils/fetchData";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import QuizPopover from "./QuizPover";

const SlideSheetQuizzes: React.FC<QuizProps & { open: boolean; setOpen: (open: boolean) => void }> = ({ quizzes, page, course, pages, count, open, setOpen }) => {
  const [currentPage, setCurrentPage] = useState(page);
  const [cookies] = useCookies(["auth_token"]);
  const [foundQuiz, setFoundQuiz] = useState<Quiz | null>(null);
  const [isOpen,setIsOpen] = useState(false);
  const { id: communityId } = useParams();

  const handleNext = () => {
    if (currentPage < pages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getQuizById = async (id: string) => {
    try {
      const response = await fetchData(`/quiz/${communityId as string}/${course._id}/${id}`, "GET",{}, cookies.auth_token,"json","json",);
      if (response.ok) {
        setFoundQuiz(response);
        setIsOpen(true);
        console.log(response);
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="h-full p-6" side="right">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{course.title} - Quizzes</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-center items-center gap-4 mt-4">
          {quizzes.map((quiz) => (
            <Card key={quiz._id} className="w-full bg-gray-100 shadow-lg rounded-lg hover:shadow-xl transition p-4">
              <CardHeader className="w-full relative">
                <span className="text-sm font-medium text-gray-600 bg-gray-200 rounded-full px-2 py-1 absolute top-0 right-0">
                  {quiz.difficulty}
                </span>
                <CardTitle className="text-xl font-semibold">{quiz.topic}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p className="mb-1">
                  <span className="font-medium">Creator:</span> {quiz.creator.firstName} {quiz.creator.lastName}
                </p>
                <p>
                  <span className="font-medium">Participators:</span> {quiz.participators.length}
                </p>
                <Button variant="outline" onClick={() => getQuizById(quiz._id)} className="mt-2">
                  Get Ready
                </Button>
                {foundQuiz && foundQuiz._id === quiz._id && isOpen && (
                  <QuizPopover isOpen={isOpen} setIsOpen={setIsOpen} quiz={foundQuiz} course={course._id as string}/>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <Button variant="ghost" onClick={handlePrevious} disabled={currentPage === 1} className="flex items-center gap-1">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <p className="text-lg font-medium">Page {currentPage} of {pages}</p>
          <Button variant="ghost" onClick={handleNext} disabled={currentPage === pages} className="flex items-center gap-1">
            <ChevronRight className="w-5 h-5" />
          </Button>
          <p className="text-lg font-medium">{count} quizzes found</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SlideSheetQuizzes;
