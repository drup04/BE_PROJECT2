import React, { useState, useEffect } from 'react';
import { AppShell, AppRoute } from './components/layout/AppShell';
import { OverviewView } from './views/OverviewView';
import { AssistantView } from './views/AssistantView';
import { FinanceView } from './views/FinanceView';
import { QuotationsView } from './views/QuotationsView';
import { ReceivablesView } from './views/ReceivablesView';
import { CustomersView } from './views/CustomersView';
import { ApprovalsView } from './views/ApprovalsView';
import { ActivityView } from './views/ActivityView';
import { PrivacyView } from './views/PrivacyView';
import { TermsView } from './views/TermsView';
import { NotFoundView } from './views/NotFoundView';

const VALID_ROUTES: AppRoute[] = [
  '/overview',
  '/assistant',
  '/finance',
  '/sales/quotations',
  '/receivables',
  '/customers',
  '/approvals',
  '/activity',
  '/settings/privacy',
  '/terms',
];

export const App: React.FC = () => {
  const parseRouteFromLocation = (): { route: AppRoute; isValid: boolean } => {
    const hash = window.location.hash.replace(/^#/, '');
    const path = hash || window.location.pathname;

    if (!path || path === '/') {
      return { route: '/overview', isValid: true };
    }

    if (VALID_ROUTES.includes(path as AppRoute)) {
      return { route: path as AppRoute, isValid: true };
    }

    return { route: '/overview', isValid: false };
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const { route } = parseRouteFromLocation();
    return route;
  });

  const [isRouteValid, setIsRouteValid] = useState<boolean>(() => {
    const { isValid } = parseRouteFromLocation();
    return isValid;
  });

  const [autoRunAssistantPrompt, setAutoRunAssistantPrompt] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      const { route, isValid } = parseRouteFromLocation();
      setCurrentRoute(route);
      setIsRouteValid(isValid);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    // Initial check
    if (!window.location.hash && window.location.pathname === '/') {
      window.location.hash = '#/overview';
    }

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: AppRoute) => {
    window.location.hash = `#${route}`;
    setCurrentRoute(route);
    setIsRouteValid(true);
    window.scrollTo(0, 0);
  };

  const handleRunProfitAnalysisFromOverview = () => {
    setAutoRunAssistantPrompt(true);
    navigateTo('/assistant');
  };

  const renderActiveView = () => {
    if (!isRouteValid) {
      return <NotFoundView onNavigate={navigateTo} />;
    }

    switch (currentRoute) {
      case '/overview':
        return (
          <OverviewView
            onNavigate={navigateTo}
            onRunProfitAnalysis={handleRunProfitAnalysisFromOverview}
          />
        );
      case '/assistant':
        return (
          <AssistantView
            onNavigate={navigateTo}
            autoRunPrompt={autoRunAssistantPrompt}
          />
        );
      case '/finance':
        return <FinanceView />;
      case '/sales/quotations':
        return <QuotationsView />;
      case '/receivables':
        return <ReceivablesView onNavigate={navigateTo} />;
      case '/customers':
        return <CustomersView />;
      case '/approvals':
        return <ApprovalsView />;
      case '/activity':
        return <ActivityView />;
      case '/settings/privacy':
        return <PrivacyView />;
      case '/terms':
        return <TermsView />;
      default:
        return <NotFoundView onNavigate={navigateTo} />;
    }
  };

  return (
    <AppShell currentRoute={currentRoute} onRouteChange={navigateTo}>
      {renderActiveView()}
    </AppShell>
  );
};
