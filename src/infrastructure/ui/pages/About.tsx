import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function About() {
  return (
    <div className=" px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-white">
        <p className="text-base font-semibold leading-7 text-indigo-600">Introducing</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Bird Flu Geodata Dashboard</h1>
        <p className="mt-6 text-xl leading-8">
          The Bird Flu Geodata Dashboard provides a platform to visualize and analyze bird flu cases across different
          regions over time. The interactive map and associated data enable decision-makers and policymakers to track
          and respond to outbreaks in a user-friendly interface.
        </p>
        <div className="mt-10 max-w-2xl">
          <p>
            This tool is specifically designed for non-technical users, such as politicians and stakeholders, to easily
            interpret complex spatial data. It displays bird flu outbreaks, showing key metrics such as different
            influenza strains like H5N1, H5N2, H7N2, and H7N8 across regions in Switzerland.
          </p>
          <ul role="list" className="mt-8 max-w-xl space-y-8 text-white">
            <li className="flex gap-x-3">
              <CheckCircleIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
              <span>
                <strong className="font-semibold text-white-900">FAIR and ORD principles.</strong> The dashboard is built
                to follow these standards, ensuring data is findable, accessible, interoperable, reusable, and open for
                research.
              </span>
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
              <span>
                <strong className="font-semibold text-white">Interactive map.</strong> Users can easily visualize
                geographic patterns and trends of bird flu outbreaks over time.
              </span>
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
              <span>
                <strong className="font-semibold text-white">Influenza variants.</strong> Detailed breakdown of
                cases across multiple flu variants such as H5N1, H5N2, H7N2, and H7N8.
              </span>
            </li>
          </ul>
          <p className="mt-8">
            The dashboard simplifies the decision-making process by offering a clear, visually rich representation of
            the flu cases across various cantons, providing actionable insights for controlling outbreaks.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-white">Supporting informed decisions</h2>
          <p className="mt-6">
            The ability to quickly interpret and respond to health crises like bird flu outbreaks is critical. This
            platform enables stakeholders to view real-time data on flu cases, monitor trends, and make informed
            decisions without needing in-depth technical knowledge.
          </p>

        </div>
      </div>
    </div>
  );
}
