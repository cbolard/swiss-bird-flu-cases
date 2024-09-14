import React from 'react';

interface ActivityItem {
  user: {
    name: string;
    imageUrl: string;
  };
  projectName: string;
  commit: string;
  branch: string;
  date: string;
  dateTime: string;
}

const activityItems: ActivityItem[] = [
  {
    user: {
      name: 'John Doe',
      imageUrl: 'https://unsplash.com/photos/7CjMwZKd3j0',
    },
    projectName: 'Avian Flu Case #123',
    commit: 'Initial report',
    branch: 'main',
    date: '2h',
    dateTime: '2023-10-01T09:00',
  },
  {
    user: {
      name: 'Jane Smith',
      imageUrl: 'https://unsplash.com/photos/7CjMwZKd3j0',
    },
    projectName: 'Avian Flu Case #124',
    commit: 'Follow-up report',
    branch: 'main',
    date: '3h',
    dateTime: '2023-10-01T08:00',
  },
  {
    user: {
      name: 'Alice Johnson',
      imageUrl: 'https://unsplash.com/photos/7CjMwZKd3j0',
    },
    projectName: 'Avian Flu Case #125',
    commit: 'Final report',
    branch: 'main',
    date: '4h',
    dateTime: '2023-10-01T07:00',
  },
];

const ActivityFeed: React.FC = () => {
  return (
    <aside className="bg-gray-800 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-gray-700">
      <header className="flex items-center justify-between border-b border-gray-700 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <h2 className="text-base font-semibold leading-7 text-white">
          Last Activity
        </h2>

      </header>
      <ul role="list" className="divide-y divide-gray-700">
        {activityItems.map((item) => (
          <li key={item.commit} className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-3">
              <img
                className="h-6 w-6 flex-none rounded-full bg-gray-800"
                src={item.user.imageUrl}
                alt=""
              />
              <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-white">
                {item.user.name}
              </h3>
              <time dateTime={item.dateTime} className="flex-none text-xs text-gray-400">
                {item.date}
              </time>
            </div>
            <p className="mt-3 truncate text-sm text-gray-400">
              Pushed to{' '}
              <span className="text-gray-300">{item.projectName}</span> (
              <span className="font-mono text-gray-300">{item.commit}</span> on{' '}
              <span className="text-gray-300">{item.branch}</span>)
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ActivityFeed;
