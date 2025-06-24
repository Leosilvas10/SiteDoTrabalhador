import {
    PageWrapper,
    Aside,
    ImageContainer,
    ContentWrapper,
    Main,
    TextContainer,
} from "../../../src/styles/Profile.style";
import Heading from "../../../src/components/Other/Heading.style";
import Auth from "../../Auth";
import Head from "next/head";

const CompanyProfile = (props) => {
    // Verificação crítica
    if (!props) return null;

    const { name, email, description, website, phone, address, logo } = props;
    
    return (
        <>
            <Head>
                <title>Profile: {name}</title>
            </Head>
            <PageWrapper>
                {/* ... restante do código ... */}
            </PageWrapper>
        </>
    );
};

CompanyProfile.getInitialProps = async (ctx) => {
    return Auth(ctx, "company");
};

export default CompanyProfile;
