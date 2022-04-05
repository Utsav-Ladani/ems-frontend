import axios from 'axios';
import React, { useState } from 'react'

function Signin({ setAuth }) {
	const [voterID, setVoterID] = useState("");
	const [password, setPassword] = useState("");

	async function handle_signin(e) {
		e.preventDefault();

		if (voterID.trim() && password.trim()) {
			axios({
				method: 'post',
				url: '/auth/signin',
				data: {
					voter_id: voterID,
					password: password
				}
			})
				.then(res => {
					localStorage.setItem('token', res.data);
					setAuth(res.data);
				})
				.catch(e => {
					localStorage.removeItem('token');
					setAuth(null);
					alert(e.response.data);
				})
		}
		else alert("Enter valid details");
	}

	return (
		<div className='w-full h-screen min-h-fit p-10 bg-blue-100 grid place-items-center'>
			<form
				className='px-10 py-12 bg-white rounded w-80 flex flex-col gap-y-5 items-center'
				onSubmit={handle_signin}
			>
				<h1 className='text-3xl text-blue-600' >SignIn</h1>
				<input
					className='inp'
					type={'text'}
					name='Voter ID'
					placeholder='Voter ID'
					value={voterID}
					onChange={(e) => { setVoterID(e.target.value) }}
				/>
				<input
					className='inp'
					type={'password'}
					name='password'
					placeholder='Password'
					value={password}
					onChange={(e) => { setPassword(e.target.value) }}
				/>
				<button
					name='submit'
					type='submit'
					className='btn'
				>
					Signin
				</button>
			</form>
		</div>
	)
}

export default Signin