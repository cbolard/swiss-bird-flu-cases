import React from "react";

interface ColorLegendItem {
  level: string;
  description: string;
  color: string;
}

const colorLegendItems: ColorLegendItem[] = [
  {
    level: "Dark Red",
    description:
      "Critical: Metrics over 500 indicate a very high level of danger.",
    color: "rgba(139, 0, 0, 0.3)", // Dark Red with 30% opacity
  },
  {
    level: "Red",
    description:
      "High: Metrics between 200 and 500 indicate a high level of danger.",
    color: "rgba(255, 0, 0, 0.3)", // Red with 30% opacity
  },
  {
    level: "Orange",
    description:
      "Moderate: Metrics between 100 and 200 indicate a moderate level of danger.",
    color: "rgba(255, 165, 0, 0.3)", // Orange with 30% opacity
  },
  {
    level: "Yellow",
    description:
      "Low: Metrics between 50 and 100 indicate a low level of danger.",
    color: "rgba(255, 255, 0, 0.3)", // Yellow with 30% opacity
  },
  {
    level: "Green",
    description: "Safe: Metrics below 50 indicate a safe level.",
    color: "rgba(0, 255, 0, 0.3)", // Green with 30% opacity
  },

  {
    level: "Default",
    description: "Default: Default color for the map.",
    color: "rgba(204, 204, 204, 0.3)", // Default color
  },
];

const ColorLegend: React.FC = () => {
  return (
    <aside className="bg-gray-800 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-gray-700">
      <header className="flex items-center justify-between border-b border-gray-700 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <h2 className="text-base font-semibold leading-7 text-white">
          Indicators of Danger
        </h2>
      </header>
      <ul role="list" className="divide-y divide-gray-700">
        {colorLegendItems.map((item) => (
          <li key={item.level} className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-3">
              <span
                className="h-6 w-6 flex-none rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              ></span>
              <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-white">
                {item.level}
              </h3>
            </div>
            <p className="mt-3 truncate text-sm text-gray-400">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ColorLegend;
