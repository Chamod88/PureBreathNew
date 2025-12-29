export default function Hero() {
  return (
    <section className="bg-[#E9EDF0] w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-24 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-5xl lg:text-[64px] font-bold leading-tight">
              Early Lung Disease Detection with AI-Powered sound Analysis
            </h1>

            <p className="text-lg md:text-2xl">
              Fast, accurate and non-invasive
              <br />
              respiratory health screening
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-white px-8 py-4 rounded-[43px] text-lg md:text-2xl font-semibold hover:bg-primary/90 transition-colors">
                Upload Sound
              </button>
              <button className="bg-[#E9EDF0] text-primary px-8 py-4 rounded-[43px] border-[5px] border-primary text-lg md:text-2xl font-semibold hover:bg-white transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/35dd9a1f5a042ce13e1b0a057e5dc37f95549ff4?width=1306"
              alt="AI-Powered Lung Analysis Illustration"
              className="w-full max-w-[500px] lg:max-w-[653px] h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
