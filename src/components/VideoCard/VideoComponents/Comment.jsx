import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { addCommentForSpecificComment, addCommentVideo, deleteComment } from '../../../services/comment.service';
import { SlDislike, SlLike } from "react-icons/sl";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { useSelector } from 'react-redux';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegFlag } from "react-icons/fa";
import socket from "../../../Socket";
import { userCommentReactionStatus, toggleUserReactionForComment } from '../../../services/like.service';
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import ReplyComment from './ReplyComment';
import EditComment from './EditComent';
import { generateNewAccessToken } from '../../../services/user.service';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/auth.slice';

// Main Comment Component
const Comment = ({ setOpen, open, user, videoInfo, commentInfo, replyedCommentInfo, setReplyedCommentInfo, setCommentInfo }) => {

  const [comment, setComment] = useState("");
  const [submitButton, setSubmitButton] = useState(false);
  const [replyCommentContent, setReplyCommentContent] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [commentReactions, setCommentReactions] = useState({});
  const [openCommentfunctionality, setOpenCommentfunctionality] = useState(null);
  const authData = useSelector((state) => state.auth.userData);
  const [openRepliesComent, setOpenRepliesComment] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState(null);
  const isVideoOwner = videoInfo?.owner?._id === authData?._id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (videoInfo?._id) setVideoId(videoInfo._id);
  }, [videoInfo]);

  // Initialize reactions for comments
  useEffect(() => {
    if (!commentInfo.length) return;

    const fetchStatus = async () => {
      let res = await userCommentReactionStatus(videoId);
         if (res?.response?.data?.data === "Unauthorized request, Token created") {
                let res2 = await generateNewAccessToken();
                if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                  alert("Your refresh Token expiry, please Login and useSpecific services");
                  dispatch(logout());
                  navigate("/login");
                  return;
                }
                if (res2?.data?.message === "Access Token is created SuccessFully") {
                  const res3 = await userCommentReactionStatus(videoId);
                  res = res3;
                  return;
                }
              }
      const reactionMap = new Map(res.map(r => [r._id, r.userReaction]));
      const reactions = {};

      commentInfo.forEach((c) => {
        const userreaction = reactionMap.get(c._id) || null;
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
      });

      setCommentReactions(reactions);
    };
    fetchStatus();
  }, [commentInfo, videoId, replyedCommentInfo]);


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
      const res = await toggleUserReactionForComment(commentId, videoId, reaction);
       if (res?.response?.data?.data === "Unauthorized request, Token created") {
                      const res2 = await generateNewAccessToken();
                      if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                          alert("Your refresh Token expiry, please Login and useSpecific services");
                          dispatch(logout());
                          navigate("/login");
                          return;
                      }
                      if (res2?.data?.message === "Access Token is created SuccessFully") {
                           await toggleUserReactionForComment(commentId, videoId, reaction);
                         
                          return;
                      }
                  }
     
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
      const res = await toggleUserReactionForComment(commentId, videoId, reaction);
        if (res?.response?.data?.data === "Unauthorized request, Token created") {
                      const res2 = await generateNewAccessToken();
                      if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                          alert("Your refresh Token expiry, please Login and useSpecific services");
                          dispatch(logout());
                          navigate("/login");
                          return;
                      }
                      if (res2?.data?.message === "Access Token is created SuccessFully") {
                           await toggleUserReactionForComment(commentId, videoId, reaction);
                         
                          return;
                      }
                  }
       
    } catch (error) {
      console.log(error);
    }
  };


  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim().length === 0) {
      alert("Please input the more then one value i can not submit your comment");
      return;
    }

   
      const res= await addCommentVideo(comment, videoId);
       if (res?.response?.data?.data === "Unauthorized request, Token created") {
                      const res2 = await generateNewAccessToken();
                      if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                          alert("Your refresh Token expiry, please Login and useSpecific services");
                          dispatch(logout());
                          navigate("/login");
                          return;
                      }
                      if (res2?.data?.message === "Access Token is created SuccessFully") {
                           await addCommentVideo(comment, videoId);
                          return;
                      }
                  }
     
   
    setComment("");
    setSubmitButton(false);

  };

  const handleSubmitButton = () => {
    setSubmitButton(true);
  };

  // Show comment functionality options (edit, delete, etc.)
  const handleShowCommnetFuntionalityPopup = (commentId) => {
    setOpenCommentfunctionality((prevId) => (prevId === commentId ? null : commentId));
  };

  // Delete comment
  const handleDelete = async (comId) => {
 
      const res = await deleteComment(comId, videoId);
       if (res?.response?.data?.data === "Unauthorized request, Token created") {
                      const res2 = await generateNewAccessToken();
                      if (res2?.response?.data?.data === "Refresh Token can not provide please login") {
                          alert("Your refresh Token expiry, please Login and useSpecific services");
                          dispatch(logout());
                          navigate("/login");
                          return;
                      }
                      if (res2?.data?.message === "Access Token is created SuccessFully") {
                           await deleteComment(comId, videoId);
                          return;
                      }
                  }
  
  };


  //===========socket connection for hard-delete-comment=======//
  useEffect(() => {
    if (!videoId) return;

    socket.on("hard-delete-comment", (deletedCommentId) => {
      setCommentInfo((prev) => prev.filter((c) => c._id !== deletedCommentId));
      setReplyedCommentInfo((prev) => prev.filter((c) => c._id !== deletedCommentId && c.parentComment !== deletedCommentId));
    });

    return () => socket.off("hard-delete-comment");
  }, [videoId]);


  //========socket connection for soft-delete-comment==========//
  useEffect(() => {
    if (!videoId) return;

    socket.on("soft-delete-comment", ({ commentId, content, isDeleted }) => {
      setCommentInfo((prev) => prev.map((c) => (c._id === commentId ? { ...c, content, isDeleted } : c)));
      setReplyedCommentInfo((prev) => prev.map((c) => (c._id === commentId ? { ...c, content, isDeleted } : c)));
    });

    return () => socket.off("soft-delete-comment");
  }, [videoId]);


  //===========socket connection for update-comment===========//
  useEffect(() => {
    if (!videoId) return;

    socket.on("update-comment", ({content, commentId}) => {
      setCommentInfo((prev) => prev.map((c) =>(c._id === commentId ? {...c, content}:c)));

      setReplyedCommentInfo((prev) => prev.map((c) => (
        c._id === commentId ?{...c, content}: c
      )))
    })

    return () => {
      return socket.off("update-comment");
    };
  }, [videoId]);


  const toggleReplies = (commentId) => {
    setOpenRepliesComment(prev => ({
      ...prev,
      [commentId]: !prev[commentId], // toggle open/close
    }));

    //[commentId] this syntax -> transform the value to the key
  };


  // Recursive function to render replies
  const renderReplies = (replies) => {
    return replies.map((reply) => {
      const isReplyOwner = reply?.owner?._id === authData?._id;
      const reactions = commentReactions[reply._id];
      const replyReplies = replyedCommentInfo.filter((r) => r.parentComment === reply._id); // Fetch replies for this reply
      const replyRepliesCount = getTotalRepliesCount(reply?._id, replyedCommentInfo);

      return (
        <div key={reply._id} className="mt-3">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-600">
              {reply?.owner?.avatar && (
                <img
                  src={reply.owner.avatar}
                  className="h-full w-full rounded-full object-cover"
                  alt="comment owner"
                />
              )}
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <p className="text-sm font-medium">{reply.owner.username}</p>
                {(!reply.isDeleted) || (reply.isDeleted && isVideoOwner) ? (
                  <div className="relative cursor-pointer">
                    {
                      isVideoOwner && (
                        <div>
                          <BsThreeDotsVertical onClick={() => handleShowCommnetFuntionalityPopup(reply._id)} />
                          {openCommentfunctionality === reply._id && (
                            <div className="absolute top-1 p-2 bg-transparent rounded-md flex flex-col right-5 shadow-lg z-5 border border-slate-900">
                              {
                                (isVideoOwner === isReplyOwner) && (
                                  <div className=" px-5 py-1 my-1 rounded-sm  shadow-md flex gap-x-2 items-center">
                                    <MdEdit />
                                     <button
                                      onClick={() => {
                                        setEditCommentId(reply._id)
                                        setEditCommentContent(reply.content)
                                        handleShowCommnetFuntionalityPopup(reply._id)
                                      }}
                                      >Edit</button>
                                  </div>
                                )
                              }

                              <div className="px-5 py-1 mb-1 rounded-sm shadow-md flex gap-x-2 items-center">
                                <RiDeleteBin5Line />
                                <button onClick={() => handleDelete(reply._id)}>Delete</button>
                              </div>


                              <div className="px-5 py-1 mb-1 rounded-md shadow-md flex gap-x-2 items-center">
                                <FaRegFlag />
                                <h1>Report</h1>
                              </div>

                            </div>
                          )}
                        </div>
                      )
                    }  {
                      !isVideoOwner && isReplyOwner && (
                        <div>
                          <BsThreeDotsVertical onClick={() => handleShowCommnetFuntionalityPopup(reply._id)} />
                          {openCommentfunctionality === reply._id && (
                            <div className="absolute top-1 p-2 bg-transparent rounded-md flex flex-col right-5 shadow-lg z-5 border border-slate-900">

                              <div className="px-5 py-1 my-1 rounded-sm shadow-md flex gap-x-2 items-center">
                                <MdEdit />
                                 <button
                                      onClick={() => {
                                        setEditCommentId(reply._id)
                                        setEditCommentContent(reply.content)
                                        handleShowCommnetFuntionalityPopup(reply._id)
                                      }}
                                      >Edit</button>
                              </div>
                              <div className="px-5 py-1 mb-1 rounded-sm shadow-md flex gap-x-2 items-center">
                                <RiDeleteBin5Line />
                                <button onClick={() => handleDelete(reply._id)}>Delete</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    }
                    {
                      !isVideoOwner && !isReplyOwner && (
                        <div>
                          <BsThreeDotsVertical onClick={() => handleShowCommnetFuntionalityPopup(reply._id)} />
                          {openCommentfunctionality === reply._id && (
                            <div className="absolute top-1 p-2 bg-transparent rounded-md flex flex-col right-5 shadow-lg z-5 border border-slate-900">

                              <div className="px-5 py-1 mb-1 rounded-md shadow-md flex gap-x-2 items-center">
                                <FaRegFlag />
                                <h1>Report</h1>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    }

                  </div>
                ) : null}
              </div>
              <p className="text-sm text-gray-300">{reply.content}</p>

              {/* Reaction controls */}
              {!reply.isDeleted && (
                <div className="flex gap-8 mt-2 items-center">
                  <div className="flex gap-1 items-center cursor-pointer" onClick={() => toggleLike(reply._id)}>
                    {reactions?.like ? <AiFillLike /> : <SlLike />}
                    {reactions?.likeCount}
                  </div>
                  <div className="cursor-pointer" onClick={() => toggleDislike(reply._id)}>
                    {reactions?.dislike ? <AiFillDislike /> : <SlDislike />}
                  </div>
                  <button onClick={() => setReplyCommentId(reply._id)}>Reply</button>
                </div>
              )}

              {
                    editCommentId === reply._id && (
                      <EditComment
                      commentId = {reply._id}
                      user = {user}
                      editCommentContent = {editCommentContent}
                      setEditCommentContent = {setEditCommentContent}
                      setEditCommentId = {setEditCommentId}
                      videoId = {videoId}
                      />
                    )
                  }


              {
                replyCommentId === reply._id && (
                  <ReplyComment
                    commentId={reply._id}
                    user={user}
                    replyCommentContent={replyCommentContent}
                    setReplyCommentContent={setReplyCommentContent}
                    setReplyCommentId={setReplyCommentId}
                    videoId={videoId}
                  />
                )
              }

              {/* Recursively render replies */}
              {openRepliesComent[reply._id] && replyReplies.length > 0 && renderReplies(replyReplies)}
              {
                !openRepliesComent[reply._id] && replyReplies.length > 0 && (
                  <div className='flex gap-3 hover:bg-slate-900 p-2 hover:rounded-full max-w-fit'>
                    <h1>{replyRepliesCount}</h1>
                    <button
                      className='flex items-center gap-2 justify-center '
                      onClick={() => toggleReplies(reply._id)}
                    ><div>
                        {replyRepliesCount === 1 && (<h1>reply</h1>)}
                        {replyRepliesCount > 1 && (<h1>replies</h1>)}
                      </div>
                      <FaChevronDown
                        className='mt-1'
                      />
                    </button>
                  </div>
                )
              }

              {
                openRepliesComent[reply._id] && replyReplies.length > 0 && (
                  <button
                    className='flex  hover:bg-slate-900 p-2 hover:rounded-full max-w-fit  gap-2 items-center'
                    onClick={() => toggleReplies(reply._id)}>
                    <h1> Hide replies</h1><FaChevronUp />
                  </button>
                )
              }
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h2 className="text-sm sm:text-base font-semibold mb-3">Comments</h2>
        {open ? (
          <h2 onClick={() => setOpen(false)}>
            <IoMdClose className="h-7 w-7 cursor-pointer" />
          </h2>
        ) : (
          <h2 onClick={() => setOpen(true)}>
            <IoReorderThreeSharp className="h-7 w-7 cursor-pointer" />
          </h2>
        )}
      </div>

      {/* Add new comment */}
      <div className="flex gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gray-600">
          {user?.avatar && <img className="w-full h-full object-cover rounded-full" src={user.avatar} alt="user avatar" />}
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col justify-between">
          <input
            className="flex-1 bg-transparent border-b border-gray-600 outline-none text-sm w-full"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onClick={handleSubmitButton}
          />
          {submitButton && (
            <div className="flex gap-6 mt-4">
              {comment.length > 0 && (
                <input className="bg-blue-300 rounded-3xl max-w-fit px-4 cursor-pointer" value="Add" type="submit" />
              )}

              <button type="button" onClick={() => setSubmitButton(false)} className="max-w-fit p-2 bg-slate-800 border border-gray-200 rounded-lg">
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Display comments and their replies */}
      {open && videoInfo?.owner && commentInfo.length > 0 &&
        commentInfo.map((comment) => {
          const isCommentOwner = comment?.owner?._id === authData?._id;
          const reactions = commentReactions[comment._id];
          const replies = replyedCommentInfo.filter((r) => r.parentComment === comment._id);
          const replyCount = getTotalRepliesCount(comment?._id, replyedCommentInfo);

          return (
            <div key={comment._id} className="mb-3">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-600">
                  {comment?.owner?.avatar && (
                    <img src={comment.owner.avatar} className="h-full w-full rounded-full object-cover" alt="comment owner" />
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{comment.owner.username}</p>
                    {(!comment.isDeleted) || (comment.isDeleted && isVideoOwner) ? (
                      <div className="relative cursor-pointer">
                        {
                          isVideoOwner && (
                            <div>
                              <BsThreeDotsVertical onClick={() => handleShowCommnetFuntionalityPopup(comment._id)} />
                              {openCommentfunctionality === comment._id && (
                                <div className="absolute top-1 p-2 bg-transparent rounded-md flex flex-col right-5 shadow-lg z-5 border border-slate-900">
                                  {(isVideoOwner === isCommentOwner) && (
                                    <div className=" px-5 py-1 my-1 rounded-sm  shadow-md flex gap-x-2 items-center">
                                      <MdEdit />
                                      <button
                                      onClick={() => {
                                        setEditCommentId(comment._id)
                                        setEditCommentContent(comment.content)
                                        handleShowCommnetFuntionalityPopup(comment._id)
                                      }}
                                      >Edit</button>
                                    </div>
                                  )}

                                  <div className="px-5 py-1 mb-1 rounded-sm shadow-md flex gap-x-2 items-center">
                                    <RiDeleteBin5Line />
                                    <button onClick={() => handleDelete(comment._id)}>Delete</button>
                                  </div>


                                  <div className="px-5 py-1 mb-1 rounded-md shadow-md flex gap-x-2 items-center">
                                    <FaRegFlag />
                                    <h1>Report</h1>
                                  </div>

                                </div>
                              )}
                            </div>
                          )
                        }  {
                          !isVideoOwner && isCommentOwner && (
                            <div>
                              <BsThreeDotsVertical onClick={() => handleShowCommnetFuntionalityPopup(comment._id)} />
                              {openCommentfunctionality === comment._id && (
                                <div className="absolute top-1 p-2 bg-transparent rounded-md flex flex-col right-5 shadow-lg z-5 border border-slate-900">

                                  <div className="px-5 py-1 my-1 rounded-sm shadow-md flex gap-x-2 items-center">
                                    <MdEdit />
                                    <button
                                      onClick={() => {
                                        setEditCommentId(comment._id)
                                        setEditCommentContent(comment.content)
                                        handleShowCommnetFuntionalityPopup(comment._id)
                                      }}
                                      >Edit</button>
                                  </div>
                                  <div className="px-5 py-1 mb-1 rounded-sm shadow-md flex gap-x-2 items-center">
                                    <RiDeleteBin5Line />
                                    <button onClick={() => handleDelete(comment._id)}>Delete</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        }
                        {
                          !isVideoOwner && !isCommentOwner && (
                            <div>
                              <BsThreeDotsVertical onClick={() => handleShowCommnetFuntionalityPopup(comment._id)} />
                              {openCommentfunctionality === comment._id && (
                                <div className="absolute top-1 p-2 bg-transparent rounded-md flex flex-col right-5 shadow-lg z-5 border border-slate-900">

                                  <div className="px-5 py-1 mb-1 rounded-md shadow-md flex gap-x-2 items-center">
                                    <FaRegFlag />
                                    <h1>Report</h1>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        }

                      </div>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-300">{comment.content}</p>

                  {
                    !comment.isDeleted && (
                      <div className="flex gap-8 mt-2 items-center">
                        <div className="flex gap-1 items-center cursor-pointer" onClick={() => toggleLike(comment._id)}>
                          {reactions?.like ? <AiFillLike /> : <SlLike />}
                          {reactions?.likeCount}
                        </div>
                        <div className="cursor-pointer" onClick={() => toggleDislike(comment._id)}>
                          {reactions?.dislike ? <AiFillDislike /> : <SlDislike />}
                        </div>
                        <button onClick={() => setReplyCommentId(comment._id)}>Reply</button>
                      </div>
                    )
                  }
                  {
                    editCommentId === comment._id && (
                      <EditComment
                      commentId = {comment._id}
                      user = {user}
                      editCommentContent = {editCommentContent}
                      setEditCommentContent = {setEditCommentContent}
                      setEditCommentId = {setEditCommentId}
                      videoId = {videoId}
                      />
                    )
                  }


                  {
                    replyCommentId === comment._id && (
                      <ReplyComment
                        commentId={comment._id}
                        user={user}
                        replyCommentContent={replyCommentContent}
                        setReplyCommentContent={setReplyCommentContent}
                        setReplyCommentId={setReplyCommentId}
                        videoId={videoId}
                      />
                    )
                  }

                  {/* Recursively render replies */}
                  {openRepliesComent[comment._id] && replies.length > 0 && renderReplies(replies)}
                  {
                    !openRepliesComent[comment._id] && replies.length > 0 && (
                      <div className='flex gap-3 hover:bg-slate-900 p-2 hover:rounded-full max-w-fit'>
                        <h1>{replyCount}</h1>
                        <button
                          className='flex items-center gap-2 justify-center '
                          onClick={() => toggleReplies(comment._id)}
                        ><div>
                            {replyCount === 1 && (<h1>reply</h1>)}
                            {replyCount > 1 && (<h1>replies</h1>)}
                          </div>
                          <FaChevronDown
                            className='mt-1'
                          />
                        </button>
                      </div>
                    )
                  }

                  {
                    openRepliesComent[comment._id] && replies.length > 0 && (
                      <button
                        className='flex  hover:bg-slate-900 p-2 hover:rounded-full max-w-fit  gap-2 items-center'
                        onClick={() => toggleReplies(comment._id)}>
                        <h1> Hide replies</h1><FaChevronUp />
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Comment;

// ReplyComment component


const getTotalRepliesCount = (parentId, allReplies) => {

  const directReplies = allReplies.filter((c) => c.parentComment === parentId);

  let count = directReplies.length;

  directReplies.forEach((reply) =>
    count += getTotalRepliesCount(reply._id, allReplies)

  );

  return count;
}
