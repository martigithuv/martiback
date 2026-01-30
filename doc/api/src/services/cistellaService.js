// martifront/frontend-react/src/services/cistellaService.js
// Servicio para manejar la cistella con soporte JWT

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class CistellaService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/cistella`;
  }

  // Obtener configuración con token JWT si existe
  getConfig() {
    const config = {
      credentials: 'include', // Incluir cookies de sesión
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // ⭐ Buscar token JWT en localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Si hay token, añadirlo al header Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Usando token JWT para la petición');
    } else {
      console.log('👤 Sin token JWT - usando sesión temporal');
    }

    return config;
  }

  // Obtener la cistella del usuario
  async getCistella() {
    try {
      const response = await fetch(this.baseURL, {
        method: 'GET',
        ...this.getConfig()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener cistella');
      }

      return data;
    } catch (error) {
      console.error('❌ Error getCistella:', error);
      throw error;
    }
  }

  // Añadir producto a la cistella
  async addProduct(productId, productName, price, quantity = 1) {
    try {
      const response = await fetch(`${this.baseURL}/add`, {
        method: 'POST',
        ...this.getConfig(),
        body: JSON.stringify({
          productId,
          productName,
          price,
          quantity
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al añadir producto');
      }

      return data;
    } catch (error) {
      console.error('❌ Error addProduct:', error);
      throw error;
    }
  }

  // Eliminar producto de la cistella
  async removeProduct(itemId) {
    try {
      const response = await fetch(`${this.baseURL}/remove/${itemId}`, {
        method: 'DELETE',
        ...this.getConfig()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar producto');
      }

      return data;
    } catch (error) {
      console.error('❌ Error removeProduct:', error);
      throw error;
    }
  }

  // Actualizar cantidad de un producto
  async updateQuantity(itemId, quantity) {
    try {
      const response = await fetch(`${this.baseURL}/update/${itemId}`, {
        method: 'PUT',
        ...this.getConfig(),
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar cantidad');
      }

      return data;
    } catch (error) {
      console.error('❌ Error updateQuantity:', error);
      throw error;
    }
  }

  // Vaciar cistella completa
  async clearCistella() {
    try {
      const response = await fetch(`${this.baseURL}/clear`, {
        method: 'DELETE',
        ...this.getConfig()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al vaciar cistella');
      }

      return data;
    } catch (error) {
      console.error('❌ Error clearCistella:', error);
      throw error;
    }
  }

  // Calcular total de la cistella
  calculateTotal(cistella) {
    if (!cistella || !cistella.items) return 0;
    
    return cistella.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Contar items en la cistella
  countItems(cistella) {
    if (!cistella || !cistella.items) return 0;
    
    return cistella.items.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  }
}

// Exportar una instancia única (Singleton)
export default new CistellaService();