import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import toast from 'react-hot-toast';
// Create the UserContext

export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

        if (token) {
            setToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        if (user) {
            setUser(user);
        }
    }, [])

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000; // in seconds

                if (decoded.exp < currentTime) {
                    // Token has expired
                    setToken(null);
                    setUser(null);
                    localStorage.clear();
                    sessionStorage.clear();
                    axios.defaults.headers.common['Authorization'] = '';
                    navigate('/login');
                } else {
                    const timeLeft = (decoded.exp - currentTime) * 1000;
                    const timeoutId = setTimeout(() => {
                        toast.error('Session has expired. Please log in again.', {
                            style: {
                                border: '1px solid #52525B',
                                padding: '16px',
                                color: '#EAB308',
                                background: '#18181B'
                            },
                            iconTheme: {
                                primary: '#EAB308',
                                secondary: '#52525B',
                            },
                        });
                        setToken(null);
                        setUser(null);
                        localStorage.clear();
                        sessionStorage.clear();
                        axios.defaults.headers.common['Authorization'] = '';
                        navigate('/login');
                    }, timeLeft);

                    return () => clearTimeout(timeoutId);
                }
            } catch (error) {
                console.log("Failed to decode token", error)
            }
        }
    }, [token]);
    const value = {
        navigate,
        token,
        setToken,
        user,
        setUser,
        projects,
        setProjects
    }
    return (


        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
}