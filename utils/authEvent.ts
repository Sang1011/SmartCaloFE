type AuthEventListener = () => void;

class AuthEventEmitter {
  private listeners: AuthEventListener[] = [];

  subscribe(listener: AuthEventListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.warn("Error in auth event listener:", error);
      }
    });
  }
}

export const authEvents = new AuthEventEmitter();