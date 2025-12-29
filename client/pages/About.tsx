import Header from "@/components/Header";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-[#E9EDF0]">
        <div className="max-w-2xl text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            This page is coming soon. Continue prompting to add content here!
          </p>
        </div>
      </div>
    </div>
  );
}
