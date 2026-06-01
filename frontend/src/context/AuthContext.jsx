import { createContext, useCallback, useState } from "react";
import { loginUser, registerUser } from "../services/read/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = useCallback(
    async ({ email, password }) => {
      setAuthLoading(true);
      setAuthError(null);

      try {
        const response = await loginUser(email, password);
        
        if (response.user) {
          const profile = {
            name: response.user.name || response.user.fullName || "",
            email: response.user.email,
            role: response.user.role || "customer",
          };

          setUser(profile);
          window.localStorage.setItem("authUser", JSON.stringify(profile));
          return { success: true, user: profile };
        }

        setAuthError("Login failed. Please try again.");
        return {
          success: false,
          error: "Login failed. Please try again.",
        };
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error.message || "Invalid email or password.";
        setAuthError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setAuthLoading(false);
      }
    },
    [setUser]
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      setAuthLoading(true);
      setAuthError(null);

      try {
        const response = await registerUser({ name, email, password });

        if (response.user) {
          const profile = { 
            name: response.user.name || name, 
            email: response.user.email, 
            role: response.user.role || "customer" 
          };
          setUser(profile);
          window.localStorage.setItem("authUser", JSON.stringify(profile));
          return { success: true, user: profile };
        }

        setAuthError("Registration failed. Please try again.");
        return { success: false, error: "Registration failed. Please try again." };
      } catch (error) {
        console.error("Register error:", error);
        const errorMessage = error.message || "Unable to register user right now.";
        setAuthError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setAuthLoading(false);
      }
    },
    [setUser]
  );


  const logout = useCallback(() => {
    window.localStorage.removeItem("authUser");
    window.localStorage.removeItem("authToken");
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        authError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
