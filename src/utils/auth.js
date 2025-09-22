import { fakeUsers } from '../data/users';
import { factories } from '../data/factories';

// Authentication utilities using localStorage for prototype
export const login = (email, password) => {
  // Check regular users first
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

  // Check factory users
  const factory = factories.find(
    (f) => f.email === email && f.password === password
  );
  
  if (factory) {
    const factoryUser = {
      id: factory.id,
      name: factory.name,
      email: factory.email,
      role: "factory",
      factoryType: factory.type,
      factoryId: factory.id,
      location: factory.location,
      categories: factory.categories,
      branches: factory.branches
    };
    localStorage.setItem("user", JSON.stringify(factoryUser));
    return { success: true, user: factoryUser };
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