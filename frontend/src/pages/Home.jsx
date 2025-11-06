import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SplitEase | Simplify Your Expenses 💸";
  }, []);

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <section className="text-center mb-5">
        <h1 className="fw-bold display-5 mb-3 text-success">SplitEase💸- No awkward math, just SplitEase.</h1>
        <p className="text-muted fs-5">
          Manage expenses, split bills, and settle up easily with your friends.
        </p>
        <div className="mt-4">
          <button
            onClick={() => navigate("/groups")}
            className="btn btn-success btn-lg px-4 shadow-sm me-2"
          >
            Start Splitting
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="btn btn-outline-success btn-lg px-4 shadow-sm"
          >
            View Profile
          </button>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="row g-4 mt-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-lg text-center p-4 rounded-4 h-100 hover-shadow">
            <div className="mb-3 fs-1 text-success">💰</div>
            <h4 className="fw-bold">Take Money</h4>
            <p className="text-muted">Easily manage who owes you money.</p>
            <button
              onClick={() => navigate("/take")}
              className="btn btn-success w-100 mt-auto"
            >
              Go →
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-lg text-center p-4 rounded-4 h-100 hover-shadow">
            <div className="mb-3 fs-1 text-warning">📤</div>
            <h4 className="fw-bold">Give Money</h4>
            <p className="text-muted">Track what you owe to others clearly.</p>
            <button
              onClick={() => navigate("/give")}
              className="btn btn-warning w-100 mt-auto"
            >
              Go →
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-lg text-center p-4 rounded-4 h-100 hover-shadow">
            <div className="mb-3 fs-1 text-info">👥</div>
            <h4 className="fw-bold">Group Expenses</h4>
            <p className="text-muted">
              Split and settle bills with your friends easily.
            </p>
            <button
              onClick={() => navigate("/groups")}
              className="btn btn-info w-100 mt-auto text-white"
            >
              Go →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-5 py-5 bg-light rounded-4 shadow-sm text-center">
        <h3 className="fw-bold mb-4 text-dark">✨ Why Choose SplitEase?</h3>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-3">
              <div className="fs-1 mb-3">⚡</div>
              <h5 className="fw-bold">Fast & Simple</h5>
              <p className="text-muted">
                Add, edit, and track expenses effortlessly in seconds.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <div className="fs-1 mb-3">🔒</div>
              <h5 className="fw-bold">Secure & Private</h5>
              <p className="text-muted">
                All your data is safe with encrypted authentication.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <div className="fs-1 mb-3">📊</div>
              <h5 className="fw-bold">Smart Insights</h5>
              <p className="text-muted">
                Visualize spending and settlements in beautiful charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-5">
        <h4 className="fw-bold text-dark">
          Ready to simplify your group expenses?
        </h4>
        <p className="text-muted mb-3">Start tracking and sharing costs effortlessly.</p>
        <button
          onClick={() => navigate("/groups")}
          className="btn btn-success btn-lg px-5 shadow"
        >
          Get Started 🚀
        </button>
      </section>
    </div>
  );
}
