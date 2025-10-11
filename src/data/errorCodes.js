import { Link } from "react-router";

const errorCodes = {
    "NOT_LOGGED_IN": ({redirect})=> <div className='text-center'>
        <div>Login To Start Using Deep Analyzer</div>
        <div className='p-8'>
            <Link to={"/login"} state={{redirect}} className='login-register-button' style={{ marginRight: 0 }}>LOGIN</Link>
        </div>
    </div>,
    "SUB_EXPIRED": ()=> <div className='text-center'>
        <div className='font-bold mb-4'>Your subscription has expired </div>
        <div>Renew your subscription to continue using DEEP ANALYZER</div>
        <div className='p-8'>
            <Link to={"/deep-analyzer"} className='login-register-button' style={{ marginRight: 0 }}>SUBSCRIBE</Link>
        </div>
    </div>,
    "NO_SUB": ()=> <div className='text-center'>
        <div className='font-bold mb-4'>You do not have a subscription</div>
        <div> Subscribe to start using DEEP ANALYZER</div>
        <div className='p-8'>
            <Link to={"/deep-analyzer"} className='login-register-button' style={{ marginRight: 0 }}>SUBSCRIBE</Link>
        </div>
    </div>,
}

export default errorCodes;