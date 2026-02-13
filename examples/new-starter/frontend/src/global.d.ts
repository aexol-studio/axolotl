interface InitialAuthData {
  isAuthenticated: boolean;
}

interface Window {
  __INITIAL_AUTH__?: InitialAuthData;
}
