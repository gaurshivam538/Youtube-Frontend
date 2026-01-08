import React, { useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { addCommentForSpecificComment, addCommentVideo } from '../../../services/comment.service';
import { SlDislike, SlLike } from "react-icons/sl";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { useEffect } from 'react';

const Comment = ({ setOpen, open, user, videoInfo, commentInfo, replyedCommentInfo }) => {

  const [comment, setComment] = useState("");
  const [submitButton, setSubmitButton] = useState(false);
  const [replyComment, setReplyComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [openRepliesComment, setOpenRepliesComment] = useState(null);
  const [commentReactions, setCommentReactions] = useState({});

  // set video id
  useEffect(() => {
    if (videoInfo?._id) setVideoId(videoInfo._id);
  }, [videoInfo]);

  // initialize reactions for comments
  useEffect(() => {
    const reactions = {};
    // const hai=[];
    commentInfo.forEach((c) => {
      reactions[c._id] = {
        like: false,
        dislike: false,
        likeCount: c.likes || 0,
      };
      // hai.push(reactions)
    });
    // console.log(hai)
    setCommentReactions(reactions);
  }, [commentInfo]);

  // ✅ LIKE HANDLER
  const toggleLike = (commentId) => {
    setCommentReactions((prev) => {
      const current = prev[commentId];

      if (current.like) {

        
        return {
          ...prev,
          [commentId]: {
            ...current,//Purani value save karo or fir overwrite karo
            like: false,
            likeCount: Math.max(current.likeCount - 1, 0),
          },
        };
      }

      return {
        ...prev,
        [commentId]: {
          like: true,
          dislike: false,
          likeCount: current.likeCount + 1,
        },
      };
    });
  };

  // ✅ DISLIKE HANDLER
  const toggleDislike = (commentId) => {
    setCommentReactions((prev) => {
      const current = prev[commentId];

      return {
        ...prev,
        [commentId]: {
          ...current,
          dislike: !current.dislike,
          like: false,
          likeCount: current.like
            ? Math.max(current.likeCount - 1, 0)
            : current.likeCount,
        },
      };
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await addCommentVideo(comment, videoId);
    } catch (error) {
      console.log(error);
    }

    setComment("");
  }

  const handleSubmitButton = () => {
    setSubmitButton(true);
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-sm sm:text-base font-semibold mb-3">
          Comments
        </h2>
        {
          open ? (
            <h2 onClick={() => setOpen(false)}>
              <IoMdClose className="h-7 w-7 cursor-pointer" />
            </h2>
          ) : (
            <h2 onClick={() => setOpen(true)}>
              <IoReorderThreeSharp className="h-7 w-7 cursor-pointer" />
            </h2>
          )
        }
      </div>

      {/* Add new comment */}
      <div className="flex gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gray-600">
          {user?.avatar && (
            <img
              className="w-full h-full object-cover rounded-full"
              src={user.avatar}
              alt="user avatar"
            />
          )}
        </div>
        <form onSubmit={handleSubmit} className='w-full flex flex-col justify-between'>
          <input
            className="flex-1 bg-transparent border-b border-gray-600 outline-none text-sm w-full"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onClick={handleSubmitButton}
          />
          {submitButton && (
            <div className='flex gap-6 mt-4'>
              <input
                className="bg-blue-300 rounded-3xl max-w-fit px-4 cursor-pointer"
                value="Add"
                type="submit"
              />
              <button
                type="button"
                onClick={() => setSubmitButton(false)}
                className='max-w-fit p-2 bg-slate-800 border border-gray-200 rounded-lg'
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Single comments */}
      {open && videoInfo?.owner && commentInfo.length > 0 && commentInfo.map((comment) => {
        const reactions = commentReactions[comment._id];
        const replies = replyedCommentInfo.filter(
          r => r.parentComment === comment._id
        );
        return (
          <div className="mb-3" key={comment._id}>

            <div className="flex gap-3">
              {/* Comment owner avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-600">
                {comment?.owner?.avatar && (
                  <img
                    src={comment.owner.avatar}
                    className="h-full w-full rounded-full object-cover"
                    alt="comment owner"
                  />
                )}
              </div>

              <div className="flex flex-col w-full">
                {/* Comment content */}
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{comment.owner.username}</p>
                  <BsThreeDotsVertical />
                </div>
                <p className="text-sm text-gray-300">{comment.content}</p>

                {/* Comment actions */}
                <div className='flex gap-8 mt-2 items-center'>
                  <div
                      className="flex gap-1 items-center cursor-pointer"
                      onClick={() => toggleLike(comment._id)}
                    >
                      {reactions?.like ? <AiFillLike /> : <SlLike />}
                      {reactions?.likeCount}
                    </div>

                    <div
                      className="cursor-pointer"
                      onClick={() => toggleDislike(comment._id)}
                    >
                      {reactions?.dislike ? (
                        <AiFillDislike />
                      ) : (
                        <SlDislike />
                      )}
                    </div>
                  <button onClick={() => setReplyCommentId(comment._id)}>Reply</button>
                </div>

                {replies.length > 0 && openRepliesComment !== comment._id && (
                   <div className='relative mt-3 mb-9'>
                  <button
                    className='absolute left-0  hover:rounded-3xl hover:bg-slate-900  p-2 text-white'
                    onClick={() => setOpenRepliesComment(comment._id)}
                  >
                     {replies.length} reply
                  </button>
                  </div>
                )}
                {
                  openRepliesComment == comment._id && replyedCommentInfo.map((replyComment) => (
                    <div key={replyComment._id}>
                      {replyComment.parentComment === comment._id ? (
                        <div className='flex gap-3 mt-2' key={replyComment._id}>
                          <div className="w-9 h-9 rounded-full bg-gray-600">
                            {replyComment?.owner?.avatar && (
                              <img
                                src={replyComment.owner.avatar}
                                className="h-full w-full rounded-full object-cover"
                                alt="comment owner"
                              />
                            )}
                          </div>
                          <div className='flex flex-col w-full'>
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">{replyComment.owner.username}</p>
                              <BsThreeDotsVertical />
                            </div>
                            <p className="text-sm text-gray-300">{replyComment.content}</p>

                            {/* Comment actions */}
                            <div className='flex gap-8 mt-2 items-center'>
                              <SlLike className="h-4 w-4 cursor-pointer" />
                              <SlDislike className="h-4 w-4 cursor-pointer" />
                              <button onClick={() => setReplyCommentId(replyComment._id)}>Reply</button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {replyCommentId === replyComment._id && (
                        <div className="mt-2 ml-12"> {/* Offset to align with comment text */}
                          <ReplyComment
                            commentId={replyComment._id}
                            user={user}
                            replyComment={replyComment}
                            setReplyComment={setReplyComment}
                            setReplyCommentId={setReplyCommentId}
                            videoId={videoId}
                          />
                        </div>
                      )}
                    </div>
                  ))
                }
                { replies.length > 0 && openRepliesComment === comment._id && (
                  <div className='relative m-4 mb-7'>
                  <button
                    className='absolute left-0  hover:rounded-3xl hover:bg-slate-900  p-2 text-white'
                    onClick={() => setOpenRepliesComment(null)}
                  >
                    Hide replies
                  </button>
                  </div>
                )}

              </div>
            </div>

            {/* Reply input for this comment only */}
            {replyCommentId === comment._id && (
              <div className="mt-2 ml-12"> {/* Offset to align with comment text */}
                <ReplyComment
                  commentId={comment._id}
                  user={user}
                  replyComment={replyComment}
                  setReplyComment={setReplyComment}
                  setReplyCommentId={setReplyCommentId}
                  videoId={videoId}
                />
              </div>
            )}


          </div>
        )
      }
      )}
    </div>
  )
}

export default Comment;


// ReplyComment component
const ReplyComment = ({ commentId, user, replyComment, setReplyComment, setReplyCommentId, videoId }) => {

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyComment.trim()) return;

    // Replace with your API call to submit a reply
    try {
      const res = await addCommentForSpecificComment(replyComment, videoId, commentId)
      console.log(res);
    } catch (error) {
      console.log(error)
    }

    setReplyComment(""); // Clear input
    setReplyCommentId(null); // Close reply box
  }

  return (
    <form onSubmit={handleReplySubmit} className='flex gap-3 w-full'>
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
          value={replyComment}
          onChange={(e) => setReplyComment(e.target.value)}
        />
        <div className='flex gap-6 mt-2'>
          <input
            className="bg-blue-300 rounded-3xl max-w-fit px-4 cursor-pointer"
            value="Add"
            type="submit"
          />
          <button
            type="button"
            onClick={() => setReplyCommentId(null)}
            className='max-w-fit p-1 bg-slate-800 border border-gray-200 rounded-lg'
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
