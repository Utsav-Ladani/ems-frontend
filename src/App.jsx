import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios'
import './App.css';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Signin from './Pages/Signin';
import ManagePoll from './Pages/ManagePoll';
import ManageUser from './Pages/ManageUser';

function App() {
	const [auth, setAuth] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('token');
		setAuth(token);
	}, []);

	axios.interceptors.request.use(
		config => {
			const token = localStorage.getItem('token');
			config.headers.authorization = `Bearer ${token}`;
			return config;
		},
		error => {
			return Promise.reject(error);
		}
	);

	axios.interceptors.response.use(
		res => {
			return res;
		},
		error => {
			if (error.response.status === 401) {
				localStorage.removeItem('token');
				setAuth(null);
			}
			return Promise.reject(error);
		}
	);

	return (
		!auth ? <Signin setAuth={setAuth} /> :
			<Routes>
				<Route path='/signin' element={<Signin setAuth={setAuth} />} />
				<Route path='*' element={
					<div className='w-full h-screen min-h-fit grid grid-rows-layout'>
						<Navbar setAuth={setAuth} />
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/profile' element={<Profile />} />
							<Route path='/manage-poll' element={<ManagePoll />} />
							<Route path='/manage-user' element={<ManageUser />} />
						</Routes>
					</div>
				} />
			</Routes>
	);
}

export default App;
