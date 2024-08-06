import React from "react";

const AboutUs = () => {
  const toggleRinging = () => {
    // Your function logic here
  };

  return (
    <div
      className="bg-[#333D44]"
    >
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="md:w-1/2 flex justify-center md:justify-start mb-8 md:mb-0">
          <img
            src="https://uic.group/_next/image?url=https%3A%2F%2Fuic.group%2Fmedia%2Fcache%2F5a%2F70%2F5a70d134e3000c5ef605393b360f73fe.jpg&w=1080&q=75"
            alt="Workspace"
            className="max-w-md mx-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-4">
            Your description text goes here. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
            vestibulum. Cras venenatis euismod malesuada.
          </p>
          <p className="text-lg mb-4">
            Another paragraph of description text. Praesent ut ligula non mi
            varius sagittis. In hac habitasse platea dictumst. Praesent egestas
            tristique nibh.
          </p>
          <button
            className="hover:bg-[#70c3c1] hover:text-black flex cursor-pointer items-center justify-center rounded-xl px-4 py-3 pl-6 text-[13px] md:text-base font-semibold text-white transition duration-300 bg-transparent border border-white hover:border-[#70c3c1]"
            onClick={toggleRinging}
          >
            <div className="flex items-center gap-4">
              <span className="text-[13px] sm:text-base">
                <span className="linear-wipe select-none">Call Us</span>
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="icon"
                className="inline-flex"
              >
                <rect
                  width="24"
                  height="24"
                  rx="12"
                  fill="white"
                  fill-opacity="0.3"
                ></rect>
                <path
                  d="M12.9695 13.6577C12.7326 13.8944 12.4957 14.2495 12.3181 14.5455C11.2522 13.7168 10.3047 12.7106 9.47566 11.7044C9.83097 11.5269 10.1271 11.2901 10.3639 11.0534C11.5483 9.86958 11.1337 8.33068 9.9494 7.14691C8.76506 5.96314 7.28463 5.48963 6.04107 6.73259C4.7975 7.97555 4.67907 10.1063 5.62655 11.4677C7.34384 14.072 9.9494 16.6763 12.555 18.3927C13.9762 19.3398 16.108 19.1622 17.2923 17.9784C18.4767 16.7946 18.0622 15.2557 16.8778 14.072C15.6935 12.8882 14.1538 12.4147 12.9695 13.6577Z"
                  stroke="white"
                  stroke-width="1.6"
                  stroke-miterlimit="10"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M19 11C19 7.66667 16.3333 5 13 5"
                  stroke="white"
                  stroke-width="1.6"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M16 11C16 9.34043 14.6531 8 13 8"
                  stroke="white"
                  stroke-width="1.6"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
