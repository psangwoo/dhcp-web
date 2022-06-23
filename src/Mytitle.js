import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const Mytitle = (props) => {
	const navigate = useNavigate();
	const onBackClick = () => {
		navigate(-1,{ state:{
			id: props.id,
			authed: props.authed,
			subnet: props.subnet
		}})
	}
	const onLogoutClick = () => {
		navigate('/')
	}
	return(
		<div>
			<Grid container spacing={1}>
				<Grid item xs={2}>
					{props.goback &&
						<Button onClick={onBackClick} variant="contained" color="success"> Go Back </Button>
					}
				</Grid>
				<Grid item xs={8}>
				<b>{props.text}</b>
				</Grid>
				<Grid item xs={2}>
				{props.logout &&
					<Button onClick={onLogoutClick} variant="contained" color="warning"> Log Out </Button>
				}
				</Grid>
			</Grid>
			<hr/>
		</div>
	);
}
export default Mytitle;
