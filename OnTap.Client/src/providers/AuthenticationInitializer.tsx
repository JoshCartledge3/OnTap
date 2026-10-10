import {useAuthentication} from '../hooks';

export default function AuthenticationInitializer() {
    useAuthentication(true);
    return null;
}
