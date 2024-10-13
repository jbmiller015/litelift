import useToken from '@/hooks/useToken';
import AuthForm from "../../components/AuthForm";
const {token, setToken} = useToken();

return(<AuthForm setToken={setToken}/>);
