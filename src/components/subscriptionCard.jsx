import { useSelector } from "react-redux";
import formatNumber from "../functions/formatNumber";
import PayButton from "./payButton";
import PayButtonCrypto from "./payButtonCrypto";

const styles = {
    minWidth: "auto",
    margin: "10px 0"
}

const SubscriptionCard = ({ price, description, title, frequency }) => {

    const { country, factor } = useSelector(state => state.data);

    return (
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-purple-500 hover:scale-1.2 transition">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-4">{description}</p>
            <p className="text-2xl font-bold text-purple-400">{country}{formatNumber(price * (factor || 1))} / {frequency}</p>
            <div className="mt-4 grid row">
                <PayButton
                    title="SUBSCRIBE"
                    showPrice={false}
                    background="rgb(152 112 202)"
                    style={styles}
                />
                <PayButtonCrypto
                    title="PAY WITH CRYPTO"
                    showPrice={false}
                    style={styles}
                />
            </div>
        </div>
    )
}

export default SubscriptionCard;