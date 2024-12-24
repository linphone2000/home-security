import React, { Component } from "react";

class GlobalErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    // Check if the error message matches the ones you want to suppress
    if (
      error.message.includes(
        "only one instance of babel-polyfill is allowed"
      ) ||
      error.message.includes(
        "Box.constructor - expected box to be IBoundingBox"
      )
    ) {
      // Suppress the error by not updating state to trigger the fallback UI
      return { hasError: false };
    }
    return { hasError: true }; // Let other errors trigger fallback UI
  }

  componentDidCatch(error, errorInfo) {
    // Suppress errors in the console
    if (
      error.message.includes(
        "only one instance of babel-polyfill is allowed"
      ) ||
      error.message.includes(
        "Box.constructor - expected box to be IBoundingBox"
      )
    ) {
      return; // Do nothing for these errors
    }

    // Log the error and errorInfo for other errors (you can also send this to a logging service)
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }

    return this.props.children; // Render the children normally if no error
  }
}

export default GlobalErrorBoundary;
