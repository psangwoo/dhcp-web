import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {Mainpage, Registerpage, Userpage, Serversubnetpage, Createsubnetpage, Editsubnetpage, Subnetinfopage} from './Pages';


const Routing = () => {
	return(
		<Routes>
			<Route exact path='/' element={<Mainpage />} />
			<Route exact path='/register' element={<Registerpage />} />
			<Route exact path='/mypage' element={<Userpage />} />
			<Route exact path='/create' element={<Createsubnetpage />} />
			<Route exact path='/edit' element={<Editsubnetpage />} />
			<Route exact path='/subnet' element={<Subnetinfopage />} />
			<Route exact path='/server' element={<Serversubnetpage />} />
		</Routes>
	);

};

export default Routing;


