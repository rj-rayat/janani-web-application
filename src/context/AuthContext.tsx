import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { dbService } from '../services/db';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  // Role permission helpers
  canRegisterPatient: boolean;
  canEnterResults: boolean;
  canReviewTechnician: boolean;
  canAuthorizeDoctor: boolean;
  canManageStaff: boolean;
  canManageTemplates: boolean;
  canManageDatabase: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = dbService.getCurrentSession();
    if (session) {
      // Verify user is still active in database
      const user = dbService.getUserByUsername(session.username);
      if (user && user.active) {
        setCurrentUser(user);
      } else {
        dbService.setCurrentSession(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password = ''): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate brief network verification
    await new Promise((res) => setTimeout(res, 350));

    const cleanUsername = username.trim().toLowerCase();
    const user = dbService.getUserByUsername(cleanUsername);

    if (!user) {
      setIsLoading(false);
      return { success: false, message: 'Invalid username or user is deactivated in Janani directory.' };
    }

    // Check password if provided (standard default password convention: <username>123 or admin123)
    if (password && password.trim() !== '') {
      const validPasswords = [
        'admin123',
        'doctor123',
        'path123',
        'pathologist123',
        'labtech123',
        'recep123',
        'receptionist123',
        'janani2026',
        `${user.username}123`,
      ];
      if (!validPasswords.includes(password.trim())) {
        setIsLoading(false);
        return { success: false, message: 'Incorrect password for this staff account.' };
      }
    }

    setCurrentUser(user);
    dbService.setCurrentSession(user);
    dbService.logAudit(user, 'LOGIN', 'auth', user.id, `User ${user.name} logged into Janani LIMS as ${user.role}`);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      dbService.logAudit(currentUser, 'LOGOUT', 'auth', currentUser.id, `User ${currentUser.name} logged out`);
    }
    setCurrentUser(null);
    dbService.setCurrentSession(null);
  };

  const switchRole = (role: UserRole) => {
    const allUsers = dbService.getUsers();
    const targetUser = allUsers.find((u) => u.role === role && u.active);
    if (targetUser) {
      setCurrentUser(targetUser);
      dbService.setCurrentSession(targetUser);
      dbService.logAudit(
        targetUser,
        'ROLE_SWITCH',
        'auth',
        targetUser.id,
        `Active session switched to ${targetUser.name} (${targetUser.role})`
      );
    }
  };

  const role = currentUser?.role;

  const canRegisterPatient = role === 'admin' || role === 'receptionist' || role === 'lab_technician';
  const canEnterResults = role === 'admin' || role === 'lab_technician' || role === 'doctor' || role === 'pathologist' || role === 'radiologist';
  const canReviewTechnician = role === 'admin' || role === 'lab_technician';
  const canAuthorizeDoctor = role === 'admin' || role === 'doctor' || role === 'pathologist' || role === 'radiologist';
  const canManageStaff = role === 'admin';
  const canManageTemplates = role === 'admin' || role === 'pathologist' || role === 'doctor';
  const canManageDatabase = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        logout,
        switchRole,
        canRegisterPatient,
        canEnterResults,
        canReviewTechnician,
        canAuthorizeDoctor,
        canManageStaff,
        canManageTemplates,
        canManageDatabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
