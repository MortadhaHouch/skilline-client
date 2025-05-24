export default function Posts() {
  return (
    <section className="flex flex-col items-center justify-center w-full max-w-7xl min-h-screen">
      {/* <h2>Posts</h2>
      {
        posts.length > 0 ? (
            posts.map((post) => (
                <div key={post._id} className="border-2 border-gray-200 p-4 rounded-lg my-4">
                    <div>
                        <h4>{post.author.firstName} {post.author.lastName}</h4>
                        <span>{post.createdAt.toLocaleDateString()}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <div className="w-full flex flex-row justify-between items-center gap-2">
                        <button className="flex-1">{post.comments}</button>
                        <button className="flex-1">{post.likes}</button>
                        <button className="flex-1">{post.dislikes}</button>
                    </div>
                </div>
            ))
        ):(
            <p>No posts found.</p>
        )
      }
      <div className="flex flex-row justify-center items-center gap-4">
        <span>Total: {total}</span>
        <button disabled={page === 1}>Prev</button>
        <span>Page {page} of {pages}</span>
        <button disabled={page === pages}>Next</button>
      </div> */}
    </section>
  )
}