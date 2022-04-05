import React from 'react'
import { Link } from 'react-router-dom'

function Navbar({ setAuth }) {
	async function handle_signout() {
		localStorage.removeItem('token');
		setAuth(null);
	}

	return (
		<nav className='w-full px-4 py-2 bg-blue-500 text-white flex place-items-center gap-x-6 sticky top-0 shadow-md'>
			<span className='text-2xl'>EMS</span>
			<Link className='hover:text-black' to="/"> Home </Link>
			<Link className='hover:text-black' to="/profile"> Profile </Link>
			<Link className='hover:text-black' to="/manage-poll"> Manage&nbsp;Poll </Link>
			<Link className='hover:text-black' to="/manage-user"> Manage&nbsp;User </Link>
			<div className='w-full'></div>
			<button onClick={handle_signout}> Signout </button>
		</nav>
	)
}

export default Navbar