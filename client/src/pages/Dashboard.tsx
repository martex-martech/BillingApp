import React, { useEffect, useState } from "react";
import { getDashboardData, type DashboardData } from "../services/dashboardservice";

const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex align-items-center">
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle me-3 ${color}`}
          style={{ width: "48px", height: "48px" }}
        >
          {icon}
        </div>
        <div>
          <p className="text-muted mb-1">{title}</p>
          <h4 className="mb-0 fw-bold">{value}</h4>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    todaySale: 0,
    receivable: 0,
    lowStockItems: 0,
  });


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  const data = [
    {
      title: "Today's Sale",
      value: `₹${dashboardData.todaySale.toLocaleString()}`,
      color: "bg-success-subtle text-success",
      icon: <i className="bi bi-bar-chart-fill fs-5"></i>,
    },
    {
      title: "Receivable",
      value: `₹${dashboardData.receivable.toLocaleString()}`,
      color: "bg-warning-subtle text-warning",
      icon: <i className="bi bi-wallet-fill fs-5"></i>,
    },
    {
      title: "Low Stock",
      value: `${dashboardData.lowStockItems} Items`,
      color: "bg-danger-subtle text-danger",
      icon: <i className="bi bi-exclamation-circle-fill fs-5"></i>,
    },
  ];

  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4">Dashboard</h1>

      <div className="row g-3 mb-4">
        {data.map((item) => (
          <div className="col-12 col-md-4" key={item.title}>
            <MetricCard {...item} />
          </div>
        ))}
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Quick Actions</h5>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <button
                className="w-100 py-3 d-flex flex-column align-items-center"
                style={{
                  backgroundColor: "#0b2e6f",
                  borderRadius: "12px",
                  border: "1px solid #0b2e6f",
                  color: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                <i
                  className="bi bi-receipt fs-3 mb-2"
                  style={{ color: "#ffffff" }}
                ></i>
                <span>New Invoice</span>
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button
                className="w-100 py-3 d-flex flex-column align-items-center"
                style={{
                  backgroundColor: "#0b2e6f",
                  borderRadius: "12px",
                  border: "1px solid #0b2e6f",
                  color: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                <i
                  className="bi bi-person-plus fs-3 mb-2"
                  style={{ color: "#ffffff" }}
                ></i>
                <span>Add Party</span>
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button
                className="w-100 py-3 d-flex flex-column align-items-center"
                style={{
                  backgroundColor: "#0b2e6f",
                  borderRadius: "12px",
                  border: "1px solid #0b2e6f",
                  color: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                <i
                  className="bi bi-box-seam fs-3 mb-2"
                  style={{ color: "#ffffff" }}
                ></i>
                <span>Add Item</span>
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button
                className="w-100 py-3 d-flex flex-column align-items-center"
                style={{
                  backgroundColor: "#0b2e6f",
                  borderRadius: "12px",
                  border: "1px solid #0b2e6f",
                  color: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                <i
                  className="bi bi-graph-up fs-3 mb-2"
                  style={{ color: "#ffffff" }}
                ></i>
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
