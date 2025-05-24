import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { CommentType, Post } from '../../../utils/types';
import { Dispatch, SetStateAction, useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import fetchData from '../../../utils/fetchData';
import { FaComment } from 'react-icons/fa';

interface CommentsProps {
  comments: CommentType[];
  setComments: Dispatch<SetStateAction<CommentType[]>>;
  post: Post;
}

export default function Comments({ comments, setComments, post }: CommentsProps) {
  const [cookies] = useCookies(["auth_token"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const getComments = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const request = await fetchData(
        `/comment/${id}`,
        "GET",
        {},
        cookies.auth_token,
        "json",
        "json"
      );
      
      if (request.comments && Array.isArray(request.comments)) {
        setComments(request.comments);
      } else {
        throw new Error("Failed to fetch comments or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [cookies.auth_token, setComments]);
  const handleAddComment = async ()=>{
    try {
      setIsLoading(true);
      setError(null);
      const request = await fetchData(
        `/comment/${post._id}`,
        "POST",
        { content: commentInput },
        cookies.auth_token,
        "json",
        "json"
      );
      if (request.comment) {
        setComments([...comments, request.comment]);
      } else {
        throw new Error("Failed to add comment or invalid response format");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={() => getComments(post._id)}
          className="flex-1 text-slate-600 bg-slate-300 dark:bg-slate-700 px-3 py-1 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-500 dark:text-slate-400 transition-colors duration-200 text-lg"
          disabled={isLoading}
        >
          <span>{post.comments}</span>
          <FaComment className={isLoading ? "animate-spin" : ""} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Comments ({comments.length})
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            View and read comments for this post
          </DialogDescription>
        </DialogHeader>
        <div>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-600 focus:border-blue-600 resize-none"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            ></textarea>
            <button
              onClick={handleAddComment}
              className="flex-1 text-slate-600 bg-slate-300 dark:bg-slate-700 px-3 py-1 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-500 dark:text-slate-400 transition-colors duration-200 text-lg"
              disabled={isLoading || commentInput.length === 0}
              >
                Comment
              </button>
        </div>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <FaComment className="animate-spin text-2xl text-gray-500 dark:text-gray-400" />
              <span className="ml-2 text-gray-500 dark:text-gray-400">Loading comments...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 dark:text-red-400 text-center py-4">
              {error}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No comments yet.
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.from._id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">
                        {comment.from.firstName[0]}{comment.from.lastName[0]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <strong className="text-gray-900 dark:text-gray-100">
                        {comment.from.firstName} {comment.from.lastName}
                      </strong>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}