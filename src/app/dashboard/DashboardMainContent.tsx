'use client';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, LineChart, Line
} from 'recharts';

const pieData = [
  { name: 'Chairs', value: 400 },
  { name: 'Tables', value: 300 },
  { name: 'Sofas', value: 300 },
  { name: 'Beds', value: 200 },
];

const monthlySalesData = [
  { month: 'Jan', sales: 3000 },
  { month: 'Feb', sales: 2000 },
  { month: 'Mar', sales: 2780 },
  { month: 'Apr', sales: 1890 },
  { month: 'May', sales: 2390 },
  { month: 'Jun', sales: 3490 },
];

const topProductsData = [
  { name: 'Premium Sofa', sold: 320 },
  { name: 'Oak Dining Table', sold: 290 },
  { name: 'Ergonomic Chair', sold: 250 },
  { name: 'Queen Size Bed', sold: 210 },
  { name: 'Bookshelf', sold: 190 },
];

const recentOrderChartData = [
  { date: 'May 8', total: 449 },
  { date: 'May 9', total: 1098 }, // 199 + 899
  { date: 'May 10', total: 599 },
];

const revenueProfitData = [
  { month: 'Jan', revenue: 5000, profit: 1500 },
  { month: 'Feb', revenue: 4000, profit: 1200 },
  { month: 'Mar', revenue: 4800, profit: 1600 },
  { month: 'Apr', revenue: 3800, profit: 1000 },
  { month: 'May', revenue: 5200, profit: 1900 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardMainContent() {
  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Product Category Share</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Sales Bar Chart */}
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Products Horizontal Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Top 5 Selling Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={topProductsData}
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="sold" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Total per Day Line Chart */}
      <div className="bg-white shadow-md p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Recent Orders Total</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={recentOrderChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#ff7300" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue vs Profit */}
      <div className="bg-white shadow-md p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Revenue vs Profit</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueProfitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
