// src
import React from "react";
import { FaGithub, FaCloudSun } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <div className="container">
        <div className="mb-2">
          <FaCloudSun size={20} className="me-1 mb-1" />
          <strong>SkyCast</strong> &copy; {new Date().getFullYear()}
        </div>
        <div>
          Built by{" "}
          <a
            href="https://github.com/elishaoigara"
            className="text-light text-decoration-underline"
            target="_blank"
            rel="noreferrer"
          >
            Elisha Oigara
          </a>{" "}
          ·{" "}
          <a
            href="https://openweathermap.org/"
            className="text-light text-decoration-underline"
            target="_blank"
            rel="noreferrer"
          >
            Powered by OpenWeatherMap
          </a>
        </div>
        <div className="mt-2">
          <a
            href="https://github.com/elishaoigara/SkyCast"
            className="text-light"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub className="me-1" />
            GitHub Repo
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
