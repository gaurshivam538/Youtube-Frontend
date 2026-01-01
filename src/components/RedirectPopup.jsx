
import React from 'react'

const RedirectPopup = ({
    open, onLogin, onBack, secondsLefts}
) => {
  return (
    <div className=''>
     <div className=" fixed inset-0 z-40 bg-black/50 backdrop-blur-sm pointer-events-auto bottom-0" />

      {/* ⬆️ Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-[50%] z-50 flex justify-center">
        <div
          className="
            w-full max-w-md
            bg-neutral-900 text-white
            rounded-2xl
            p-6
            animate-slideUp
          "
        >
          <h3 className="text-lg font-semibold mb-2">
            Login Required
          </h3>

          <p className="text-sm text-neutral-300 mb-4">
            Please login to continue watching this video.
            <br />
            Redirecting in{" "}
            <span className="font-bold text-white">
              {secondsLefts}s
            </span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={onLogin}
              className="
                flex-1
                bg-red-600 hover:bg-red-700
                text-white font-medium
                py-2 rounded-lg
                transition
              "
            >
              Login Now
            </button>

            <button
              onClick={onBack}
              className="
                flex-1
                bg-neutral-700 hover:bg-neutral-600
                text-white
                py-2 rounded-lg
                transition
              "
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
  </div>
  );
}

export default RedirectPopup
