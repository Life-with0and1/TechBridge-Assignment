import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import {
  getDashboardSummary,
  getMonthlySummary,
  getYearlySummary,
  getCategorySummary,
} from "../services/dashboardService";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [yearlySummary, setYearlySummary] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const filters = {
          from: appliedFrom,
          to: appliedTo,
        };

        const [
          summaryResponse,
          monthlyResponse,
          yearlyResponse,
          categoryResponse,
        ] = await Promise.all([
          getDashboardSummary(filters),
          getMonthlySummary(filters),
          getYearlySummary(filters),
          getCategorySummary(filters),
        ]);

        setSummary(summaryResponse.summary || null);

        setMonthlySummary(
          monthlyResponse.monthly_summary || []
        );

        setYearlySummary(
          yearlyResponse.yearly_summary || []
        );

        setCategorySummary(
          categoryResponse.category_summary || []
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [appliedFrom, appliedTo]);

  const handleApplyFilters = (event) => {
    event.preventDefault();

    setAppliedFrom(from);
    setAppliedTo(to);
  };

  const handleClearFilters = () => {
    setFrom("");
    setTo("");
    setAppliedFrom("");
    setAppliedTo("");
  };

  const pieData = useMemo(() => {
    return categorySummary.map((item) => ({
      name: item.category,
      value: Number(item.total_expense),
    }));
  }, [categorySummary]);

  const lineData = useMemo(() => {
    return monthlySummary.map((item) => ({
      month: item.month,
      income: Number(item.total_income),
      expense: Number(item.total_expense),
    }));
  }, [monthlySummary]);

  const barData = useMemo(() => {
    return monthlySummary.map((item) => ({
      month: item.month,
      income: Number(item.total_income),
      expense: Number(item.total_expense),
    }));
  }, [monthlySummary]);

  const pieColors = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#9333ea",
    "#ea580c",
    "#0891b2",
    "#ca8a04",
    "#db2777",
  ];

  if (loading) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your personal finances.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleApplyFilters}
        className="dashboard-filters"
      >
        <div>
          <label htmlFor="from">
            From
          </label>

          <input
            id="from"
            type="date"
            value={from}
            onChange={(event) =>
              setFrom(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="to">
            To
          </label>

          <input
            id="to"
            type="date"
            value={to}
            onChange={(event) =>
              setTo(event.target.value)
            }
          />
        </div>

        <button type="submit">
          Apply
        </button>

        <button
          type="button"
          onClick={handleClearFilters}
        >
          Clear
        </button>
      </form>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Income</h3>

          <p>
            ₹
            {Number(
              summary?.total_income || 0
            ).toFixed(2)}
          </p>
        </div>

        <div className="summary-card">
          <h3>Total Expense</h3>

          <p>
            ₹
            {Number(
              summary?.total_expense || 0
            ).toFixed(2)}
          </p>
        </div>

        <div className="summary-card">
          <h3>Balance</h3>

          <p>
            ₹
            {Number(
              summary?.balance || 0
            ).toFixed(2)}
          </p>
        </div>

        <div className="summary-card">
          <h3>Transactions</h3>

          <p>
            {summary?.transaction_count || 0}
          </p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>
            Expense by Category
          </h2>

          {pieData.length === 0 ? (
            <p>
              No expense data available.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {pieData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          pieColors[
                            index %
                              pieColors.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toFixed(2)}`
                  }
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2>
            Monthly Income vs Expense
          </h2>

          {lineData.length === 0 ? (
            <p>
              No monthly data available.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <LineChart
                data={lineData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toFixed(2)}`
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#16a34a"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#dc2626"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2>
            Income vs Expenses
          </h2>

          {barData.length === 0 ? (
            <p>
              No income or expense data available.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart
                data={barData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toFixed(2)}`
                  }
                />

                <Legend />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#16a34a"
                />

                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#dc2626"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="yearly-summary">
        <h2>
          Yearly Summary
        </h2>

        {yearlySummary.length === 0 ? (
          <p>
            No yearly data available.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {yearlySummary.map((item) => {
                const income =
                  Number(item.total_income);

                const expense =
                  Number(item.total_expense);

                return (
                  <tr key={item.year}>
                    <td>
                      {item.year}
                    </td>

                    <td>
                      ₹{income.toFixed(2)}
                    </td>

                    <td>
                      ₹{expense.toFixed(2)}
                    </td>

                    <td>
                      ₹
                      {(income - expense).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;