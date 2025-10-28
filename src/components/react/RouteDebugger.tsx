import React, { useState, useEffect } from 'react';

interface RouteInfo {
  current: string;
  base: string;
  pathname: string;
  search: string;
  hash: string;
}

interface ExpectedRoute {
  path: string;
  file: string;
  status: 'active' | 'inactive' | 'error';
  description: string;
}

const RouteDebugger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [testResults, setTestResults] = useState<ExpectedRoute[]>([]);

  useEffect(() => {
    // Get current route info
    const info: RouteInfo = {
      current: window.location.href,
      base: window.location.origin,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    };
    setRouteInfo(info);

    // Test expected routes
    testRoutes(info.pathname);
  }, []);

  const testRoutes = async (currentPath: string) => {
    const expectedRoutes: ExpectedRoute[] = [
      {
        path: '/',
        file: 'src/pages/index.astro',
        status: 'inactive',
        description: 'Home page'
      },
      {
        path: '/blackjack/',
        file: 'src/pages/blackjack/index.astro',
        status: 'inactive',
        description: 'Blackjack landing page'
      },
      {
        path: '/blackjack/overview/',
        file: 'src/pages/blackjack/overview.astro',
        status: 'inactive',
        description: 'Overview page'
      },
      {
        path: '/blackjack/dashboard/',
        file: 'src/pages/blackjack/dashboard.astro',
        status: 'inactive',
        description: 'Training dashboard'
      },
      {
        path: '/blackjack/drills/',
        file: 'src/pages/blackjack/drills/index.astro',
        status: 'inactive',
        description: 'Drills list page'
      },
      {
        path: '/blackjack/drills/card-drill-nico/',
        file: 'src/pages/blackjack/drills/[dealer].astro',
        status: 'inactive',
        description: 'Dynamic drill page example'
      },
      {
        path: '/blackjack/phrasebook/',
        file: 'src/pages/blackjack/phrasebook.astro',
        status: 'inactive',
        description: 'Dealer phrasebook'
      },
      {
        path: '/blackjack/trainer-notes/',
        file: 'src/pages/blackjack/trainer-notes.astro',
        status: 'inactive',
        description: 'Trainer notes'
      },
    ];

    // Test each route
    const results = await Promise.all(
      expectedRoutes.map(async (route) => {
        try {
          const response = await fetch(route.path, { method: 'HEAD' });
          const isActive = currentPath === route.path;
          return {
            ...route,
            status: isActive ? 'active' : (response.ok ? 'inactive' : 'error')
          } as ExpectedRoute;
        } catch (error) {
          return {
            ...route,
            status: 'error'
          } as ExpectedRoute;
        }
      })
    );

    setTestResults(results);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#00e6a8';
      case 'inactive':
        return '#b3b3b3';
      case 'error':
        return '#ff4d4d';
      default:
        return '#b3b3b3';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '✓';
      case 'inactive':
        return '○';
      case 'error':
        return '✕';
      default:
        return '?';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!routeInfo) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #5a4bff, #00e6a8)',
          border: '2px solid rgba(0, 230, 168, 0.5)',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 230, 168, 0.4)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        🔍
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '85vh',
            background: 'rgba(15, 17, 23, 0.98)',
            border: '2px solid rgba(0, 230, 168, 0.5)',
            borderRadius: '16px',
            padding: '2rem',
            zIndex: 9999,
            overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#00e6a8', margin: 0, fontSize: '1.5rem' }}>
              🔍 Route Debugger
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 77, 77, 0.2)',
                border: '1px solid #ff4d4d',
                color: '#ff4d4d',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Close
            </button>
          </div>

          {/* Current Route Info */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#00e6a8', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Current Route Info
            </h3>
            <div style={{ background: 'rgba(90, 75, 255, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0, 230, 168, 0.2)' }}>
              {[
                { label: 'Full URL', value: routeInfo.current },
                { label: 'Base', value: routeInfo.base },
                { label: 'Pathname', value: routeInfo.pathname },
                { label: 'Search', value: routeInfo.search || '(none)' },
                { label: 'Hash', value: routeInfo.hash || '(none)' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <strong style={{ color: '#00e6a8', minWidth: '120px' }}>{label}:</strong>
                  <code
                    style={{
                      color: '#f5f5f5',
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flex: 1,
                    }}
                    onClick={() => copyToClipboard(value)}
                    title="Click to copy"
                  >
                    {value}
                  </code>
                </div>
              ))}
            </div>
          </section>

          {/* Route Status Table */}
          <section>
            <h3 style={{ color: '#00e6a8', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Expected Routes Status
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(90, 75, 255, 0.2)', borderBottom: '2px solid rgba(0, 230, 168, 0.3)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00e6a8' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00e6a8' }}>Path</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00e6a8' }}>File</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#00e6a8' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((route, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid rgba(0, 230, 168, 0.1)',
                        background: route.status === 'active' ? 'rgba(0, 230, 168, 0.05)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          style={{
                            color: getStatusColor(route.status),
                            fontSize: '1.2rem',
                            marginRight: '0.5rem',
                          }}
                        >
                          {getStatusIcon(route.status)}
                        </span>
                        <span style={{ color: getStatusColor(route.status), fontSize: '0.85rem' }}>
                          {route.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <code
                          style={{
                            color: route.status === 'active' ? '#00e6a8' : '#b3b3b3',
                            background: 'rgba(0, 0, 0, 0.2)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          onClick={() => copyToClipboard(route.path)}
                          title="Click to copy"
                        >
                          {route.path}
                        </code>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#b3b3b3', fontSize: '0.85rem' }}>
                        {route.file}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#b3b3b3' }}>
                        {route.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Legend */}
          <section style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(90, 75, 255, 0.05)', borderRadius: '8px' }}>
            <h4 style={{ color: '#00e6a8', fontSize: '1rem', marginBottom: '0.5rem' }}>Legend</h4>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <div style={{ color: '#00e6a8' }}>✓ Active - Currently viewing this route</div>
              <div style={{ color: '#b3b3b3' }}>○ Inactive - Route exists and is accessible</div>
              <div style={{ color: '#ff4d4d' }}>✕ Error - Route not found or inaccessible</div>
            </div>
          </section>

          {/* Quick Actions */}
          <section style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(90, 75, 255, 0.3)',
                border: '1px solid #5a4bff',
                color: '#f5f5f5',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              🔄 Refresh Page
            </button>
            <button
              onClick={() => testRoutes(routeInfo.pathname)}
              style={{
                background: 'rgba(0, 230, 168, 0.2)',
                border: '1px solid #00e6a8',
                color: '#00e6a8',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              🔍 Re-test Routes
            </button>
            <button
              onClick={() => {
                const report = JSON.stringify({ routeInfo, testResults }, null, 2);
                copyToClipboard(report);
                alert('Debug report copied to clipboard!');
              }}
              style={{
                background: 'rgba(0, 230, 168, 0.2)',
                border: '1px solid #00e6a8',
                color: '#00e6a8',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              📋 Copy Debug Report
            </button>
          </section>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9997,
          }}
        />
      )}
    </>
  );
};

export default RouteDebugger;
