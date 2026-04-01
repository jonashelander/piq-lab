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
      case 'config-cancel':     return <EndpointConfigPage endpoint="cancel" />;
      case 'logs-cancel':       return <EndpointLogsPage endpoint="cancel" />;
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
