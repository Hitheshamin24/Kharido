import { useSelector, useDispatch } from 'react-redux'
import { useApi } from '../../../shared/api/useApi'
import {
  setProducts,
  selectAllProducts,
  selectPublishedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleStatus,
} from '../state/productsSlice'

export const useProducts = () => {
  const dispatch = useDispatch()
  const api = useApi()
  const all = useSelector(selectAllProducts)
  const published = useSelector(selectPublishedProducts)

  const fetchAll = async () => {
    try {
      const res = await api.get('/products')
      dispatch(setProducts(res.data.products || res.data))
      return res.data
    } catch (err) {
      console.error('Error fetching products:', err)
      throw err
    }
  }

  const fetchSellerProducts = async () => {
    try {
      const res = await api.get('/products/seller')
      dispatch(setProducts(res.data.products || res.data))
      return res.data
    } catch (err) {
      console.error('Error fetching seller products:', err)
      throw err
    }
  }

  const fetchById = async (id) => {
    try {
      const res = await api.get(`/products/${id}`)
      return res.data.product || res.data
    } catch (err) {
      console.error('Error fetching product by id:', err)
      throw err
    }
  }

  const add = async (formData) => {
    try {
      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      dispatch(addProduct(res.data.product || res.data))
      return res.data
    } catch (err) {
      console.error('Error adding product:', err)
      throw err
    }
  }

  const update = async ({ id, data }) => {
    try {
      const res = await api.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      dispatch(updateProduct(res.data.product || res.data))
      return res.data
    } catch (err) {
      console.error('Error updating product:', err)
      throw err
    }
  }

  const remove = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      dispatch(deleteProduct(id))
    } catch (err) {
      console.error('Error deleting product:', err)
      throw err
    }
  }

  const toggle = (id) => {
    return dispatch(toggleStatus(id))
  }

  return {
    all,
    published,
    fetchAll,
    fetchSellerProducts,
    fetchById,
    add,
    update,
    remove,
    toggle,
  }
}
