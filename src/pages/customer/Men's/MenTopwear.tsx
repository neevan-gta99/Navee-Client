import React from 'react'
import { NavLink } from 'react-router-dom';

function MenTopwear() {
  return (
    <section className='mt-32'>
      
      <div className='flex justify-center items-center border-black w-screen h-screen border p-4 m-5'>
        <div className='filters'></div>
        <div className='products'>
          <div className='banner'></div>
          <div className='products-showcase'>
            <ul>
              <li>
                  <NavLink to="/mens-tshirts">Tshirts</NavLink>
              </li>
              <li>
                  <NavLink to="/mens-shirts">Shirts</NavLink>
              </li>
              <li>
                  <NavLink to="/mens-jeans">Jeans</NavLink>
              </li>
              <li>
                  <NavLink to="/mens-triusers">Trouser</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>





    </section>
  )
}

export default MenTopwear;
