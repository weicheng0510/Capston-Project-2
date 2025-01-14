import './App.css';
import { Routes, Route } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Notfound from './pages/NotFound';
import SignUp from './pages/SignUp';
import useLocalStorage from './helpers/useLocalStorage'
import { useEffect, useState } from 'react';
import Api from './common/api';
import UserContext from './contect/useContect';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import AdminPanel from './pages/AdminPanel';
import AllUsers from './pages/AllUsers';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SearchProduct from './pages/SearchProduct';
import CategoryProduct from './pages/CategoryProduct';
import BrandProduct from './pages/BrandProduct';



function App() {
  const [token, setToken] = useLocalStorage('token');
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const dispatch = useDispatch();

  const userCheck = async () => {
    if (token) {
      try {
        const res = await fetch(Api.currentUser.url, {
          method: Api.currentUser.method,
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Please log in');
        }

        const resData = await res.json();

        // Set the user in the Redux store
        dispatch(setUserDetails(resData.data));


      } catch (err) {
        console.error('Error fetching user:', err);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }

  const fetchCart = async () => {
    if (token) {
      const res = await fetch(Api.countCart.url, {
        method: Api.countCart.method,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const resData = await res.json();

      setCartCount(resData.data.count);
    }
  }


  useEffect(() => {
    userCheck();
    fetchCart();
  }, [token])


  return (
    <UserContext.Provider value={{ setToken, token, fetchCart, cartCount }}>
      <div className='App'>
        <ToastContainer position="top-center" autoClose={2000} />
        <Navbar />
        <main className='min-h-[calc(100vh-120px)]'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/admin-panel' element={<AdminPanel />}>
              <Route path='all-users' element={<AllUsers />} />
              <Route path='products' element={<Products />} />
            </Route>
            <Route path='/search' element={<SearchProduct />} />
            <Route path='/category/:category' element={<CategoryProduct />} />
            <Route path='/brand/:brand' element={<BrandProduct />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/cart' element={<Cart />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default App;
