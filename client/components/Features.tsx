export default function Features() {
  return (
    <section className="bg-gray-50 w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the powerful capabilities that make PureBreath a leader in respiratory health technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<AIIcon />}
            title="Instant AI Analysis"
            description="Advanced AI algorithms process audio data in real-time to deliver immediate insights and respiratory health assessments."
          />
          <FeatureCard
            icon={<AccuracyIcon />}
            title="High Accuracy"
            description="Clinically validated algorithms with high accuracy rates for detecting various respiratory conditions and abnormalities."
          />
          <FeatureCard
            icon={<SecurityIcon />}
            title="Secure & Private"
            description="Enterprise-grade security ensures patient data privacy and compliance with healthcare regulations throughout the entire process."
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed text-center">{description}</p>
    </div>
  );
}

function AIIcon() {
  return (
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M52 23.1111V17.3333H46.2222V11.5556C46.2176 10.0246 45.6075 8.55765 44.5249 7.4751C43.4423 6.39255 41.9754 5.78235 40.4444 5.77778H34.6667V0H28.8889V5.77778H23.1111V0H17.3333V5.77778H11.5556C10.0246 5.78235 8.55765 6.39255 7.4751 7.4751C6.39255 8.55765 5.78235 10.0246 5.77778 11.5556V17.3333H0V23.1111H5.77778V28.8889H0V34.6667H5.77778V40.4444C5.78235 41.9754 6.39255 43.4423 7.4751 44.5249C8.55765 45.6075 10.0246 46.2176 11.5556 46.2222H17.3333V52H23.1111V46.2222H28.8889V52H34.6667V46.2222H40.4444C41.9754 46.2176 43.4423 45.6075 44.5249 44.5249C45.6075 43.4423 46.2176 41.9754 46.2222 40.4444V34.6667H52V28.8889H46.2222V23.1111H52ZM40.4444 40.4444H11.5556V11.5556H40.4444V40.4444Z"
          fill="#3B82F6"
        />
      </svg>
    </div>
  );
}

function AccuracyIcon() {
  return (
    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 59 59"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.25 0V6.0375C21.1166 6.68848 16.3452 9.02736 12.6863 12.6863C9.02736 16.3452 6.68848 21.1166 6.0375 26.25H0V32.0833H6.0375C6.68848 37.2167 9.02736 41.9881 12.6863 45.647C16.3452 49.306 21.1166 51.6449 26.25 52.2958V58.3333H32.0833V52.2958C37.2167 51.6449 41.9881 49.306 45.647 45.647C49.306 41.9881 51.6449 37.2167 52.2958 32.0833H58.3333V26.25H52.2958C51.6449 21.1166 49.306 16.3452 45.647 12.6863C41.9881 9.02736 37.2167 6.68848 32.0833 6.0375V0M26.25 11.9V17.5H32.0833V11.9292C39.375 13.125 45.2083 18.9583 46.4333 26.25H40.8333V32.0833H46.4042C45.2083 39.375 39.375 45.2083 32.0833 46.4333V40.8333H26.25V46.4042C18.9583 45.2083 13.125 39.375 11.9 32.0833H17.5V26.25H11.9292C13.125 18.9583 18.9583 13.125 26.25 11.9ZM29.1667 26.25C28.3931 26.25 27.6513 26.5573 27.1043 27.1043C26.5573 27.6513 26.25 28.3931 26.25 29.1667C26.25 29.9402 26.5573 30.6821 27.1043 31.2291C27.6513 31.776 28.3931 32.0833 29.1667 32.0833C29.9402 32.0833 30.6821 31.776 31.2291 31.2291C31.776 30.6821 32.0833 29.9402 32.0833 29.1667C32.0833 28.3931 31.776 27.6513 31.2291 27.1043C30.6821 26.5573 29.9402 26.25 29.1667 26.25Z"
          fill="#10B981"
        />
      </svg>
    </div>
  );
}

function SecurityIcon() {
  return (
    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 58 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.5 53.1667C19.1709 53.1667 18.0334 52.6938 17.0877 51.7481C16.142 50.8024 15.6683 49.6641 15.6667 48.3334V24.1667C15.6667 22.8375 16.1404 21.7001 17.0877 20.7544C18.035 19.8086 19.1725 19.335 20.5 19.3334H22.9167V14.5C22.9167 11.157 24.0952 8.30772 26.4523 5.95227C28.8093 3.59683 31.6586 2.4183 35 2.41669C38.3415 2.41508 41.1915 3.59361 43.5502 5.95227C45.9089 8.31094 47.0866 11.1602 47.0834 14.5V19.3334H49.5C50.8292 19.3334 51.9674 19.807 52.9148 20.7544C53.8621 21.7017 54.335 22.8391 54.3334 24.1667V48.3334C54.3334 49.6625 53.8605 50.8008 52.9148 51.7481C51.969 52.6954 50.8308 53.1683 49.5 53.1667H20.5ZM20.5 48.3334H49.5V24.1667H20.5V48.3334ZM35 41.0834C36.3292 41.0834 37.4674 40.6105 38.4148 39.6648C39.3621 38.7191 39.835 37.5808 39.8334 36.25C39.8317 34.9192 39.3589 33.7818 38.4148 32.8377C37.4707 31.8936 36.3324 31.4199 35 31.4167C33.6676 31.4135 32.5302 31.8871 31.5877 32.8377C30.6452 33.7882 30.1715 34.9257 30.1667 36.25C30.1619 37.5744 30.6355 38.7126 31.5877 39.6648C32.5399 40.6169 33.6773 41.0898 35 41.0834ZM27.75 19.3334H42.25V14.5C42.25 12.4861 41.5452 10.7743 40.1354 9.36461C38.7257 7.95488 37.0139 7.25002 35 7.25002C32.9861 7.25002 31.2743 7.95488 29.8646 9.36461C28.4549 10.7743 27.75 12.4861 27.75 14.5V19.3334Z"
          fill="#8B5CF6"
        />
      </svg>
    </div>
  );
}
