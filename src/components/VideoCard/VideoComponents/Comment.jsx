import React, { useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { addCommentForSpecificComment, addCommentVideo, deleteComment } from '../../../services/comment.service';
import { SlDislike, SlLike } from "react-icons/sl";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { useEffect } from 'react';
import { toggleUserReactionForComment, userCommentReactionStatus } from '../../../services/like.service';
import { useSelector } from 'react-redux';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegFlag } from "react-icons/fa";
import socket from "../../../Socket"

const Comment = ({ setOpen, open, user, videoInfo, commentInfo, replyedCommentInfo, setReplyedCommentInfo, setCommentInfo }) => {

  const [comment, setComment] = useState("");
  const [submitButton, setSubmitButton] = useState(false);
  const [replyCommentContent, setReplyCommentContent] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [openRepliesComment, setOpenRepliesComment] = useState(null);
  const [commentReactions, setCommentReactions] = useState({});
  const [openCommentfunctionality, setOpenCommentfunctionality] = useState(null);
  const authData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (videoInfo?._id) setVideoId(videoInfo._id);
  }, [videoInfo]);


  //============initialize reactions for comments============//
  useEffect(() => {
    if (!commentInfo.length) return;

    const fetchStatus = async () => {

      const res = await userCommentReactionStatus(videoId);

      const reactionMap = new Map(
        res.map(r => [r._id, r.userReaction])
      );

      const reactions = {};
      // const hai=[];
      commentInfo.forEach((c) => {
        const userreaction = reactionMap.get(c._id) || null
        reactions[c._id] = {
          like: userreaction === "like",
          dislike: userreaction === "dislike",
          likeCount: c.likes || 0,
        };
      });
      replyedCommentInfo.forEach((c) => {
        const userreaction = reactionMap.get(c._id) || null;
        reactions[c._id] = {
          like: userreaction === "like",
          dislike: userreaction === "dislike",
          likeCount: c.likes || 0,
        };
      })
      setCommentReactions(reactions);
    }
    fetchStatus();
  }, [commentInfo, videoId, replyedCommentInfo]);

  // ✅ LIKE HANDLER
  const toggleLike = async (commentId) => {
    const reaction = "like";
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

    try {
      await toggleUserReactionForComment(commentId, videoId, reaction);
    } catch (error) {
      console.log(error);
    }

  };

  // ✅ DISLIKE HANDLER
  const toggleDislike = async (commentId) => {
    const reaction = "dislike";
    setCommentReactions((prev) => {
      const current = prev[commentId];

      const updateReaction = {
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
      return updateReaction;

    });

    try {
      await toggleUserReactionForComment(commentId, videoId, reaction);
    } catch (error) {
      console.log(error);
    }
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

  const handleShowCommnetFuntionalityPopup = (commentId) => {

    setOpenCommentfunctionality((prevId) =>
      prevId === commentId ? null : commentId
    )
  }

  const handleDelete = async (comId) => {
    try {
      const res = await deleteComment(comId, videoId);
      console.log(res);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (!videoId) {
      return;
    }

    socket.on("hard-delete-comment", (deletedCommentId) => {

      setCommentInfo(prev =>
        prev.filter(c => c._id !== deletedCommentId)
      );

      setReplyedCommentInfo(prev =>
        prev.filter(
          c =>
            c._id !== deletedCommentId &&
            c.parentComment !== deletedCommentId
        )
      );
    });


    return () => socket.off("hard-delete-comment")
  }, [videoId]);

  useEffect(() => {

    if (!videoId) {
      return;
    }

    socket.on("soft-delete-comment", ({ commentId, content, isDeleted }) => {
      setCommentInfo((prev) =>
        prev.map((c) => c._id === commentId ? { ...c, content, isDeleted } : c)
      );
      setReplyedCommentInfo((prev) =>
        prev.map((c) => c._id === commentId ? { ...c, content, isDeleted } : c)
      );
    });

    return () => socket.off("soft-delete-comment")
  }, [videoId]);

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
        const isCommentOwner = comment?.owner?._id === authData?._id;
        const isVideoOwner = videoInfo?.owner?._id === authData?._id;
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
                  {
                    (!comment.isDeleted) || (comment.isDeleted && isVideoOwner) ? (<div className="relative cursor-pointer">
                      <BsThreeDotsVertical
                        onClick={() => handleShowCommnetFuntionalityPopup(comment._id)}
                      />
                      {openCommentfunctionality === comment._id &&

                        (
                          <div className='absolute top-1 p-2 bg-transparent rounded-md flex flex-col right-5 shadow-lg z-5 border border-slate-900'>
                            {
                              isVideoOwner && (
                                <>
                                  <div className='px-5 py-1 my-1 rounded-sm shadow-md flex gap-x-2 items-center'> <MdEdit /> <h1>Edit</h1></div>
                                  <div className='px-5 py-1 mb-1  rounded-sm shadow-md flex gap-x-2 items-center'> <RiDeleteBin5Line />
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();  // 
                                        handleDelete(comment._id);
                                        handleShowCommnetFuntionalityPopup(comment._id);
                                      }}
                                    >Delete</button>
                                  </div>
                                  <div className='px-5 py-1 mb-1  rounded-md shadow-md flex gap-x-2 items-center'><FaRegFlag /><h1>Report</h1></div>
                                </>
                              )
                            }
                            {!isVideoOwner && isCommentOwner && (
                              <>
                                <div className='px-5 py-1 my-1 rounded-sm shadow-md flex gap-x-2 items-center'> <MdEdit /> <h1>Edit</h1></div>
                                <div className='px-5 py-1 mb-1  rounded-sm shadow-md flex gap-x-2 items-center'> <RiDeleteBin5Line />
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleShowCommnetFuntionalityPopup(comment._id)
                                      handleDelete(comment._id)
                                    }}
                                  >Delete</button>
                                </div>
                              </>
                            )}{!isVideoOwner && !isCommentOwner && (<div className='px-5 py-1 mb-1  rounded-md shadow-md flex gap-x-2 items-center'><FaRegFlag /><h1>Report</h1></div>)}

                          </div>
                        )}

                    </div>) : null
                  }

                </div>
                <p className="text-sm text-gray-300">{comment.content}</p>

                {/* Comment actions */}
                {
                  !comment.isDeleted && (
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
                  )
                }


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
                  openRepliesComment == comment._id && replyedCommentInfo.map((replyComment) => {
                    const replyReaction = commentReactions[replyComment._id];
                    const isReplyCommentOwner = replyComment?.owner?._id === authData?._id;
                    return (
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
                                {
                                  (!replyComment.isDeleted) || (replyComment.isDeleted && isVideoOwner) ? (
                                    <div className="relative cursor-pointer">
                                      <BsThreeDotsVertical
                                        onClick={() => handleShowCommnetFuntionalityPopup(replyComment._id)}
                                      />
                                      {openCommentfunctionality === replyComment._id &&

                                        (
                                          <div className='absolute top-1 p-2 bg-transparent rounded-md flex flex-col right-5 shadow-lg z-5 border border-slate-900'>
                                            {
                                              isVideoOwner && (
                                                <>
                                                  <div className='px-5 py-1 my-1 rounded-sm shadow-md flex gap-x-2 items-center'> <MdEdit /> <h1>Edit</h1></div>
                                                  <div className='px-5 py-1 mb-1  rounded-sm shadow-md flex gap-x-2 items-center'> <RiDeleteBin5Line />
                                                    <button
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        handleShowCommnetFuntionalityPopup(replyComment._id)
                                                        handleDelete(replyComment._id)
                                                      }}
                                                    >Delete</button>
                                                  </div>
                                                  <div className='px-5 py-1 mb-1  rounded-md shadow-md flex gap-x-2 items-center'><FaRegFlag /><h1>Report</h1></div>
                                                </>
                                              )
                                            }
                                            {!isVideoOwner && isReplyCommentOwner && (
                                              <>
                                                <div className='px-5 py-1 my-1 rounded-sm shadow-md flex gap-x-2 items-center'> <MdEdit /> <h1>Edit</h1></div>
                                                <div className='px-5 py-1 mb-1  rounded-sm shadow-md flex gap-x-2 items-center'> <RiDeleteBin5Line />
                                                  <button
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      handleShowCommnetFuntionalityPopup(replyComment._id)
                                                      handleDelete(replyComment._id)
                                                    }}
                                                  >Delete</button>
                                                </div>
                                              </>
                                            )}{!isVideoOwner && !isReplyCommentOwner && (<div className='px-5 py-1 mb-1  rounded-md shadow-md flex gap-x-2 items-center'><FaRegFlag /><h1>Report</h1></div>)}
                                          </div>
                                        )}
                                    </div>
                                  ) : null
                                }

                              </div>
                              <p className="text-sm text-gray-300">{replyComment.content}</p>

                              {/* Comment actions */}
                              <div className='flex gap-8 mt-2 items-center'>
                                <div
                                  className="flex gap-1 items-center cursor-pointer"
                                  onClick={() => toggleLike(replyComment._id)}
                                >
                                  {replyReaction?.like ? <AiFillLike /> : <SlLike />}
                                  {replyReaction?.likeCount}
                                </div>

                                <div
                                  className="cursor-pointer"
                                  onClick={() => toggleDislike(replyComment._id)}
                                >
                                  {replyReaction?.dislike ? (
                                    <AiFillDislike />
                                  ) : (
                                    <SlDislike />
                                  )}
                                </div>
                                <button onClick={() => setReplyCommentId(replyComment._id)}>Reply</button>
                              </div>
                              {
                                replyedCommentInfo.map((replykereply) => {

                                  return (
                                    <>
                                      {
                                        replykereply.parentComment === replyComment._id && (
                                          <div
                                            key={replykereply._id}
                                          >
                                            <div className="w-9 h-9 rounded-full bg-gray-600">
                                              {replykereply?.owner?.avatar && (
                                                <img
                                                  src={replykereply.owner.avatar}
                                                  className="h-full w-full rounded-full object-cover"
                                                  alt="comment owner"
                                                />
                                              )}
                                            </div>
                                          </div>
                                        )
                                      }
                                    </>
                                  )
                                })
                              }
                            </div>
                          </div>
                        ) : null}
                        {replyCommentId === replyComment._id && (
                          <div className="mt-2 ml-12"> {/* Offset to align with comment text */}
                            <ReplyComment
                              commentId={replyComment._id}
                              user={user}
                              replyCommentContent={replyCommentContent}
                              setReplyCommentContent={setReplyCommentContent}
                              setReplyCommentId={setReplyCommentId}
                              videoId={videoId}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })
                }
                {replies.length > 0 && openRepliesComment === comment._id && (
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
                  replyCommentContent={replyCommentContent}
                  setReplyCommentContent={setReplyCommentContent}
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
const ReplyComment = ({ commentId, user, replyCommentContent, setReplyCommentContent, setReplyCommentId, videoId }) => {

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    // Replace with your API call to submit a reply
    try {
      const res = await addCommentForSpecificComment(replyCommentContent, videoId, commentId)
      console.log(res);
    } catch (error) {
      console.log(error)
    }

    setReplyCommentContent(""); // Clear input
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
          value={replyCommentContent}
          onChange={(e) => setReplyCommentContent(e.target.value)}
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
