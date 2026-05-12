// Client API pour communiquer avec le backend BUS TRAVEL
class BusTravelAPI {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = localStorage.getItem('bustravel_token');
  }

  // Configuration des headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Gestion des erreurs
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur serveur');
    }
    
    return data;
  }

  // Requête générique
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // === TRAJETS ===
  
  async getTrajets(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/trajets${params ? '?' + params : ''}`;
    return this.request(endpoint);
  }

  async getTrajet(id) {
    return this.request(`/trajets/${id}`);
  }

  async searchTrajets(query) {
    return this.request(`/trajets/search/${query}`);
  }

  // === RÉSERVATIONS ===

  async createReservation(reservationData) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  }

  async getReservations(email) {
    return this.request(`/reservations/passager/${email}`);
  }

  async getReservationByNumero(numero) {
    return this.request(`/reservations/numero/${numero}`);
  }

  async cancelReservation(id) {
    return this.request(`/reservations/${id}/annuler`, {
      method: 'PUT'
    });
  }

  // === UTILISATEURS ===

  async inscription(userData) {
    return this.request('/users/inscription', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async connexion(credentials) {
    const response = await this.request('/users/connexion', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Sauvegarder le token
    if (response.data.token) {
      this.token = response.data.token;
      localStorage.setItem('bustravel_token', this.token);
    }
    
    return response;
  }

  async getProfil() {
    return this.request('/users/profil');
  }

  async updateProfil(userData) {
    return this.request('/users/profil', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async changePassword(passwords) {
    return this.request('/users/motdepasse', {
      method: 'PUT',
      body: JSON.stringify(passwords)
    });
  }

  async forgotPassword(email) {
    return this.request('/users/motdepasse-oublie', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async checkEmailAvailability(email) {
    return this.request(`/users/verification/email/${email}`);
  }

  // Utilitaires
  logout() {
    this.token = null;
    localStorage.removeItem('bustravel_token');
  }

  isAuthenticated() {
    return !!this.token;
  }

  // Méthodes pour le frontend
  async loadTrajetsToPage(filters = {}) {
    try {
      const response = await this.getTrajets(filters);
      return response.data;
    } catch (error) {
      console.error('Erreur chargement trajets:', error);
      throw error;
    }
  }

  async makeReservation(reservationData) {
    try {
      const response = await this.createReservation(reservationData);
      
      // Afficher une notification de succès
      this.showNotification('✅ Réservation créée avec succès!', 'success');
      
      return response;
    } catch (error) {
      this.showNotification(`❌ Erreur: ${error.message}`, 'error');
      throw error;
    }
  }

  showNotification(message, type = 'info') {
    // Créer une notification simple
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#25D366' : type === 'error' ? '#dc3545' : '#ff7a00'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Supprimer après 3 secondes
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Exporter une instance globale
window.busTravelAPI = new BusTravelAPI();

// Ajouter le CSS pour les animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
