// composables/useApi.js
import { ref } from 'vue'

// 1. Obtenemos la URL base del archivo .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useApi(endpoint) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchApi = async () => {
    loading.value = true
    error.value = null
    
    try {
      // 2. Concatenamos la URL base con el endpoint que pidas
      const response = await fetch(`${BASE_URL}${endpoint}`)
      
      if (!response.ok) throw new Error('Error en la petición')
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, fetchApi }
}