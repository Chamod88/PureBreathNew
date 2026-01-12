import Header from "@/components/Header";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-[#E9EDF0] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About PureBreath</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Our Mission</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    PureBreath is an independent, research-driven digital project focused on making air quality information more accessible, understandable, and actionable.
                  </p>
                  <p>
                    This project is designed and developed by Thisara Chamod, a second-year undergraduate student at the Informatics Institute of Technology (IIT). PureBreath was created as part of an academic and personal initiative to explore how modern software engineering, data processing, and intelligent systems can be applied to address real-world environmental and public health challenges.
                  </p>
                  <p>
                    Every aspect of the platform — including system design, frontend development, backend services, and data handling — has been developed by a single contributor with a strong emphasis on clarity, performance, and reliability. Although PureBreath is currently maintained as a solo project, it is built with scalability and future expansion in mind.
                  </p>
                  <p>
                    PureBreath reflects a commitment to continuous learning, responsible use of technology, and the application of technical skills to create meaningful, real-world impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
                <img
                  src="/your-photo.jpg"
                  alt="Thisara Chamod - Developer of PureBreath"
                  className="w-full h-auto rounded-lg object-cover"
                />
                <div className="text-center mt-4">
                  <h3 className="text-xl font-semibold text-gray-800">Thisara Chamod</h3>
                  <p className="text-gray-600">Developer & Creator</p>
                  <p className="text-sm text-gray-500 mt-1">Informatics Institute of Technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
