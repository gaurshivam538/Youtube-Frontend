import { addCommentForSpecificComment } from "../../../services/comment.service";

const ReplyComment = ({ commentId, user, replyCommentContent, setReplyCommentContent, setReplyCommentId, videoId }) => {

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    // Replace with your API call to submit a reply
    if (replyCommentContent.trim().length === 0) {
      console.log("Please fill the more then one word thn submit the reply")
      alert("Please input  one word and more then one word");
      return;
    }
    try {
      const res = await addCommentForSpecificComment(replyCommentContent, videoId, commentId);
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    setReplyCommentContent(""); // Clear input
    setReplyCommentId(null); // Close reply box
  }

  return (
    <form onSubmit={handleReplySubmit} className="flex gap-3 w-full">
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
          value={replyCommentContent}
          onChange={(e) => setReplyCommentContent(e.target.value)}
        />
        <div className="flex gap-6 mt-2">
          {
            replyCommentContent.length > 0 && (
              <input
                className="bg-blue-300 rounded-3xl max-w-fit px-4 cursor-pointer"
                value="Add"
                type="submit"
              />
            )
          }

          <button
            type="button"
            onClick={() => setReplyCommentId(null)}
            className="max-w-fit p-1 bg-slate-800 border border-gray-200 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
export default ReplyComment;
