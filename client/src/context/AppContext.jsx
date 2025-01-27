import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export const AppContext = createContext()

function AppContextProvider({ children }) {

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [credit, setCredit] = useState(false)

  const navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const loadCreditData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } })

      if (data.success) {
        setCredit(data.credits)
        setUser(data.user)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }

  // function to generate image
  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/image/generate-image', { prompt }, { headers: { token } })

      if (data.success) {
        loadCreditData()
        return data.resultImage
      } else {
        toast.error(data.message)
        loadCreditData()
        if (data.creditBalance === 0) {
          navigate('/buy')
        }
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }

  // logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken('')
    setUser(null)
  }

  useEffect(() => {
    if (token) {
      loadCreditData()
    }
  }, [token])

  const value = {
    user,
    setUser,
    setShowLogin,
    showLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditData,
    logout,
    generateImage


  }

  return (<AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
  )
}
export default AppContextProvider





