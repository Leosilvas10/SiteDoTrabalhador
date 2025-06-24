import {
    PageWrapper,
    Aside,
    ImageContainer,
    ContentWrapper,
    Main,
} from "../../../src/styles/Profile.style";
import Heading from "../../../src/components/Other/Heading.style";
import Auth from "../../Auth";

const UserProfile = (props) => {
    // Verificação crítica
    if (!props) return null;

    const { name } = props;
    
    return (
        <PageWrapper>
            {/* ... restante do código ... */}
        </PageWrapper>
    );
};

UserProfile.getInitialProps = async (ctx) => {
    return Auth(ctx, "user");
};

export default UserProfile;
