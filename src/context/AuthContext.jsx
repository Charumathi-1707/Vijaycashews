import { createContext, useCallback, useState } from "react";
import { fetchUsers } from "../services/read/auth.service";
import { saveUser as apiSaveUser } from "../services/write/auth.service";

export const AuthContext = createContext();

const defaultLocalUsers = [
  {
    name: "Admin User",
    email: "admin@cashew.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Delivery Partner",
    email: "delivery@cashew.com",
    password: "delivery123",
    role: "delivery",
  },
];

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
        const users = await fetchUsers();

        const matchedUser = users.find(
          (userItem) =>
            userItem.email?.toLowerCase() === email.toLowerCase() &&
            userItem.password === password
        );

        if (matchedUser) {
          const profile = {
            name: matchedUser.name || matchedUser.fullName || "",
            email: matchedUser.email,
            role: matchedUser.role || "customer",
          };

          setUser(profile);
          window.localStorage.setItem("authUser", JSON.stringify(profile));
          return { success: true, user: profile };
        }
      } catch (error) {
        console.warn("Unable to fetch users from sheet:", error);
      } finally {
        setAuthLoading(false);
      }

      // No client-side stored users: rely on spreadsheet users or seeded dev users.

      const seededMatch = defaultLocalUsers.find(
        (seedUser) =>
          seedUser.email.toLowerCase() === email.toLowerCase() &&
          seedUser.password === password
      );

      if (seededMatch) {
        const profile = {
          name: seededMatch.name,
          email: seededMatch.email,
          role: seededMatch.role,
        };
        setUser(profile);
        window.localStorage.setItem("authUser", JSON.stringify(profile));
        return { success: true, user: profile };
      }

      setAuthError("Invalid email or password.");
      return {
        success: false,
        error: "Invalid email or password.",
      };
    },
    [setUser]
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      // Save user to spreadsheet via Apps Script
      try {
        await apiSaveUser({ name, email, password, role: "customer" });

        const profile = { name, email, role: "customer" };
        setUser(profile);
        window.localStorage.setItem("authUser", JSON.stringify(profile));
        return { success: true, user: profile };
      } catch (err) {
        return { success: false, error: "Unable to register user right now." };
      }
    },
    [setUser]
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem("authUser");
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
