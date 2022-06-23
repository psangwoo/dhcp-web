import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import MouseOverPop from './Popover.js'

const ServerInfoButton = (props) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [info, setInfo] = useState([]);
	useEffect(() => {
		fetch('api/getnic.php')
		.then( res => res.json() )
		.then( data => setInfo(data) );
	}, []);

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	}
	const handleClose = () => {
		setAnchorEl(null);
	}

	const open = Boolean(anchorEl);
	const id = open ? 'config-popover-serverinfo' : undefined;
	return(
		<div>
			<Button aria-describedby={id} variant="outlined" onClick={handleClick}>
				Server Subnet Info
			</Button>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
			>
				<Typography sx={{ p: 2}} >
				{info.map( ({addr}) => (<span> {addr.slice(0, -2)}<br/> </span>)
				)}
				</Typography>
			</Popover>
		</div>
	);	
}

const Configinput = (props) => {
	const navigate = useNavigate();
	const [config, setConfig] = useState(props.data);
	const inputEnter = (e) => {
		setConfig({
			...config,
			[e.target.name]: e.target.value
		});
	}
	const submitEvent = () => {
		if(!ipShapeInput(config.subnet, 3))
			return;
		if(!ipShapeInput(config.dns, 4))
			return;
		if(config.domain === '')
			return;
		if(!ipShapeInput(config.mask, 4))
			return;
		fetch(`api/config.php?${props.username}`, {
			method: props.edit === "true" ? "PUT" : "POST",
			body: JSON.stringify(config)
		})
		.then( res => res.json() )
		.then( code => {
			if (code === '1'){
				alert('Configure Updated !');
				navigate(props.backPath, {state:{
					id: props.username,
					authed: props.authed
				}})
			}
			else if (code === '-1'){
				alert('DB Server Error');
			}
			else if ( code === '-2'){
				alert(`Subnet ${config.subnet} already exists`);
			}
			else {
				alert('Unknown Error Occured ');
//				navigate('/');
			}
		})
	}
	const SelectBox = (props) => {
		props.range_start = props.range_start === "" ? 0 : parseInt(props.range_start);
		if (isNaN(props.range_start))
			props.range_start = 0;
		props.range_end = parseInt(props.range_end);
		return ( 
		<FormControl fullWidth >
			<InputLabel id={props.labelId}> {props.labelName} </InputLabel>
			<Select
				error={props.value === '' ? true : false}
				labelId={props.labelId}
				id="test"
				name={props.name}
				value={props.value}
				onChange={inputEnter}
				
			>
			{Array(props.range_end - props.range_start).fill().map((v, i) => i).map( i => (
				<MenuItem value={i + props.range_start} > {i + props.range_start}  </MenuItem>
			))}
			</Select>
		</FormControl>
		);
	}
	const isNum = (str) => {
		var numlist = /^[0-9]+$/;
		if ( str.match(numlist) )
			return true;
		else
			return false;
	}
	const ipShapeInput = (str, count) => {
		let arr = str.split('.');
		if (arr.length !== count)
			return false;
		arr.forEach( elem => {
			if(!(!isNaN(elem) && !isNaN(parseFloat(elem)))){
				return false;
			}
			else if( parseInt(elem) > 255 ){
				return false;
			}
		})
		return true;
	}
	return(
		<div>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<MouseOverPop
						hover="Cautions"
						text="This DHCP Server is Designed for Class C of IP Address. For Larger Class, Please Seperate Those Into Class C and Configure Them Seperately."
					/>
				</Grid>
				<Grid item xs={6}>
					<MouseOverPop
						hover="About Configuration"
						text="We Do Not Provide Strict Check-Up of Your Input. It means, Successful Configuration on this Page doesn't Guarantee Successful DHCP Work. If any Invalid Input is Given, System Will Automatically Detect them and Won't Execute Corresponding Configure."	/>
				</Grid>
				<Grid item xs={3} />
				<Grid item xs={6}>
				{props.edit === "false"
					?<Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
						<MouseOverPop
							text="Subnet to Set Configuration Of"
							hgt
						/>
						<TextField
							error={!ipShapeInput(config.subnet, 3)}
							helperText="Input Must be IP-Shaped"
							fullWidth
							margin="normal"
							label="Subnet Address"
							name="subnet"
							value={config.subnet}
							autoFocus
							onChange={inputEnter}
							required
						/></Box>
					: <Box
						sx={{
							backgroundColor: 'primary.dark'
						}}> Subnet Address : {config.subnet} </Box>
				}
				</Grid>
				<Grid item xs={3} >	
				{props.edit === "false" &&
					<ServerInfoButton />
				}
				</Grid>
				<Grid item xs={3} />
				<Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
					<MouseOverPop
						text={`Range of IP Address to be allocated, Current : ${config.subnet}.${config.minrange} ~ ${config.subnet}.${config.maxrange}`}
					/>
					<SelectBox
						labelId="minrange"
						labelName="Minimum Range"
						name="minrange"
						value={config.minrange}
						range_start={0}
						range_end={256}
					/>
					-
					<SelectBox
						labelId="maxrange"
						labelName="Maximum Range"
						name="maxrange"
						value={config.maxrange}
						range_start={config.minrange}
						range_end={256}
				/></Box></Grid>
				<Grid item xs={3}/>
				<Grid item xs={3}/>
				<Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'flex-end'}} spacing={2}>
					<MouseOverPop
						text="Name of Domain"
					/>
					<TextField
						fullWidth
						error={config.domain === '' ? true : false}
						margin="normal"
						label="Domain Name"
						name="domain"
						value={config.domain}
						autoFocus
						onChange={inputEnter}
				/></Box></Grid>
				<Grid item xs={3}/>
				<Grid item xs={3}/>
				<Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
					<MouseOverPop
						hgt
						text="Address of Domain"
					/>
					<TextField
						error={!ipShapeInput(config.dns, 4)}
						helperText="Input Must be IP-Shaped"
						fullWidth
						margin="normal"
						label="DNS Address"
						name="dns"
						value={config.dns}
						autoFocus
						onChange={inputEnter}
				/></Box></Grid>
				<Grid item xs={3}/>
				<Grid item xs={3}/>
				<Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
					<MouseOverPop
						hgt
						text="Default Lease Time to be Allocated"
					/>
					<TextField
						fullWidth
						error={!isNum(config.leasetime)}
						helperText="Input Must be Number"
						margin="normal"
						name="leasetime"
						label="Lease Time"
						value={config.leasetime}
						autoFocus
						onChange={inputEnter}
				/></Box></Grid>
				<Grid item xs={3}/>
				<Grid item xs={3}/>
				<Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
					<MouseOverPop
						hgt
						text={`Subnet Mask of This Subnet, Recommended Mask Same With or Stricter than 255.255.255.0, Current : ${config.mask}`}
					/>
					<TextField
						fullWidth
						error={!ipShapeInput(config.mask, 4)}
						helperText="Input Must be IP-Shaped"
						margin="normal"
						label="Subnet Mask"
						name="mask"
						value={config.mask}
						autoFocus
						onChange={inputEnter}
				/></Box></Grid>
				<Grid item xs={3}/>
				<Grid item xs={3}/>
				<Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
					<MouseOverPop
						text={`Address of Gateway of This Subnet, Current : ${config.subnet}.${config.gateway}`}
					/>
					<SelectBox
						labelId="gateway"
						labelName="Gateway Address"
						name="gateway"
						value={config.gateway}
						range_start={0}
						range_end={256}
				/></Box></Grid>
				<Grid item xs={3}/>
				<Grid item xs={3}/>
				<Grid item xs={6}><Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
					<MouseOverPop
						text={`Address that Will Execute Broadcast Communication to, Current : ${config.subnet}.${config.broadcast}`}
					/>
					<SelectBox
						labelId="broadcast"
						labelName="Broadcast Address"
						name="broadcast"
						value={config.broadcast}
						range_start={0}
						range_end={256}
				/></Box></Grid>
			</Grid>
			<br/>
			<Button onClick={submitEvent} variant="contained" size="large"> Submit </Button>
	</div>
	);	
}
export default Configinput;
