import React from "react";
import "./ProgressBar.css";

function ProgressBar({ steps, currentStep }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`progress-step ${index + 1 <= currentStep ? "active" : ""}`}
          >
            <div className="step-content">
              <span className="step-number">{index + 1}</span>
              <span className="step-label">{step}</span>
            </div>
            {index < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;