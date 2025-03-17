import {z} from "zod"
import { } from "apexcharts";
enum Sort{
    NAME="NAME",
    DESCRIPTION="DESCRIPTION",
    MEMBERS="MEMBERS"
}
enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}
  export type ChartOptions = {
    series: ApexAxisChartSeries | number[];
    chart?: ApexChart;
    xaxis?: ApexXAxis;
    stroke?: ApexStroke;
    dataLabels?: ApexDataLabels;
    yaxis?: ApexYAxis;
    title?: ApexTitleSubtitle;
    labels?: string[];
    legend?: ApexLegend;
    subtitle?: ApexTitleSubtitle;
  };
export const communityStatsSchema = z.object({
    stats:z.array(z.object({
      _id:z.object({
        month: z.number(),
        year: z.number(),
        day: z.number(),
      }),
      count: z.number(),
    })),
    communities:z.array(
      z.object({
        description: z.string(),
        name: z.string(),
        _id: z.string(),
        isAdmin: z.boolean(),
        isMember: z.boolean(),
        totalMembers: z.number(),
      })
    ),
    pagination:z.object({
      page:z.number(),
      pages:z.number()
    }),
    studentsCount: z.number(),
    communitiesCount: z.number(),
    coursesCount: z.number(),
});
export const userSchema = z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(Role),
    avatar: z.string(),
    isLoggedIn: z.boolean(),
    index: z.number().nullable(),
})
type Post = {
    _id: string;
    content: string;
    author: User;
    createdAt: Date;
    updatedAt: Date;
    comments: number;
    likes: number;
    dislikes: number;
}
type Notification = {
    _id: string;
    title: string;
    content: string;
    createdAt: Date;
    isRead:boolean;
    readAt:Date;
    from:User;
}
type CommunityStats = z.infer<typeof communityStatsSchema>
type User = z.infer<typeof userSchema>
type Community = {
  name: string;
  description: string;
  admin: User;
  members: number;
  posts: number;
  logo: string;
  banner: string;
  courses: number;
  _id: string;
}
type Course = {
  title:string
  description:string;
  extra:string[]
  resource:string[];
  author:User
  quizzes:Quiz[];
  _id: string;
  views:number
}
type Quiz = {
    _id: string;
    topic:string;
    creator:User
    participators:User[]
    questions:Question
    difficulty:Difficulty
}
enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}
type Question = {
  quiz:Question
  options:string[]
  participators:User[]
  correctAnswer:string
  results:Question[]
  question:string
  time:number
}
enum Tab {
    POSTS = "POSTS",
    QUIZZES = "QUIZZES",
    COURSES = "COURSES",
}
type QuizProps = {
  quizzes:Quiz[],
  page: number,
  course:{
      _id: string,
      title: string
  },
  pages: number
  count: number
}
type CommunityProps ={
  communities: Community[];
  page: number
  pages: number
  studentsCount: number
  communitiesCount: number
  coursesCount: number
}
type CourseProps ={
  courses:Course[]
  page: number
  pages: number
}
type PostProps = {
  posts:Post[]
  page: number
  pages: number
  total: number
}
export type {CommunityStats,User,Post,Notification,Community,Course,Quiz,QuizProps,CommunityProps,CourseProps,PostProps}
export {Role,Tab,Sort}