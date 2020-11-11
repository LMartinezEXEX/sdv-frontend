import React, { useState } from 'react';
import { connect } from 'react-redux';
import Input from '../../Input';
import "../../../assets/css/form.css";
import "../../../assets/css/buttons.css";
import axios from 'axios';

const UpdateProfileForm = (props) => {
    const { callbackUsername, callbackPassword, email, authorization } = props

    const [password, setPassword ] = useState("");

    const [newUsername, setNewUsername] = useState("");
    const [newUsernameError, setNewUsernameError] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(false);

    function checkUsername(username) {
        return username.length >= 5 && username.length <= 50;
    }

    function checkPassword(password) {
        return password.length >= 8 && password.length <= 50;
    }

    function handleNewUsernameChange(name, value) {
        if (name === "new-username") {
            if (checkUsername(value)) {
                setNewUsername(value)
            } else {
                setNewUsername("")
            }
        }
    }

    function handlePasswordChange(name, value) {
        if (checkPassword(value)) {
            if (name === "password") {
                setPassword(value)
            } else if (name === "new-password") {
                setNewPassword(value)
            }
        } else {
            if (name === "password") {
                setPassword("")
            } else if (name === "new-password") {
                setNewPassword("")
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const update_username_url = "http://127.0.0.1:8000/user/update/username/"
        const update_password_url = "http://127.0.0.1:8000/user/update/password/"
    
        if (newUsername) {
            await axios(
                update_username_url, {
                method: "PUT",
                data: {
                    email: email,
                    password: password,
                    new_username: newUsername
                },
                headers: {
                    crossDomain: true,
                    "Authorization": authorization
                }
            }).then(response => {
                if (response.status === 200) {
                    callbackUsername(true, newUsername)
                }
            }).catch(error => {
                if (error.response) {
                    alert(JSON.stringify(error.response.data));
                    console.log("Error (response)", error.response.status);
                    console.log("Error (response)", error.response.headers);
                    console.log("Error (response)", error.response.data);
                    setNewUsernameError(true)
                } else if (error.request) {
                    alert(JSON.stringify(error.request));
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
            })
        }
        if (newPassword) {
            await axios(
                update_password_url, {
                method: "PUT",
                data: {
                    email: email,
                    old_password: password,
                    new_password: newPassword
                },
                headers: {
                    crossDomain: true,
                    "Authorization": authorization
                }
            }).then(response => {
                if (response.status === 200) {
                    callbackPassword(true)
                }
            }).catch(error => {
                if (error.response) {
                    alert(JSON.stringify(error.response.data));
                    console.log("Error (response)", error.response.status);
                    console.log("Error (response)", error.response.headers);
                    console.log("Error (response)", error.response.data);
                } else if (error.request) {
                    alert(JSON.stringify(error.request));
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                setNewPasswordError(true)
            })
        }
        if (newUsernameError || newPasswordError) {
            const messageNewUsernameError = (newUsernameError ? "Username" : "")
            const messageNewPasswordError = (newPasswordError ? "Password" : "")
            alert(
                messageNewUsernameError + (newUsernameError ? ", " : "")
                + messageNewPasswordError + (newPasswordError ? ", " : "")
                + " couldn't be updated"
            )
        }
    }
    
    return (
        <form className='profile-container' onSubmit={handleSubmit}>
            <div>
                <label >
                    <Input attribute={{
                        id: 'new-username',
                        name: 'new-username',
                        type: 'text',
                        placeholder: "Nuevo Username"
                    }}
                        handleChange={handleNewUsernameChange}
                    />
                </label>
            </div>
            <div>
                <label >
                    <Input attribute={{
                        id: 'password',
                        name: 'password',
                        type: 'password',
                        required: 'required',
                        placeholder: "Contraseña actual"
                    }}
                        handleChange={handlePasswordChange}
                    />
                </label>
            </div>
            <div>
                <label >
                    <Input attribute={{
                        id: 'new-password',
                        name: 'new-password',
                        type: 'password',
                        placeholder: "Contraseña nueva"
                    }}
                        handleChange={handlePasswordChange}
                    />
                </label>
            </div>
            <input type="submit" name="Update"  className="app-btn small-btn" value="Modificar" />
        </form>
    )
}

const mapStateToProps = (state) => {
  return {
    email: state.user.email,
    authorization: state.user.authorization
  };
}

export default connect(mapStateToProps)(UpdateProfileForm);