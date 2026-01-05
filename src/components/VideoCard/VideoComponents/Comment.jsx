import React, { useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { addComment } from '../../../services/comment.service';

  const Comment = ({
      setOpen,
      open,
      user,
      videoInfo,
      commentInfo,
    }) => {

      const [comment, setComment] = useState("")
      let videoId;
      if (videoInfo) {
       videoId = videoInfo._id;
        
      }
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!comment.trim()) return;
        console.log(comment)
       try {
        
         const res= await addComment(comment, videoId);
         console.log(res)
       } catch (error) {
        console.log(error)
       }
        setComment("")
      }

      return (
        <div className='w-full'>
          <div className="flex justify-between">
            <h2 className="text-sm sm:text-base font-semibold mb-3">
              Comments
            </h2>
            {
              open ? (
                <h2
                  onClick={() => setOpen(false)}
                >
                  <IoMdClose
                    className="h-7 w-7"
                  />
                </h2>
              ) : (
                <h2
                  onClick={() => setOpen(true)}
                ><IoReorderThreeSharp
                    className="h-7 w-7"
                  /></h2>
              )
            }
          </div>

          <div className="flex gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gray-600" >
              {
                user?.avatar && (<img
                  className="w-full h-full object-cover overflow-hidden rounded-full"
                  src={`${user.avatar}`}
                />)
              }
            </div>
            <form onSubmit={handleSubmit} className='w-full flex justify-between'>
            <input
              className="flex-1 bg-transparent border-b border-gray-600 outline-none text-sm"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <input
              className="bg-blue-300 rounded-md max-w-fit px-2 "
              value="Add"
              type="submit" />
              </form>
          </div>

          {/* SINGLE COMMENT */}
          {
            open && videoInfo?.owner && commentInfo.length > 0 ? (
              commentInfo.map((comment) => (
                <div className="flex gap-3  mb-3" key={comment._id}>

                  <div className="w-9 h-9 rounded-full bg-gray-600" >
                    {
                      comment?.user?.avatar && (<img
                        src={`${comment?.user?.avatar}`}
                        className="h-full w-full rounded-full object-cover overflow-hidden"
                      />)
                    }
                  </div>

                  <div className="flex  w-full justify-between">
                    <div className="flex flex-col ">
                      <p className="text-sm font-medium">{comment.user.username}</p>
                      <p className="text-sm text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                    <div>
                      <BsThreeDotsVertical />
                    </div>
                  </div>

                </div>
              ))

            ) : null
          }
        </div>
      )
    }

    export default Comment
