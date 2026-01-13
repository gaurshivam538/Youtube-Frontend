import { updateComment } from "../../../services/comment.service";

const EditComment = ({ commentId, user,  editCommentContent , setEditCommentContent, setEditCommentId, videoId }) => {

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace with your API call to submit a reply
    if (editCommentContent.trim().length === 0) {
      console.log("Please fill the more then one word thn submit the reply")
      alert("Please input  one word and more then one word");
      return;
    }
    try {
        console.log(editCommentContent)
      const res = await updateComment(editCommentContent, commentId, videoId);
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    setEditCommentContent(""); // Clear input
    setEditCommentId(null); // Close reply box
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0">
        {user?.avatar && (
          <img
            className="w-full h-full object-cover rounded-full"
            src={user.avatar}
            alt="user avatar"
          />
        )}
      </div>
      <div className="flex flex-col w-full">
        <input
          className="flex-1 bg-transparent border-b border-gray-600 outline-none text-sm w-full"
          placeholder="Add a reply..."
          value={editCommentContent}
          onChange={(e) => setEditCommentContent(e.target.value)}
        />
        <div className="flex gap-6 mt-2">
            
              <input
                className="bg-blue-300 rounded-3xl max-w-fit px-4 cursor-pointer"
                value="Update"
                type="submit"
              />
            
          <button
            type="button"
            onClick={() => setEditCommentId(null)}
            className="max-w-fit p-1 bg-slate-800 border border-gray-200 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
export default EditComment;
