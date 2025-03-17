export default function Quizzes() {
    return (
        <section className="flex flex-col items-center justify-center w-full max-w-7xl min-h-screen">
        {/* <h2>Quizzes</h2>
        <h3>{course.title}</h3>
        {
            quizzes.length > 0 ?(
                quizzes.map((quiz) => (
                    <div key={quiz._id} className="border-2 border-gray-200 p-4 rounded-lg my-4">
                        <div>
                            <h4>{quiz.creator.firstName} {quiz.creator.lastName}</h4>
                            <span>{quiz.difficulty}</span>
                        </div>
                        <h3>{quiz.topic}</h3>
                    </div>
                ))
            ):(
                <p>No quizzes found.</p>
            )
        }
        <div className="flex flex-row justify-center items-center gap-4">
            <button disabled={page === 1}>Prev</button>
            <span>Page {page} of {pages}</span>
            <button disabled={page === pages}>Next</button>
        </div>
            <span>Total: {count}</span>
            <button disabled={page === 1}>Prev</button>
            <span>Page {page} of {pages}</span> */}
        </section>
    )
}