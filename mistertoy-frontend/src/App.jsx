import './assets/style/main.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { ToyEdit } from './pages/ToyEdit.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ToyIndex } from './pages/ToyIndex.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { ToyDetails } from './pages/ToyDetails.jsx'

function App() {

  return (
    <Provider store={store}>
      <Router>
        <section className='app'>
          <AppHeader />
          <main className='main-layout'>
            <Routes>
              <Route element={<HomePage />} path='/' />
              <Route element={<AboutUs />} path='/about' />
              <Route element={<ToyIndex />} path='/toy' />
              <Route element={<ToyEdit />} path="/toy/edit/:toyId?" />
              <Route element={<ToyDetails />} path="/toy/:toyId" />
                {/* <Route element={<HomePage />} path='/' /> */}
            </Routes>
          </main>
          <AppFooter />
        </section>
      </Router>
    </Provider>
  )
}

export default App
