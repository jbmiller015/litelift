// context/UserContext.tsx

import React, {createContext, useContext, useEffect, useState} from 'react';
import {ObjectId} from 'bson';
import {usePathname, useRouter} from 'next/navigation';

export interface UserPrefs {
    theme: string;
    unit: string;
    increment: number;
}

export interface User {
    _id: ObjectId | string | null;
    name: string;
    password: string;
    prefs: UserPrefs;
}

interface UserData {
    userData: User | null;
}

interface UserContextProps {
    userData: User | null;
    loading: boolean;
    error: unknown;
    fetchUserData: () => void;
    submitUserData: () => void;
    updateUserPrefs: (updatedPrefs: UserPrefs) => void;
    updateUserName: (name: string) => void;
    updateUserPassword: (password: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const [changed, setChanged] = useState(false);

    const resource = pathname.split('/').pop();

    // Fetch user data from API
    const fetchUserData = async () => {
        try {
            const base = process.env.NEXT_PUBLIC_BASE_URL;
            if (!base) {
                throw new Error("Base URL not set in environment variables");
            }
            setLoading(true);
            const res = await fetch(`${base}/api/users/${resource}`, {
                method: 'GET',
                headers: {'Set-Cookie': document.cookie},
            });
            if (!res.ok) throw new Error('Failed to fetch user data');
            const data = await res.json();
            setUserData(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Submit user data to API
    const submitUserData = async () => {
        if (!userData) return;
        const base = process.env.NEXT_PUBLIC_BASE_URL;
        if (!base) {
            throw new Error("Base URL not set in environment variables");
        }
        try {
            setLoading(true);
            const res = await fetch(`${base}/api/users/${resource}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Cookie': document.cookie},
                body: JSON.stringify({userData}),
            });
            if (!res.ok) throw new Error('Failed to submit user data');
            setChanged(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Update user preferences
    const updateUserPrefs = (updatedPrefs: UserPrefs) => {
        setUserData((prev) => (prev ? {...prev, prefs: updatedPrefs} : prev));
        setChanged(true);
    };

    // Update user name
    const updateUserName = (name: string) => {
        setUserData((prev) => (prev ? {...prev, name} : prev));
        setChanged(true);
    };

    // Update user password
    const updateUserPassword = (password: string) => {
        setUserData((prev) => (prev ? {...prev, password} : prev));
        setChanged(true);
    };

    useEffect(() => {
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource]);

    return (
        <UserContext.Provider
            value={{
                userData,
                loading,
                error,
                fetchUserData,
                submitUserData,
                updateUserPrefs,
                updateUserName,
                updateUserPassword,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
