import './App.css';
import {BrowserRouter as Router, Link, Outlet, Route, Routes} from 'react-router-dom'
import logo from '../src/superset.png';
import Company from './components/company';
import Admin from './components/admin';
import Industry from './components/industry';

function App() {
  return (
  <>  
  <section className='section'>
  <Router>
    <aside className='side-bar'>
      <a href='/'>
      <img src={logo} className="logo" alt='logo'></img>  
      </a>
    <div className='sidebar-links'>

        <ul className='sidebar-ul'>
          <li className='hide'>
            <Link to="/"></Link>  <br></br>
          </li>
          <li className='sidebar-item'>
            <Link to="/Company"><i className='fa fa-home'></i> Company </Link>  
          </li>
          <li className='sidebar-item'>
            <Link to="/Industry"><i className="fa fa-industry"></i> Industry </Link>  
          </li>
          <li className='sidebar-item'>
            <Link to="/Admin"><i className='fa fa-users'></i> Admin </Link> 
          </li>
        </ul>
    </div>
    </aside>
    <div id='main-section'>
        <Routes>
            <Route path='/' element={<Outlet />}></Route>
            <Route path='/company' element={<Company />}></Route>
            <Route path='/admin' element={<Admin />}></Route>
            <Route path='/industry' element={<Industry />}></Route>
          </Routes>
      <div id='main-section-span' className='main-section-span'>Select an option from side bar</div>
    </div>  
    </Router>
  </section>
  </>
  );
}

export default App;
