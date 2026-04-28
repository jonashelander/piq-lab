import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EndpointConfigPage from './pages/EndpointConfigPage';
import AllLogsPage from './pages/AllLogsPage';
import { Page } from './types';

export default function App() {
  const [page, setPage] = useState<Page>('config-verifyuser');

  function renderPage() {
    switch (page) {
      case 'config-verifyuser':    return <EndpointConfigPage endpoint="verifyuser" nestedField="attributes" />;
      case 'config-authorize':     return <EndpointConfigPage endpoint="authorize" nestedField="updatedUser" />;
      case 'config-transfer':      return <EndpointConfigPage endpoint="transfer" />;
      case 'config-cancel':        return <EndpointConfigPage endpoint="cancel" />;
      case 'config-notification':  return <EndpointConfigPage endpoint="notification" />;
      case 'config-lookupuser':    return <EndpointConfigPage endpoint="lookupuser" nestedField="attributes" />;
      case 'config-signin':        return <EndpointConfigPage endpoint="signin" />;
      case 'logs':                 return <AllLogsPage />;
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
