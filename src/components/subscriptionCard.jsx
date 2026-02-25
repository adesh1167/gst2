import { useSelector } from "react-redux";
import formatNumber from "../functions/formatNumber";
import PayButton from "./payButton";
import PayButtonCrypto from "./payButtonCrypto";
import PayForSubscriptionWrapper from "./payForSubscriptionWrapper";
import { baseApiUrl } from "../data/url";
import { useMemo } from "react";

const styles = {
    minWidth: "auto",
    margin: "10px 0"
}

const SubscriptionCard = ({ price, description, title, frequency, type }) => {

    const { country, factor, continent } = useSelector(state => state.data);

    const isAfrica = useMemo(() => continent === "AF", [continent]);

    return (
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-purple-500 hover:scale-1.2 transition">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-4">{description}</p>
            <p className="text-lg font-bold text-purple-500 orbitron-regular"><span className="text-2xl font-bold">{country}{formatNumber(price * (factor || 1))}</span> / {frequency}</p>
            <div className="mt-4 grid row">
                {isAfrica && <PayForSubscriptionWrapper
                    title={`Deep Analyzer ${frequency} Subscription`}
                    type={type}
                    showPrice={false}
                    style={styles}
                    background="rgb(152 112 202)"
                />}
                <PayButtonCrypto
                    title="SUB WITH CRYPTO"
                    showPrice={false}
                    style={styles}
                    payload={{
                        type: type
                    }}
                    defaultCurrency={false}
                    ready={true}
                    background={isAfrica ? "" : "rgb(152 112 202)"}
                    initiateLink={`${baseApiUrl}/initiate-subscription-crypto.php`}
                />
            </div>
        </div>
    )
}

export default SubscriptionCard;