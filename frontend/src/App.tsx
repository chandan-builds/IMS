import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrgProvider } from './contexts/OrgContext';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrgProvider>
          <AppRouter />
        </OrgProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
