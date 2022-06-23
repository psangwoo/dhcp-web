import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
export const MouseOverPop = (props) => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const onMouse = (e) => {
		setAnchorEl(e.currentTarget);
	}
	const offMouse = (e) => {
		setAnchorEl(null);
	}
	const open = Boolean(anchorEl);
	return (
		<div>
			<Typography
				aria-owns={open ? 'popover-config' : undefined}
				aria-haspopup="true"
				onMouseEnter={onMouse}
				onMouseLeave={offMouse}
			>
			{props.hover === undefined
				? <InfoOutlinedIcon sx={{ mr: 1, my: props.hgt === undefined ? 1 : 4, fontSize: 30 }} color="action" />
				: <b className="font-size"> {props.hover} </b>
			}
			</Typography>
			<Popover
				id='popover-config'
				sx={{
					pointerEvents: 'none'
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left'
				}}
				onClose={offMouse}
				disableRestoreFocus
			>
				<Typography sx={{ p: 1 }} > 
				{props.text}
				</Typography>
			</Popover>
		</div>
	);
}

export default MouseOverPop;
