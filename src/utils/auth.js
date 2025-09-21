import { fakeUsers } from '../data/users';

// Authentication utilities using localStorage for prototype
export const login = (email, password) => {
  const user = fakeUsers.find(
    (u) => u.email === email && u.password === password && u.approved
  );
  
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return { success: true, user };
  }
  
  const unApprovedUser = fakeUsers.find(
    (u) => u.email === email && u.password === password && !u.approved
  );
  
  if (unApprovedUser) {
    return { success: false, message: "Your account is pending admin approval." };
  }
  
  return { success: false, message: "Invalid email or password." };
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

export const isOutletManager = () => {
  const user = getCurrentUser();
  return user && user.role === "outlet_manager";
};

export const isFactoryManager = () => {
  const user = getCurrentUser();
  return user && user.role === "factory_manager";
};

export const register = (userData) => {
  // In real app, this would make API call
  // For prototype, we'll just simulate success
  return { 
    success: true, 
    message: "Registration successful! Please wait for admin approval." 
  };
};

// Protected route wrapper
export const requireAuth = (user, redirectTo = "/login") => {
  if (!user) {
    return { redirect: redirectTo };
  }
  return { allowed: true };
};

export const requireAdmin = (user) => {
  if (!user || user.role !== "admin") {
    return { redirect: "/login" };
  }
  return { allowed: true };
};

export const requireOutletManager = (user) => {
  if (!user || user.role !== "outlet_manager") {
    return { redirect: "/login" };
  }
  return { allowed: true };
};

export const requireFactoryManager = (user) => {
  if (!user || user.role !== "factory_manager") {
    return { redirect: "/login" };
  }
  return { allowed: true };
};