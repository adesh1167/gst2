import Loading from './loading'

const LoadingButton = ({ children, loading, size, width = 16, height = 16, color = "#000", style = {}, className }) => {
    // console.log(style);
    return (

        loading ?
            <>
                <span style={{ lineHeight: `${Number(size || height)}px`,  display: "inline-flex", justifyContent: 'center', position: 'relative', ...style }} className={className}>
                    <Loading width={size || width} height={size || height} color={color} style={{ position: "absolute" }} />
                    <span style={{ opacity: 0 }}>{children}</span>
                </span>
            </>
            :
            <span style={{ lineHeight: `${Number(size || height)}px`, ...style }}  className={className}>
                {children}
            </span>
    )
}

export default LoadingButton
