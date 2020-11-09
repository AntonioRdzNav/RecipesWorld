//==============================================================================
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//==============================================================================
import Input from "../../reusable/Input/index.jsx";
import Button from "../../reusable/Button/index.jsx";

import { isAnyEmpty, validateEmail } from "../../../utils/Helpers"

import {
    AccountPage,
    AccountContainer,
    AccountTitle,
    AccountLink
} from "../style"

import {
	SIGNUP__ROUTE_PATH,
} from "../../../data/urls"
//==============================================================================

function _Login() {

    const history = useHistory();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isInputMissing, setIsInputMissing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

    const Login = () => {
        if(isAnyEmpty(email, password) || !validateEmail(email)) {
            setIsInputMissing(true);
            return;
        }
        setIsInputMissing(false);
        setIsLoading(true);
        // login
        setEmail("");
        setPassword("");
        setIsLoading(false);
        // redirect to another url
    }       
    
  return (
    <AccountPage>
        <AccountContainer>
            <AccountTitle> Login! </AccountTitle>
            <Input 
                label="Email"
                type="email"
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                checkForMissingField={isInputMissing}
                error={isInputMissing && !validateEmail(email)}
                isLoading={isLoading}
            />
            <Input 
                label="Password"
                type="password"
                required={true}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                checkForMissingField={isInputMissing}
                isLoading={isLoading}
            />
            <AccountLink onClick={() => history.push(SIGNUP__ROUTE_PATH)}> 
                Does not have an account yet? 
            </AccountLink>
            <Button 
                type="info"
                onClick={Login}
                isLoading={isLoading}
                text="Login"
                style={{ width:"100%", padding:"10px 0", fontSize:16, marginTop:30 }}
            />
        </AccountContainer>
    </AccountPage>
  );
}

export default _Login;
