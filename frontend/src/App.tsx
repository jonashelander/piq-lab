import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EndpointConfigPage from './pages/EndpointConfigPage';
import EndpointLogsPage from './pages/EndpointLogsPage';
import { Page } from './types';

export default function App() {
  const [page, setPage] = useState<Page>('config-verifyuser');

  function renderPage() {
    switch (page) {
      case 'config-verifyuser': return <EndpointConfigPage endpoint="verifyuser" nestedField="attributes" />;
      case 'logs-verifyuser':   return <EndpointLogsPage endpoint="verifyuser" />;
      case 'config-authorize':  return <EndpointConfigPage endpoint="authorize" nestedField="updatedUser" />;
      case 'logs-authorize':    return <EndpointLogsPage endpoint="authorize" />;
      case 'config-transfer':   return <EndpointConfigPage endpoint="transfer" />;
      case 'logs-transfer':     return <EndpointLogsPage endpoint="transfer" />;
      case 'config-cancel':        return <EndpointConfigPage endpoint="cancel" />;
      case 'logs-cancel':          return <EndpointLogsPage endpoint="cancel" />;
      case 'config-notification':  return <EndpointConfigPage endpoint="notification" />;
      case 'logs-notification':    return <EndpointLogsPage endpoint="notification" />;
      case 'config-lookupuser':    return <EndpointConfigPage endpoint="lookupuser" nestedField="attributes" />;
      case 'logs-lookupuser':      return <EndpointLogsPage endpoint="lookupuser" />;
      case 'config-signin':        return <EndpointConfigPage endpoint="signin" />;
      case 'logs-signin':          return <EndpointLogsPage endpoint="signin" />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}
