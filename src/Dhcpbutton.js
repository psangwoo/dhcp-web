import * as React from 'react';
import Button from '@mui/material/Button';


const Dhcpbutton = ({username, setStatus}) => {
	const onRun = () => {
		fetch(`api/dhcp.php?method=run&username=${username}`);
		setStatus({
			status: "ON"
		});
	}
	const onStop = () => {
		fetch(`api/dhcp.php?method=stop&username=${username}`);
		setStatus({
			status: "OFF"
		});
	}
	const onRestart = () => {
		onStop();
		onRun();
	}
	return(
		<div>
			<Button variant="contained" onClick={onRun}> RUN </Button>
			<Button variant="contained" color="error" onClick={onStop}> STOP </Button>
			<Button variant="contained" color="secondary" onClick={onRestart}> RESTART </Button>
		</div>
	);	
}
export default Dhcpbutton;
