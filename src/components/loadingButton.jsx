import Loading from './loading'

const LoadingButton = ({ children, loading, width = 16, height = 16, color = "#000" }) => {
    return (

        loading ?
            <>
                <span style={{ lineHeight: `${Number(height)}px`,  display: "inline-flex", justifyContent: 'center', position: 'relative' }}>
                    <Loading width={width} height={height} color={color} style={{ position: "absolute" }} />
                    <span style={{ opacity: 0 }}>{children}</span>
                </span>
            </>
            :
            <span style={{ lineHeight: `${Number(height)}px` }}>
                {children}
            </span>
    )
}

export default LoadingButton
