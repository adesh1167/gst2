import Loading from './loading'

const LoadingButton = ({ children, loading, width = 16, height = 16, color = "#000", style = {} }) => {
    console.log(style);
    return (

        loading ?
            <>
                <span style={{ lineHeight: `${Number(height)}px`,  display: "inline-flex", justifyContent: 'center', position: 'relative', ...style }}>
                    <Loading width={width} height={height} color={color} style={{ position: "absolute" }} />
                    <span style={{ opacity: 0 }}>{children}</span>
                </span>
            </>
            :
            <span style={{ lineHeight: `${Number(height)}px`, ...style }}>
                {children}
            </span>
    )
}

export default LoadingButton
