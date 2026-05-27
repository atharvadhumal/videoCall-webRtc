import { useUser } from '../../context/UserContextApi.jsx';
import {Navigate, Outlet} from "react-router-dom";

function IsLogin() {

    const {user, loading} = useUser();
    if(loading) return <div>Loading...</div>
    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export default IsLogin