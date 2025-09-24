// src/pages/NotFoundPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // redirect ke homepage setelah 3 detik
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="bsod container">
      <h1 className="neg title">
        <span className="bg">Error - 404</span>
      </h1>
      <p>An error has occured, to continue:</p>
      <p>
        * Return to our homepage.<br />
        * Send us an e-mail about this error and try later.
      </p>
      <nav className="nav"></nav>

      {/* CSS langsung di component */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css?family=VT323');

        body {
          background: #0414a7;
          color: #e0e2f4;
          font-family: 'VT323', monospace;
        }

        .container {
          width: 90%;
          margin: auto;
          max-width: 640px;
          padding-top: 10%;
          text-align: center;
        }

        .neg {
          color: #0414a7;
        }

        .neg .bg {
          background: #aaaaaa;
          padding: 0 15px 2px 13px;
        }

        .title {
          margin-bottom: 50px;
        }

        .nav {
          margin-top: 35px;
          text-align: center;
        }

        .nav .link {
          text-decoration: none;
          padding: 0 9px 2px 8px;
          color: #e0e2f4;
        }

        .nav .link:hover,
        .nav .link:focus {
          background: #aaaaaa;
          color: #0414a7;
        }

        h1 {
          font-size: 2.75rem;
          line-height: 1.05em;
        }

        p {
          font-size: 20px;
          line-height: 1.25rem;
        }
      `}</style>
    </main>
  );
};

export default NotFoundPage;
