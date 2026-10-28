import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { name: 'catalog' }
  | { name: 'book-detail'; bookId: string }
  | { name: 'favorites' }
  | { name: 'curations' }
  | { name: 'reader'; bookId: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'admin' }
  | { name: 'login' }
  | { name: 'register' }
  | { name: 'account' }
  | { name: 'explore' }
  | { name: 'journey' };

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean || clean === 'catalog') {
    return { name: 'catalog' };
  }
  if (clean.startsWith('book/')) {
    const bookId = clean.replace('book/', '').split('?')[0];
    return { name: 'book-detail', bookId };
  }
  if (clean === 'favorites' || clean === 'bookshelf') {
    return { name: 'favorites' };
  }
  if (clean === 'curations') {
    return { name: 'curations' };
  }
  if (clean === 'about') {
    return { name: 'about' };
  }
  if (clean === 'contact') {
    return { name: 'contact' };
  }
  if (clean === 'admin') {
    return { name: 'admin' };
  }
  if (clean === 'login') {
    return { name: 'login' };
  }
  if (clean === 'register') {
    return { name: 'register' };
  }
  if (clean === 'account' || clean === 'orders') {
    return { name: 'account' };
  }
  if (clean === 'explore') {
    return { name: 'explore' };
  }
  if (clean === 'journey') {
    return { name: 'journey' };
  }
  if (clean.startsWith('reader/')) {
    const bookId = clean.replace('reader/', '').split('?')[0];
    return { name: 'reader', bookId };
  }
  return { name: 'catalog' };
}

function routeToHash(route: Route): string {
  switch (route.name) {
    case 'catalog':
      return '#/';
    case 'book-detail':
      return `#/book/${route.bookId}`;
    case 'favorites':
      return '#/favorites';
    case 'curations':
      return '#/curations';
    case 'about':
      return '#/about';
    case 'contact':
      return '#/contact';
    case 'admin':
      return '#/admin';
    case 'login':
      return '#/login';
    case 'register':
      return '#/register';
    case 'account':
      return '#/account';
    case 'explore':
      return '#/explore';
    case 'journey':
      return '#/journey';
    case 'reader':
      return `#/reader/${route.bookId}`;
  }
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((nextRoute: Route) => {
    const nextHash = routeToHash(nextRoute);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const back = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ name: 'catalog' });
    }
  }, [navigate]);

  return {
    route,
    navigate,
    back
  };
}
