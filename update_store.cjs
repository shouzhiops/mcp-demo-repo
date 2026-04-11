const fs = require('fs');

let content = fs.readFileSync('src/store/index.ts', 'utf8');

const newTypes = `
export interface User {
  id: number;
  username: string;
  roleId: number;
  role?: Role;
  createdAt?: string;
}

export interface Role {
  id: number;
  name: string;
  permissions?: string;
}

`;

content = content.replace('export interface Order', newTypes + 'export interface Order');

const newStoreState = `
  token: string | null;
  currentUser: User | null;
  users: User[];
  roles: Role[];
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  orders: Order[];
`;

content = content.replace('  orders: Order[];', newStoreState);

const newStoreInit = `
  token: localStorage.getItem('token') || null,
  currentUser: null,
  users: [],
  roles: [],
  
  login: async (credentials) => {
    const res = await axios.post(\`\${API_URL}/auth/login\`, credentials);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    set({ token, currentUser: user });
  },

  register: async (credentials) => {
    const res = await axios.post(\`\${API_URL}/auth/register\`, credentials);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    set({ token, currentUser: user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, currentUser: null });
  },

  fetchUsers: async () => {
    const res = await axios.get(\`\${API_URL}/users\`);
    set({ users: res.data });
  },

  fetchRoles: async () => {
    const res = await axios.get(\`\${API_URL}/roles\`);
    set({ roles: res.data });
  },

  orders: [],
`;

content = content.replace('  orders: [],', newStoreInit);

const interceptor = `
const API_URL = '/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // We don't want to reload if we are already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
`;

content = content.replace("const API_URL = '/api';", interceptor);

fs.writeFileSync('src/store/index.ts', content);
