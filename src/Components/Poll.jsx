import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react'

function Poll({ data }) {
	return (
		<li className='my-6 py-4 px-8 bg-white rounded shadow grid gap-y-3'>
			<div>
				<h1 className='text-3xl' > {data.Name} </h1>
				<span className='text-gray-500' > {data._id} </span>
			</div>
			<div>
				<span className='font-bold'> Time : </span>
				<span className='text-gray-700'> {moment(data.Start_Time).format("DD/MM/YYYY hh:mm a")} </span> to
				<span className='text-gray-700'> {moment(data.Start_Time).format("DD/MM/YYYY hh:mm a")} </span>
			</div>
			{
				data.Upcoming ?
					<UpcomingPoll options={data.Options} /> :
					(
						data?.Result ?
							<PollResult result={data.Result} options={data.Options} total_vote={data.Total_Vote} /> :
							<Candidates poll_id={data._id} options={data.Options} />
					)
			}
			<div>
				<span className='font-bold'> Total Vote: </span>
				<span className='text-gray-700'> {data.Total_Vote} </span>
			</div>
			<div>
				{
					data.WhoCan.map((v, i) =>
						<span
							key={i}
							className='px-3 py-1 mr-4 rounded-sm bg-blue-500 text-white'
						>
							{v}
						</span>
					)
				}
			</div>
		</li>
	)
}

function Candidates({ poll_id, options }) {
	const [vote, setVote] = useState(-1);

	async function handle_submit(e) {
		e.preventDefault();

		if (vote !== -1) {
			axios({
				method: 'post',
				url: '/poll/vote',
				data: {
					poll_id: poll_id,
					vote: vote
				}
			})
				.then(res => {
					alert(res.data);
				})
				.catch(e => {
					alert(e.response.data);
				})
		}
		else alert("Select candidate first");
	}


	return (
		<form
			className='flex gap-2 items-center'
			onSubmit={handle_submit}
		>
			<select
				name="poll"
				id="poll"
				className='w-1/2 max-w-md min-w-fit py-2 px-4 bg-blue-500 text-white rounded'
				value={vote}
				onChange={(e) => setVote(e.target.value)}
			>
				<option key={-1} value={-1} >
					Choose your best leader
				</option>
				{
					options.map(({ Name, Party }, index) =>
						<option key={index} value={index}>
							{Party}: {Name}
						</option>
					)
				}
			</select>
			<button className='py-1 px-4 border border-blue-500 rounded hover:bg-blue-100' >
				Give Vote
			</button>
		</form>
	);
}

function PollResult({ options, result, total_vote }) {
	const winnersVote = result.reduce((prev, cur) => Math.max(prev, cur), 0);

	return (
		<div>
			<span className='font-bold' >Result</span>
			<span className='text-gray-600' > (Party: candidate ----&gt; count) : </span>
			<ul className='p-4 flex flex-col gap-y-2' >
				{
					options.map(({ Name, Party }, index) => {
						let background = "rgb(225,225,225)";
						if (total_vote) {
							const percentage = Math.floor(100 * result[index] / total_vote);
							background = `linear-gradient(to right, ${winnersVote === result[index] ? '#51e351e0' : '#7ebefde6'} ${percentage}%, rgb(225,225,225) ${percentage}% ${100 - percentage}%)`;
						}

						return <li
							key={index}
							className='py-2 px-4 rounded'
							style={{ background: background }}
						>
							<span className='font-bold' >{Party}: </span>
							{Name} ----&gt; {result[index]}/{total_vote}
						</li>
					})
				}
			</ul>
		</div >
	);
}

function UpcomingPoll({ options }) {
	return (
		<div>
			<div>Leaders of this election(<span className='text-green-600 font-bold'>Upcoming</span>)</div>
			<ul>
				{
					options.map((data, index) =>
						<li key={index}>
							<span className='font-bold' >{data.Party}: </span>
							<span className='text-gray-600' >{data.Name}</span>
						</li>
					)
				}
			</ul>
		</div>
	);
}

export default Poll