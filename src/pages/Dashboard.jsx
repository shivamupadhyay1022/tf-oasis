import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";

const data = [
  { name: "Paid", value: 75 },
  { name: "Pending", value: 25 },
];
const COLORS = ["#22c55e", "#f43f5e"];

function StatsCard({ title, value, icon, trend }) {
  return (
    <div className="flex flex-col w-auto border-2 border-gray-200 rounded-lg px-4 py-2 hover:cursor-pointer hover:shadow-lg">
      <p className="text-gray-400 font-semibold">{title}</p>
      <div className="flex justify-between">
        <p className="font-bold text-2xl mt-2">{value}</p>
        <div className="bg-blue-100 rounded-full p-2">{icon}</div>
      </div>
      <div className="flex flex-row items-center">
        {trend?.value && (
          <p
            className={`${
              trend?.isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend?.value + " %"}
          </p>
        )}
        {trend?.value && (
          <div>
            {trend?.isPositive ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3 text-green-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3 text-red-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const Progress = React.forwardRef(function Progress(
  { className = "", value = 0, max = 100, ...props },
  ref
) {
  // Ensure value is within the valid range
  const progressValue = Math.min(Math.max(value, 0), max);
  const percentage = (progressValue / max) * 100;

  return (
    <div
      ref={ref}
      className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

const StudentProgress = ({ name, progress, subject }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{subject}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

const TopPerformers = () => {
  const students = [
    { name: "Nilesh Pandey", progress: 92, subject: "Mathematics" },
    { name: "Shivam", progress: 88, subject: "Science" },
    { name: "Sushmita", progress: 85, subject: "English" },
  ];

  return (
    <div className=" p-6 border-2 border-gray-200 rounded-lg">
      <h3 className="font-semibold">Top Performers</h3>
      <div className="mt-4 space-y-4">
        {students.map((student) => (
          <StudentProgress key={student.name} {...student} />
        ))}
      </div>
    </div>
  );
};

function Dashboard() {
  return (
      <div className=" py-8 animate-in mx-16">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground text-gray-400 font-semibold">
          Welcome back, here's your overview.
        </p>

        <div className="mt-8  grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value="2,451"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            }
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Average Grade"
            value="B+"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
            }
            trend={{ value: 4, isPositive: true }}
          />
          <StatsCard
            title="Fee Collection"
            value="$12,234"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            }
            trend={{ value: 2, isPositive: false }}
          />
          <StatsCard
            title="Active Courses"
            value="18"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            }
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="px-6 pb-12 pt-4 border-2 border-gray-200 rounded-lg">
            <h3 className="font-semibold">Fee Collection Status</h3>
            <div className="mt-4 h-[240px]  ">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center gap-4">
                {data.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <TopPerformers />
        </div>
      </div>
  );
}

export default Dashboard;
