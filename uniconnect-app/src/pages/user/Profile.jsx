import React from "react";

const posts = [
  {
    text: "Excited to collaborate with amazing developers for Hackathon 2026 🚀",
    time: "2 hours ago",
  },
  {
    text: "Just completed a React project. Learned a lot about UI design!",
    time: "1 day ago",
  },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-8 flex justify-center">

      <div className="w-full max-w-6xl space-y-6">

        {/* PROFILE HEADER */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              className="w-16 h-16 rounded-full"
            />

            <div>

              <h1 className="text-lg font-semibold text-gray-800">
                Rahul Sharma
              </h1>

              <p className="text-sm text-gray-500">
                Full Stack Developer • React • Node
              </p>

              <p className="text-xs text-gray-400">
                Delhi, India
              </p>

            </div>

          </div>

          <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg">
            Edit Profile
          </button>

        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT SIDEBAR */}
          <div className="space-y-6">

            {/* SKILLS */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">

              <h3 className="font-semibold text-gray-800 mb-3">Skills</h3>

              <div className="flex flex-wrap gap-2">

                <span className="px-3 py-1 text-xs bg-gray-100 rounded">React</span>
                <span className="px-3 py-1 text-xs bg-gray-100 rounded">Node.js</span>
                <span className="px-3 py-1 text-xs bg-gray-100 rounded">MongoDB</span>
                <span className="px-3 py-1 text-xs bg-gray-100 rounded">UI Design</span>
                <span className="px-3 py-1 text-xs bg-gray-100 rounded">Figma</span>

              </div>

            </div>

            {/* MUTUAL CONNECTIONS */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">

              <h3 className="font-semibold text-gray-800 mb-3">
                Connections
              </h3>

              <div className="flex -space-x-3">

                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  className="w-9 h-9 rounded-full border-2 border-white"
                />

                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  className="w-9 h-9 rounded-full border-2 border-white"
                />

                <img
                  src="https://randomuser.me/api/portraits/men/12.jpg"
                  className="w-9 h-9 rounded-full border-2 border-white"
                />

              </div>

              <p className="text-xs text-gray-400 mt-2">
                60 connections
              </p>

            </div>

            {/* GROUPS */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">

              <h3 className="font-semibold text-gray-800 mb-3">
                Groups
              </h3>

              <div className="space-y-2 text-sm text-gray-600">

                <p>🚀 React Developers</p>
                <p>💡 Startup Builders</p>
                <p>🎨 UI/UX Designers</p>
                <p>🧠 AI Enthusiasts</p>

              </div>

            </div>

            {/* CERTIFICATES */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">

              <h3 className="font-semibold text-gray-800 mb-3">
                Certificates
              </h3>

              <div className="space-y-2 text-sm text-gray-600">

                <p>✔ Google UX Design Certificate</p>
                <p>✔ Meta Frontend Developer</p>
                <p>✔ AWS Cloud Practitioner</p>

              </div>

            </div>

          </div>

          {/* MAIN CONTENT */}
          <div className="col-span-2 space-y-6">

            {/* ABOUT */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">

              <h3 className="font-semibold text-gray-800 mb-2">
                About Me
              </h3>

              <p className="text-sm text-gray-600">
                Passionate full stack developer who enjoys building scalable
                web applications and collaborating with talented teams.
              </p>

            </div>

            {/* EXPERIENCE */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">

              <h3 className="font-semibold text-gray-800 mb-4">
                Experience
              </h3>

              <div className="space-y-4 text-sm">

                <div>
                  <p className="font-medium text-gray-800">
                    Freelance Art Director
                  </p>

                  <p className="text-gray-500">
                    Apple Corporation • Present
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    UX Designer
                  </p>

                  <p className="text-gray-500">
                    Apple Corporation • 2017 - Present
                  </p>
                </div>

              </div>

            </div>

            {/* PROJECTS */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">

              <div className="flex justify-between items-center mb-4">

                <h3 className="font-semibold text-gray-800">
                  Projects
                </h3>

                <button className="text-sm text-blue-600">
                  + Add Project
                </button>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">

                  <h4 className="text-sm font-medium text-gray-800">
                    UniConnect
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    Social network for university collaboration.
                  </p>

                  <div className="flex gap-2 mt-3 text-xs text-gray-400">
                    <span>React</span>
                    <span>Node</span>
                    <span>MongoDB</span>
                  </div>

                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">

                  <h4 className="text-sm font-medium text-gray-800">
                    Task Manager
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    Productivity app for managing projects.
                  </p>

                  <div className="flex gap-2 mt-3 text-xs text-gray-400">
                    <span>Next.js</span>
                    <span>Express</span>
                  </div>

                </div>

              </div>

            </div>

            {/* ACTIVITY */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">

              <h3 className="font-semibold text-gray-800 mb-4">
                Recent Activity
              </h3>

              <div className="space-y-4">

                {posts.map((post, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >

                    <p className="text-sm text-gray-700">
                      {post.text}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {post.time}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}