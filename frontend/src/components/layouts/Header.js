import React from 'react'
import Search from './Search'
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { DropdownButton, Dropdown, Image } from 'react-bootstrap'
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu'
import { logout } from '../../actions/userActions'
function Header() {

  const { isAuthenticated, user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();


  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(logout);
  }
  return (
    <div><nav className="navbar row ">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to={"/"}>
            <img width="150px" height= "80px" src="/images/logo.png" alt='Mozhi' />
          </Link>
        </div>
      </div>

     

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        {isAuthenticated ?

          (
            <Dropdown className='d-inline'>
              <Dropdown.Toggle variant='default-text-white pr-5' id='dropdown-basic' >
                <figure className='avatar avatar-nav'>
                  <Image width={"50px"} src={user.avatar ?? './images/default_avatar.png'} />
                </figure> 
                <span style={{color:"white"}}>{user.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  user.role==="admin" &&
                <Dropdown.Item onClick={() => { navigate("/admin/dashboard") }} className='text-dark'>Dropdown</Dropdown.Item>
                }
                <Dropdown.Item onClick={() => { navigate("/myprofile") }} className='text-dark'>Profile</Dropdown.Item>
                <Dropdown.Item onClick={logoutHandler} className='text-danger'>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )


          :
          <Link to={"/login"}>
            <button className="btn" id="login_btn">Login</button>
            {/* C:\Users\ravikrishna\Videos\Captures */}
          </Link>
        }


       
      </div>
    </nav>
    </div>

  )
}

export default Header