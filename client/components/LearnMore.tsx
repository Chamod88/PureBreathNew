export default function LearnMore() {
  return (
    <section id="learn-more" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About PureBreath
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing respiratory health monitoring with cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Our advanced machine learning algorithms analyze lung and breathing sounds to detect potential respiratory conditions with high accuracy.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Non-Invasive Screening</h3>
              <p className="text-gray-600">
                Fast, accurate, and completely non-invasive respiratory health screening using just audio recordings.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Technology</h3>
              <p className="text-gray-600">
                Combines signal processing, feature engineering, and deep learning with convolutional neural networks for precise classification.
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Clinical & Remote Use</h3>
              <p className="text-gray-600">
                Valuable tool for both clinical settings and remote monitoring scenarios, providing insights wherever you are.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload Audio Sample</h4>
              <p className="text-gray-600 text-sm">Record or upload your lung sounds for analysis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-gray-600 text-sm">Analyzing the audio sample with our latest ML models</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Results</h4>
              <p className="text-gray-600 text-sm">Receive diagnosis, doctor recommendations, and prevention tips</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}