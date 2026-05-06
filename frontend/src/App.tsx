import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import EndpointConfigPage from './pages/EndpointConfigPage';
import AllLogsPage from './pages/AllLogsPage';
import { Page } from './types';

export default function App() {
  const [page, setPage] = useState<Page>('config-verifyuser');
  const [isDirty, setIsDirty] = useState(false);

  const handleNavigate = useCallback((next: Page) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Leave anyway?')) return;
    }
    setIsDirty(false);
    setPage(next);
  }, [isDirty]);

  function renderPage() {
    switch (page) {
      case 'config-verifyuser':    return <EndpointConfigPage endpoint="verifyuser" nestedField="attributes" onDirtyChange={setIsDirty} />;
      case 'config-authorize':     return <EndpointConfigPage endpoint="authorize" nestedField="updatedUser" onDirtyChange={setIsDirty} />;
      case 'config-transfer':      return <EndpointConfigPage endpoint="transfer" onDirtyChange={setIsDirty} />;
      case 'config-cancel':        return <EndpointConfigPage endpoint="cancel" onDirtyChange={setIsDirty} />;
      case 'config-notification':  return <EndpointConfigPage endpoint="notification" onDirtyChange={setIsDirty} />;
      case 'config-lookupuser':    return <EndpointConfigPage endpoint="lookupuser" nestedField="attributes" onDirtyChange={setIsDirty} />;
      case 'config-signin':        return <EndpointConfigPage endpoint="signin" onDirtyChange={setIsDirty} />;
      case 'logs':                 return <AllLogsPage />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar currentPage={page} onNavigate={handleNavigate} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}
