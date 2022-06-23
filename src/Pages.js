import './App.css';
import {useState, useEffect} from 'react';
import * as React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Authinput from './Authinput';
import Configinput from './Configinput';
import Dhcpbutton from './Dhcpbutton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Mytitle from './Mytitle';

export const Mainpage = (props) => {
	const navigate = useNavigate();

	const [result, setResult] = useState({
		status: false,
		comment: ''
	});

	const toRegister = () => {
		navigate('register');
	}
	return(
	    <div className="App">

			<Mytitle
				text="DHCP Server Management Service"
			/>
			<Grid container spacing={2}>
				<Grid item xs={4}/>
				<Grid item xs={4}>
					<Authinput setResult={setResult} boxval="Sign In" apiPath = "api/login.php"/>
				</Grid>
				<Grid item xs={4}/>
				<Grid item xs={4}/>
				<Grid item xs={4}>
				{result.status &&
					<Alert severity="error">
						<AlertTitle> <strong> Sign In Failed </strong> </AlertTitle>
						{result.comment}
					</Alert>
				}
				</Grid>
				<Grid item xs={4}/>
				<Grid item xs={4}/>
				<Grid item xs={4}>
					<Button onClick={toRegister} size="large" variant="contained" color="secondary" fullWidth> Sign Up </Button>
				</Grid>
			</Grid>
	    </div>);
}

export const Registerpage = (props) => {
	const [result, setResult] = useState({
		status: false,
		comment: ''
	});

	return(
		<div className="App">
			<Mytitle
				text="Register"
				goback
			/>
			<Grid container spacing={2}>
				<Grid item xs={4}/>
				<Grid item xs={4}>
					<Alert severity="info">
						<AlertTitle><strong> NOTE </strong></AlertTitle>
						Username and Password With Non-Numeric or Non-Alphabetic Characters are not Permitted.
					</Alert>
					<Authinput setResult={setResult} boxval="Sign Up" apiPath="api/register.php" register/>
				</Grid>
				<Grid item xs={4}/>
				<Grid item xs={4}/>
				<Grid item xs={4}>
				{result.status &&
					<Alert severity="error" >
						<AlertTitle> <strong> Sign Up Failed </strong> </AlertTitle>
						{result.comment}
					</Alert>
				}
				</Grid>
			</Grid>
		</div>
	);
};

export const Userpage = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [info, setInfo] = useState([]);
	const [status, setStatus] = useState({
		status: "OFF"
	});
	const {id: username, authed} = location.state;
	useEffect(() => {
		fetch(`api/search.php?${username}`)
		.then( res =>res.json() )
		.then( data => setInfo(data) );
		fetch(`api/dhcp.php?method=status`)
		.then( res => res.json())
		.then( code => {
			if ( code[0] === "7"){
				setStatus({
					status: "ON"
				});
			}
		});
	}, []);


	if(location.state === null){
		alert('Invalid access, return to main ');
		navigate(-1);
		return;
	}
	if(!authed){
		alert('Unauthorized user, return to main ');
		navigate(-1);
		return;
	}
	const toCreate = () =>	{
		navigate('/create', {state: {
			id: username,
			authed: authed
		}})
	}
	const onSubnetClick = (e) => {
		navigate('/subnet', { state: {
			username: username,
			authed: authed,
			subnet: e.target.textContent.replace(/ /g, '')
	}});
	}
	const onServerClick = () => {
		navigate('/server', { state: {
			id: username,
			authed: authed
		}});
	}
	return(
		<div className="App">
			<Mytitle
				text="User Page"
				logout
			/>
			<Grid container spacing={1.5}>
				<Grid item xs={3}>
					<Button variant="outlined" color="secondary" onClick={onServerClick} fullWidth > Show Subnet Configurable </Button>
				</Grid>
				<Grid item xs={3}>
					<Button variant="outlined" onClick={toCreate} fullWidth> Create Subnet </Button>
				</Grid>
				<Grid item xs={3}>
					DHCP {status.status}
				</Grid>
				<Grid item xs={3}>
					<Dhcpbutton username={username} setStatus={setStatus}/>
				</Grid>
				<Grid item xs={1}/>
				<Grid item xs={10}>
					<Box sx={{ backgroundColor: '#ADD8E6' }} >
					Subnet Configuration Information
					</Box>
					<TableContainer component={Paper} sx={{ fontSize: 40, backgroundColor: '#E6E6FA'}}>
					<Table aria-label="config">
					<TableHead sx={{ fontSize: 60, backgroundColor: '#F0F8FF' }} >
						<TableRow>
							<TableCell> SUBNET </TableCell>
							<TableCell align="right"> DOMAIN </TableCell>
							<TableCell align="right"> DNS ADDRESS </TableCell>
							<TableCell align="right"> DEFAULT LEASE TIME </TableCell>
							<TableCell align="right"> SUBNET MASK </TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
					{info.map( row => (
						<TableRow key={row.subnet}>
							<TableCell component="th" scope="row" onClick={onSubnetClick} > {row.subnet} </TableCell>
							<TableCell align="right"> {row.domain} </TableCell>
							<TableCell align="right"> {row.dns} </TableCell>
							<TableCell align="right"> {row.leasetime} </TableCell>
							<TableCell align="right"> {row.mask} </TableCell>
						</TableRow> 
					))}
					</TableBody>
					</Table>
					</TableContainer>
				</Grid>
			</Grid>
		</div>
	);
}

export const Serversubnetpage = (props) => {

	const navigate = useNavigate();
	const location = useLocation();
	const [info, setInfo] = useState([]);
	const {id, authed} = location.state;

	useEffect(() => {
		fetch(`api/getnic.php`)
		.then( res => res.json() )
		.then( data => setInfo(data) );
		
	}, []);

	const onPrevClick = () => {
		navigate(-1,{ state:{
			id: id,
			authed: authed
		}})
	}
	const onCreateClick = () => {
		navigate('/create',{ state:{
			id: id,
			authed: authed
		}})
	}
	return (
		<div className="App">
			<Mytitle
				text="Show Subnet Configurable"
				goback
				logout
				id={id}
				authed={authed}
			/>
			<Grid container spacing={1.5}>
				<Grid item xs={1}/>
				<Grid item xs={10}>
					<Box sx={{ backgroundColor: '#ADD8E6' }} >
					Configurable Subnet List
					</Box>
					<TableContainer component={Paper} sx={{ fontSize: 40, backgroundColor: '#E6E6FA'}}>
					<Table aria-label="addr">
					<TableHead sx={{ fontSize: 60, backgroundColor: '#F0F8FF' }} >
						<TableRow>
							<TableCell> INTERFACE NAME </TableCell>
							<TableCell align="right"> SUBNET ADDRESS </TableCell>
							<TableCell align="right"> SUBNET MASK </TableCell>
							<TableCell align="right"> BROADCAST ADDRESS </TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
					{info.map( row => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row"> {row.name} </TableCell>
							<TableCell align="right"> {row.addr.slice(0, -2)} </TableCell>
							<TableCell align="right"> {row.netmask} </TableCell>
							<TableCell align="right"> {row.broadcast} </TableCell>
						</TableRow> 
					))}
					</TableBody>
					</Table>
					</TableContainer>
				</Grid>
				<Grid item xs={1}/>
				<Grid item xs={1}/>
				<Grid item xs={5}>
					<Button onClick={onPrevClick} variant="outlined" fullWidth > Go to Previous Page </Button>
				</Grid>
				<Grid item xs={5}>
					<Button onClick={onCreateClick} variant="outlined" fullWidth > Create Subnet </Button>
				</Grid>
			</Grid>
		</div>
	)
}


export const Createsubnetpage = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [info, ] = useState({
		subnet: '',
		minrange: '',
		maxrange: '',
		domain: '',
		dns: '',
		leasetime: '',
		mask: '',
		gateway: '',
		broadcast: ''
	});


	if(location.state === null){
		alert('Invalid access, return to main ');
		navigate(-1);
		return;
	}
	const {id: username, authed} = location.state;

	return(
		<div className="App">
			<Mytitle
				text="Create New Subnet"
				goback
				logout
				id={username}
				authed={authed}
			/>
			<header>
				<Configinput username={username} authed={authed} backPath='/mypage' data={info} edit="false"/>
			</header>
	
		</div>
	);
}

export const Editsubnetpage = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [info, setInfo] = useState(null);
	const {username, authed, subnet} = location.state;
	
	useEffect( () => {
		fetch(`/api/subnet.php?username=${username}&subnet=${subnet}`)
		.then( res => res.json() )
		.then( data =>{
			setInfo(data);
		})
	}, []);

	if(location.state === null){
		alert('Invalid access, return to main ');
		navigate(-1);
		return;
	}
	return(
		<div className="App">
			<Mytitle
				text="Edit Existing Subnet"
				goback
				logout
				id={username}
				authed={authed}
				subnet={subnet}
			/>
			<header className ="App-header">
				{info !== null &&( 
				<Configinput username={username} authed = {authed} backPath = "/mypage" data={info} edit="true"/>)
				}
			</header>
		</div>
	);
}
export const Subnetinfopage = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [lease, setLease] = useState([]);
	const [status, setStatus] = useState({
		status: "OFF"
	});
	const {username, authed, subnet} = location.state;
	useEffect(() => {
		fetch(`/api/allocinfo.php?username=${username}&subnet=${subnet}`)
		.then( res => res.json() )
		.then( data => {
			setLease(data);
		});
		fetch(`api/dhcp.php?method=status`)
		.then( res => res.json())
		.then( code => {
			if ( code[0] === "7"){
				setStatus({
					status: "ON"
				});
			}
		})
	}, []);

	const onEditsubnet = () => {
		navigate('/edit', { state:{
			username: username,
			authed: authed,
			subnet: subnet
		}});
	}
	const onDeletesubnet = () => {
		fetch(`/api/deletesubnet.php?username=${username}&subnet=${subnet}`)
		.then( res => res.json() )
		.then( data =>{
			if (data === '1'){
				alert('Deleted Subnet');
				navigate('/mypage', {state: {
					id: username,
					authed: authed
				}
			})}
			else{
				alert('Failed to Delete');
			}
		});
	}
	const ToDate = ({unixt}) => {
		var date = new Date(unixt * 1000);
		return(
			<span>
				{date.toUTCString()}
			</span>
		)
	}
	return(
		<div className="App">
			<Mytitle
				text="Subnet Lease Information"
				goback
				logout
				id={username}
				authed={authed}
				subnet={subnet}
			/>
			<Grid container spacing= {1.5}>
				<Grid item xs={3} >
					<Button onClick={onEditsubnet} variant="outlined" color="success" fullWidth> EDIT SUBNET </Button>
				</Grid>
				<Grid item xs={3}>
					<Button onClick={onDeletesubnet} variant="outlined" color="error" fullWidth> DELETE SUBNET </Button>
				</Grid>
				<Grid item xs={3}>
				DHCP {status.status}
				</Grid>
				<Grid item xs={3}>
					<Dhcpbutton username={username} setStatus={setStatus}/>
				</Grid>
			<Grid item xs={1} />
			<Grid item xs={10}>
				<Box sx={{
					backgroundColor: '#ADD8E6'
				}} >
				Configured IP Address Information
				</Box>
				<TableContainer sx={{fontSize: 40, backgroundColor: '#E6E6FA'}}>
					<Table aria-label="config">
						<TableHead sx={{ fontSize: 60, backgroundColor: '#F0F8FF' }} >
							<TableRow>
								<TableCell> IP ADDRESS </TableCell>
								<TableCell align="right"> LEASED UNTIL </TableCell>
								<TableCell align="right"> MAC ADDRESS </TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{lease.map( row => (
							<TableRow key={row.subnet}>
								<TableCell component="th" scope="row" > {row.ip} </TableCell>
								<TableCell align="right"> <ToDate unixt={row.validt}/> </TableCell>
								<TableCell align="right"> {row.mac} </TableCell>
							</TableRow> 
						))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			</Grid>
		</div>
	);
}
export default Mainpage;
