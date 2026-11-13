"use client";

import { Component, type ReactNode } from "react";

/**
 * Each app is fetched on demand, and on a bad connection that fetch can
 * fail. Without this the error would take the whole page down; with it the
 * failure stays inside the app window, the home bar still works, and the
 * plain CV is one tap away.
 */
export default class AppBoundary extends Component<
  { name: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="scr">
        <div className="scr__body app-failed">
          <p className="app-failed__title">
            {this.props.name} didn&apos;t load.
          </p>
          <p>The connection dropped while fetching it.</p>
          <div className="app-failed__actions">
            <button
              type="button"
              className="pill"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
            <a className="pill pill--quiet" href="/cv">
              Open the CV
            </a>
          </div>
        </div>
      </div>
    );
  }
}
