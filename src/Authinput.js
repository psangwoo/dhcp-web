import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
const Authinput = (props) => {
	const navigate = useNavigate();
	const [state, setState] = useState({
		pd: Math.floor(Math.random() * (10000001 - 1) + 1),
		id: '',
		pw: '',
		pw_d: '',
		authed: false
	});

	const inputEnter = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value
		});
	}
	const encrypt = (plaintext, n) => {
		let ret= [];
		for (var i = 0; i < plaintext.length; i++)	{
			ret.push(plaintext.charCodeAt(i) * n);
		}
		return ret;
	}
	const isAlphaNum = (str) => {
		var letnum = /^[0-9a-zA-Z]+$/;
		if( str.match(letnum) )
			return true;
		else
			return false;
	}
	const inputDone = (e) => {
		e.preventDefault();
		if(state.id.length < 4) {
			props.setResult({
				status: true,
				comment: "Too Short Username is Given"
			});
			return;
		}

		if(!isAlphaNum(state.id)) {
			props.setResult({
				status: true,
				comment: "Unusable Chracter is in Username"
			});
			return;
		}
		if(state.pw.length < 4) {
			props.setResult({
				status: true,
				comment: "Too Short Password is Given"
			});
			return;
		}

		if(!isAlphaNum(state.pw)) {
			props.setResult({
				status: true,
				comment: "Unusable Character is in Password"
			});
			return;
		}
		if(props.register){
			if( state.pw !== state.pw_d){
				props.setResult({
					status: true,
					comment: "Could not Confirm Password, Please Type Same Value"
				})
			return;
			};
		}

		fetch(props.apiPath, {
			method: 'POST',
			body:JSON.stringify({
				id: encrypt(state.id, state.pd),
				pw: encrypt(state.pw, state.pd),
				pd: state.pd
			})
		})
		.then( res => res.json() )
		.then( code => {
			if(code === '1') {
				setState({
					authed: true
				});
				if(props.register){
					alert('Registration Complete !');
				}
				navigate('/mypage', {state: {
					id: state.id,
					authed: true
					}});
			}
			else {
				props.setResult({
					status: true,
					comment: code
				});
			}
		})
	}
	return (
		<div>
			<form onSubmit={inputDone} >
			<TextField
				margin="normal"
				required
				label="User ID"
				name="id"
				value={state.id}
				onChange={inputEnter}
				autoFocus
				fullWidth
			/>
			<br/>
			<TextField
				margin="normal"
				required
				type="password"
				name="pw"
				value={state.pw}
				onChange={inputEnter}
				label="Password"
				fullWidth
			/>
			<br/>
			{props.register &&
				<TextField
					margin="normal"
					required
					type="password"
					name="pw_d"
					value={state.pw_d}
					onChange={inputEnter}
					label="Confirm Password"
					fullWidth
				/>
			}
			<br/>
			<Button
				type="submit"
				variant="contained"
				size="large"
				onClick={inputDone}
				fullWidth
			>
			{props.boxval}
			</Button>
			</form>
		</div>
	);
}

export default Authinput;
