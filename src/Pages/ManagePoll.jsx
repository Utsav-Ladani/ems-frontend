import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react'

function ManagePoll() {
	const [flag, setFlag] = useState(true);
	const [loading, setLoading] = useState("");

	const [pollID, setPollID] = useState("");
	const [name, setName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endDate, setEndDate] = useState("");
	const [endTime, setEndTime] = useState("");
	const [whoCan, setWhoCan] = useState("");
	const [candidates, setCandidates] = useState("");


	function reset_data() {
		setFlag(true);
		setLoading("");
		setPollID("");
		setName("");
		setStartDate("");
		setStartTime("");
		setEndDate("");
		setEndTime("");
		setWhoCan("");
		setCandidates("");
	}

	function validate_data() {
		if (!name.trim()) return false;
		if (!startDate.trim()) return false;
		if (!startTime.trim()) return false;
		if (!endDate.trim()) return false;
		if (!endTime.trim()) return false;

		const arr = whoCan.replace(" ", "").split(",").filter(val => val !== "");
		if (arr.length !== whoCan.replace(" ", "").split(",").length) return false;

		const carr = candidates.replace(" ", "").split("|")
			.filter(val =>
				val.split("-").filter(v => v !== "").length === 2
			);
		if (carr.length !== candidates.replace(" ", "").split("|").length) return false;

		return true;
	}

	async function handle_search(e) {
		e.preventDefault();


		if (pollID.trim()) {
			setLoading("Loading poll data...");
			axios("/admin?poll_id=" + pollID)
				.then(res => {
					setName(res.data.Name);

					const s_date = moment(res.data.Start_Time);
					setStartDate(s_date.format("YYYY-MM-DD"));
					setStartTime(s_date.format("hh:mm"));

					const e_date = moment(res.data.End_Time);
					setEndDate(e_date.format("YYYY-MM-DD"));
					setEndTime(e_date.format("hh:mm"));

					const whocans = res.data.WhoCan.reduce((prev, cur) => prev + ", " + cur, "");
					setWhoCan(whocans.substr(2, whocans.length - 2));

					const cand = res.data.Options.reduce((prev, cur) => prev + " | " + cur.Name + " - " + cur.Party, "");
					setCandidates(cand.substr(2, cand.length - 2));

					setFlag(false);
					setLoading("");
				})
				.catch(e => {
					alert(e.response.data ?? e);
					setLoading("");
				})
		}
		else alert("Enter valid details");
	}

	async function handle_cancel() {
		reset_data();
	}

	async function handle_create() {
		if (validate_data()) {
			setLoading("Creating poll...");
			const data = {
				Name: name,
				Start_Time: moment(startDate + " " + startTime).valueOf(),
				End_Time: moment(endDate + " " + endTime).valueOf(),
				WhoCan: whoCan.replace(" ", "").split(",").filter(val => val !== ""),
				Options: candidates.replace(" ", "").split("|")
					.filter(val =>
						val.split("-").filter(v => v !== "").length
					).map(vv => { return { Party: vv.split("-")[0], Name: vv.split("-")[1] } }),
			};

			axios({
				method: "POST",
				url: "/admin/create",
				data: data
			})
				.then(res => {
					alert(res.data);
					reset_data();
				})
				.catch(e => {
					alert(e.response.data ?? e);
					setLoading("");
				})
		}
		else alert("Enter valid details");
	}


	async function handle_update() {
		if (validate_data()) {
			setLoading("Updating poll...");
			const data = {
				Name: name,
				Start_Time: moment(startDate + " " + startTime).valueOf(),
				End_Time: moment(endDate + " " + endTime).valueOf(),
				WhoCan: whoCan.replace(" ", "").split(",").filter(val => val !== ""),
				Options: candidates.replace(" ", "").split("|")
					.filter(val =>
						val.split("-").filter(v => v !== "").length
					).map(vv => { return { Party: vv.split("-")[0], Name: vv.split("-")[1] } }),
			};

			axios({
				method: "PUT",
				url: "/admin/update?poll_id=" + pollID,
				data: data
			})
				.then(res => {
					alert(res.data);
					reset_data();
				})
				.catch(e => {
					alert(e.response.data ?? e);
					setLoading("");
				})
		}
		else alert("Enter valid details");
	}

	async function handle_delete() {
		setLoading("Deleting poll...");
		axios({
			method: "DELETE",
			url: "/admin/delete?poll_id=" + pollID,
		})
			.then(res => {
				alert(res.data);
				reset_data();
			})
			.catch(e => {
				alert(e.response.data ?? e);
				setLoading("");
			})
	}

	return (
		<div className='w-full h-full px-14 py-6 flex flex-col items-center gap-y-3 '>
			<form
				className='flex gap-x-4'
				onSubmit={handle_search}
			>
				<input
					className='inp w-96'
					type={'text'}
					name='Poll ID'
					placeholder='Search poll here'
					value={pollID}
					onChange={(e) => { setPollID(e.target.value) }}
				/>
				<button
					name='search'
					type='submit'
					className='btn'
				>
					Search Poll
				</button>
			</form>
			<span>{loading}</span>
			<form
				className='px-10 py-12 bg-white rounded w-96 flex flex-col gap-y-3 items-center'
				onSubmit={(e) => { e.preventDefault() }}
			>
				<h1 className='text-3xl text-blue-600' >Manage Poll</h1>
				<input
					className='inp w-full'
					type='text'
					name='Name'
					placeholder='Name'
					value={name}
					onChange={(e) => { setName(e.target.value) }}
				/>
				<label className='w-full -mb-2 font-bold' htmlFor="Start_Date">Start Time and Date</label>
				<div className='flex gap-x-2 w-full'>
					<input
						className='inp'
						type='date'
						name='Start_Date'
						placeholder='Opening Date'
						value={startDate}
						onChange={(e) => { setStartDate(e.target.value) }}
					/>
					<input
						className='inp'
						type='time'
						name='Start_Time'
						placeholder='Opening Time'
						value={startTime}
						onChange={(e) => { setStartTime(e.target.value) }}
					/>
				</div>
				<label className='w-full -mb-2 font-bold' htmlFor="End_Date">End Time and Date</label>
				<div className='flex gap-x-2 w-full'>
					<input
						className='inp'
						type='date'
						name='End_Date'
						placeholder='Closing Date'
						value={endDate}
						onChange={(e) => { setEndDate(e.target.value) }}
					/>
					<input
						className='inp'
						type='time'
						name='End_Time'
						placeholder='Closing Time'
						value={endTime}
						onChange={(e) => { setEndTime(e.target.value) }}
					/>
				</div>
				<input
					className='inp w-full'
					type='text'
					name='WhoCan'
					placeholder='Who can vote?'
					value={whoCan}
					onChange={(e) => { setWhoCan(e.target.value.trim()) }}
				/>
				<input
					className='inp w-full'
					type='text'
					name='Candidates'
					placeholder='Enter Candidates'
					value={candidates}
					onChange={(e) => { setCandidates(e.target.value.trim()) }}
				/>
				{
					flag ?
						<button
							name='create'
							type='submit'
							className='btn'
							onClick={handle_create}
						>
							Create Poll
						</button>
						: <>
							<button
								name='update'
								type='submit'
								className='btn-plain text-white bg-green-600'
								onClick={handle_update}
							>
								Update Poll
							</button>
							<button
								name='delete'
								type='submit'
								className='btn-plain text-white bg-red-600'
								onClick={handle_delete}
							>
								Delete Poll
							</button>
						</>
				}
				<button
					name='cancel'
					type='submit'
					className='inp bg-white text-gray-700'
					onClick={handle_cancel}
				>
					Cancel
				</button>
			</form>
		</div>
	);
}

export default ManagePoll