const API_BASE_URL = 'http://10.0.2.2:8000/api';

interface TodoList {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

interface Todo {
    id: number;
    todo_list_id: number;
    description: string;
    is_done: boolean;
    created_at?: string;
    updated_at?: string;
}

export const api = {
    // Todo Lists endpoints
    getTodoLists: async (): Promise<TodoList[]> => {
        try {
            console.log('Fetching todo lists from:', `${API_BASE_URL}/todo-lists`);
            const response = await fetch(`${API_BASE_URL}/todo-lists`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch todo lists: ${response.status} ${response.statusText}`);
            }
            
            const data = text ? JSON.parse(text) : [];
            console.log('Parsed todo lists:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error in getTodoLists:', error);
            throw error;
        }
    },

    createTodoList: async (name: string): Promise<TodoList> => {
        try {
            console.log('Creating todo list at:', `${API_BASE_URL}/todo-lists`);
            const response = await fetch(`${API_BASE_URL}/todo-lists`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to create todo list: ${response.status} ${response.statusText}`);
            }
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Error in createTodoList:', error);
            throw error;
        }
    },

    getTodoList: async (id: number): Promise<TodoList> => {
        try {
            console.log('Fetching todo list from:', `${API_BASE_URL}/todo-lists/${id}`);
            const response = await fetch(`${API_BASE_URL}/todo-lists/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch todo list: ${response.status} ${response.statusText}`);
            }
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Error in getTodoList:', error);
            throw error;
        }
    },

    updateTodoList: async (id: number, name: string): Promise<TodoList> => {
        try {
            console.log('Updating todo list at:', `${API_BASE_URL}/todo-lists/${id}`);
            const response = await fetch(`${API_BASE_URL}/todo-lists/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to update todo list: ${response.status} ${response.statusText}`);
            }
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Error in updateTodoList:', error);
            throw error;
        }
    },

    deleteTodoList: async (id: number): Promise<void> => {
        try {
            console.log('Deleting todo list at:', `${API_BASE_URL}/todo-lists/${id}`);
            const response = await fetch(`${API_BASE_URL}/todo-lists/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-HTTP-Method-Override': 'DELETE'
                },
                // Some PHP frameworks require the _method parameter for DELETE requests
                body: JSON.stringify({ _method: 'DELETE' })
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to delete todo list: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error in deleteTodoList:', error);
            throw error;
        }
    },

    // Todos endpoints
    getTodos: async (listId?: number): Promise<Todo[]> => {
        try {
            console.log('Fetching todos from:', `${API_BASE_URL}/todos`);
            const response = await fetch(`${API_BASE_URL}/todos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch todos: ${response.status} ${response.statusText}`);
            }
            
            const data = text ? JSON.parse(text) : [];
            console.log('Parsed todos:', data);
            // Filter todos by list ID if provided
            const todos = Array.isArray(data) ? data : [];
            return listId ? todos.filter(todo => todo.todo_list_id === listId) : todos;
        } catch (error) {
            console.error('Error in getTodos:', error);
            throw error;
        }
    },

    createTodo: async (todo_list_id: number, description: string): Promise<Todo> => {
        try {
            console.log('Creating todo at:', `${API_BASE_URL}/todos`);
            const response = await fetch(`${API_BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    todo_list_id,
                    description 
                }),
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to create todo: ${response.status} ${response.statusText}`);
            }
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Error in createTodo:', error);
            throw error;
        }
    },

    getTodo: async (id: number): Promise<Todo> => {
        try {
            console.log('Fetching todo from:', `${API_BASE_URL}/todos/${id}`);
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch todo: ${response.status} ${response.statusText}`);
            }
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Error in getTodo:', error);
            throw error;
        }
    },

    updateTodo: async (id: number, data: Partial<Todo>): Promise<Todo> => {
        try {
            console.log('Updating todo at:', `${API_BASE_URL}/todos/${id}`);
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-HTTP-Method-Override': 'PUT'
                },
                body: JSON.stringify({
                    _method: 'PUT',
                    ...data
                }),
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to update todo: ${response.status} ${response.statusText}`);
            }
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Error in updateTodo:', error);
            throw error;
        }
    },

    deleteTodo: async (id: number): Promise<void> => {
        try {
            console.log('Deleting todo at:', `${API_BASE_URL}/todos/${id}`);
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);
            
            if (!response.ok) {
                throw new Error(`Failed to delete todo: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error in deleteTodo:', error);
            throw error;
        }
    },
};

export type { TodoList, Todo };
