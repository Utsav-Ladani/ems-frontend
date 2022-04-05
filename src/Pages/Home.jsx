import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Poll from '../Components/Poll'

function Home() {
	const [polls, setPolls] = useState(null);
	const [pollname, setPollName] = useState("");

	useEffect(() => {
		axios("/poll/search/?poll_name=" + pollname)
			.then(res => {
				setPolls(res.data);
			})
			.catch(e => {
				setPolls(null);
			})
	}, [pollname]);

	return (
		<div className='w-full h-full px-14 py-6 flex flex-col items-center gap-y-3 '>
			<input
				className='inp w-96 sticky top-1 shadow-lg'
				type={'text'}
				name='Poll Name'
				placeholder='Search poll here'
				value={pollname}
				onChange={(e) => { setPollName(e.target.value) }}
			/>
			{
				polls == null ? <div>Loading...</div> :
					(
						polls.length === 0 ? <div>Poll Not Found</div> :
							<ul className='w-full' >
								{
									polls.map((p, i) => {
										return <Poll key={i} data={p} />
									})
								}
							</ul>
					)
			}
		</div>
	)
}

export default Home