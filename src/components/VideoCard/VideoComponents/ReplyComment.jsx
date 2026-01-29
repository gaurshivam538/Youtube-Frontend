import { addCommentForSpecificComment } from "../../../services/comment.service";
import { generateNewAccessToken } from "../../../services/user.service";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/auth.slice";



const ReplyComment = ({ commentId, user, replyCommentContent, setReplyCommentContent, setReplyCommentId, videoId }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    // Replace with your API call to submit a reply
    if (replyCommentContent.trim().length === 0) {
      console.log("Please fill the more then one word thn submit the reply")
      alert("Please input  one word and more then one word");
      return;
    }
    
      const res = await addCommentForSpecificComment(replyCommentContent, videoId, commentId);
        if (res?.response?.data?.data === "Unauthorized request, Token created") {
                const res2 = await generateNewAccessToken();
                if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                    alert("Your refresh Token expiry, please Login and useSpecific services");
                    dispatch(logout());
                    navigate("/login");
                    return;
                }
                if (res2?.data?.message === "Access Token is created SuccessFully") {
                    await addCommentForSpecificComment(replyCommentContent, videoId, commentId);
                    return;
                }
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
