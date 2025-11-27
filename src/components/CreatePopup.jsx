import React, { useState, useRef, useEffect } from "react";

function CreateMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close popup when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      
      {/* Create Button */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-neutral-800 text-white rounded-full flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        Create
      </button>

      {/* Popup Menu */}
      {open && (
        <div className="absolute left-0 mt-3 mr-10  w-52 bg-[#1f1f1f] rounded-xl shadow-lg p-3 z-50">
          
          {/* Option 1 */}
          <button className="flex gap-3 items-center w-full text-white hover:bg-[#333] p-2 rounded-lg">
            <span>📤</span>
            Upload video
          </button>

          {/* Option 2 */}
          <button className="flex gap-3 items-center w-full text-white hover:bg-[#333] p-2 rounded-lg">
            <span>📡</span>
            Go live
          </button>

          {/* Option 3 */}
          <button className="flex gap-3 items-center w-full text-white hover:bg-[#333] p-2 rounded-lg">
            <span>📝</span>
            Create post
          </button>

        </div>
      )}
    </div>
  );
}

export default CreateMenu;
