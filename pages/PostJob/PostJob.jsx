// ... imports ...

const PostJob = (props) => {
    // Verificação (mesmo que não use props)
    if (!props) return null;
    
    return (
        <>
            {/* ... restante do código ... */}
        </>
    );
};

PostJob.getInitialProps = async (ctx) => {
    return Auth(ctx, "company");
};

export default PostJob;
