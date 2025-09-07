import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createContext, useContext, ReactNode, FC, ComponentProps } from 'react';

// Type definitions and interfaces
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error' | 'loading';
  message?: string;
}

type UserContextType = {
  users: User[];
  currentUser: User | null;
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (id: number) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
};

// Context creation
const UserContext = createContext<UserContextType | null>(null);

// Custom hooks
const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

// Generic component with constraints
interface ListProps<T extends { id: string | number }> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor?: (item: T) => string | number;
  className?: string;
}

function List<T extends { id: string | number }>({
  items,
  renderItem,
  keyExtractor = (item) => item.id,
  className = '',
}: ListProps<T>) {
  return (
    <ul className={`list ${className}`}>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Component with forwardRef and generic props
interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', loading = false, children, className, ...rest }, ref) => {
    const baseClasses = 'btn';
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-danger',
    };
    const sizeClasses = {
      small: 'btn-sm',
      medium: 'btn-md',
      large: 'btn-lg',
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      loading && 'btn-loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} disabled={loading} {...rest}>
        {loading ? 'Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Provider component
interface UserProviderProps {
  children: ReactNode;
  initialUsers?: User[];
}

const UserProvider: FC<UserProviderProps> = ({ children, initialUsers = [] }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now() + Math.random(), // Simple ID generation
    };
    setUsers((prev) => [...prev, newUser]);
  }, []);

  const removeUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  const updateUser = useCallback((id: number, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      addUser,
      removeUser,
      updateUser,
    }),
    [users, currentUser, addUser, removeUser, updateUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Main component with complex state and effects
const UserDashboard: FC = () => {
  const { users, addUser, removeUser, updateUser } = useUsers();
  const [filter, setFilter] = useLocalStorage<string>('userFilter', '');
  const [sortBy, setSortBy] = useState<keyof User>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Memoized filtered and sorted users
  const filteredUsers = useMemo(() => {
    let result = users.filter((user) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    );

    result.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return result;
  }, [users, filter, sortBy, sortOrder]);

  // Effect for focus management
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddUser = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: Omit<User, 'id'> = {
        name: `User ${users.length + 1}`,
        email: `user${users.length + 1}@example.com`,
        role: 'user',
        isActive: true,
        metadata: {
          createdAt: new Date().toISOString(),
          source: 'dashboard',
        },
      };

      addUser(newUser);
    } catch (error) {
      console.error('Failed to add user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [users.length, addUser]);

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>User Management Dashboard</h1>
        <div className="dashboard-actions">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search users... (Ctrl+K)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as keyof User)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
          </select>
          <Button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            variant="secondary"
            size="small"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
          <Button onClick={handleAddUser} loading={isLoading} variant="primary">
            Add User
          </Button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="user-stats">
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Users</span>
            <span className="stat-value">
              {users.filter((u) => u.isActive).length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Admins</span>
            <span className="stat-value">
              {users.filter((u) => u.role === 'admin').length}
            </span>
          </div>
        </div>

        <List
          items={filteredUsers}
          renderItem={(user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={() => removeUser(user.id)}
              onUpdate={(updates) => updateUser(user.id, updates)}
            />
          )}
          className="user-list"
        />
      </main>
    </div>
  );
};

// User card component with complex props
interface UserCardProps {
  user: User;
  onDelete: () => void;
  onUpdate: (updates: Partial<User>) => void;
}

const UserCard: FC<UserCardProps> = ({ user, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className={`user-card ${user.isActive ? 'active' : 'inactive'}`}>
      {isEditing ? (
        <div className="user-card-edit">
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
          />
          <select
            value={formData.role || 'user'}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
          <div className="edit-actions">
            <Button onClick={handleSave} variant="primary" size="small">
              Save
            </Button>
            <Button onClick={handleCancel} variant="secondary" size="small">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="user-card-display">
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </div>
          <div className="user-actions">
            <Button onClick={() => setIsEditing(true)} variant="secondary" size="small">
              Edit
            </Button>
            <Button onClick={onDelete} variant="danger" size="small">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// App component with providers
const App: FC = () => {
  const initialUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
      metadata: { department: 'Engineering' },
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      isActive: true,
      metadata: { department: 'Marketing' },
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'moderator',
      isActive: false,
      metadata: { department: 'Support' },
    },
  ];

  return (
    <UserProvider initialUsers={initialUsers}>
      <div className="app">
        <UserDashboard />
      </div>
    </UserProvider>
  );
};

export default App;
export { UserProvider, useUsers, Button, List };
export type { User, UserContextType, ButtonProps, ListProps };
