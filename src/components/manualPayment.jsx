import { useNavigate, useParams } from 'react-router'
import React from 'react'
import { useSelector } from 'react-redux'
import { countries } from '../data/countries'
import { selectNetTotal } from '../slices/netTotal'
import { unavailablePayments } from '../data/unavaiablePayments'
import formatNumber from '../functions/formatNumber'


const allMethods = {
    matches: {
        bank: {
            text1: (data) => <>
                <p className='my-5'>
                    We understand that payment methods for {data.country} are currently unavailable.
                </p>
                <p className='my-5'>
                    While we are working to make them available, we've made an alternative.
                </p>
                <p className='my-5'>
                    To make payment of <b>{data.currency}{data.amount}</b> for the matches you selected:
                </p>
            </>,

            text2: (data) => <>
                <p className='my-5'>
                    Make payment to the account details below:
                    <b>
                        <br />
                        <br />
                        Name: {data.accountName}
                        <br />
                        {data.bankName && "Account"} Number: {data.accountNumber} <br />
                        {data.bankName ? `Bank: ${data.bankName}` : `Network: ${data.network}`}
                        <br />
                        Amount: {data.currency}{data.amount}
                        <br />
                        Country: {data.country}
                    </b>
                </p>
                <p className='my-5'>
                    Send a screenshot of your payment to{" "}
                    <a href="mailto:contact.globalsportstrade@gmail.com">
                        contact.globalsportstrade@gmail.com
                    </a>
                </p>
            </>
        },
        voucher: {
            text1: (data) => <>
                <p className='my-5'>
                    We understand that payment methods for {data.country} are currently unavailable.
                </p>
                <p className='my-5'>
                    While we are working to make them available, we've made an alternative.
                </p>
                <p>
                    To make payment of <b>{data.currency}{data.amount}</b> for the matches you selected:
                </p>
            </>,

            text2: (data) => <>
                <p className='my-5'>

                    Buy a Voucher of <b>{data.currency}{data.amount}</b> and send to <a href="mailto:contact.globalsportstrade@gmail.com">
                        contact.globalsportstrade@gmail.com
                    </a>
                    <br />
                    <br />
                    <b>
                        Accepted Vouchers: {data.voucherTypes}
                        <br />
                        Amount: {data.amount}
                        <br />
                        Send To: <a href="mailto:contact.globalsportstrade@gmail.com">
                            contact.globalsportstrade@gmail.com
                        </a>
                    </b>
                </p>
            </>
        }
    },
    subscription: {
        bank: {
            text1: (data) => <>
                <p className='my-5'>
                    We understand that payment methods for {data.country} are currently unavailable.
                </p>
                <p className='my-5'>
                    While we are working to make them available, we've made an alternative.
                </p>
                <p className='my-5'>
                    To make payment of <b>{data.currency}{data.amount}</b> for {data.duration} subscription:
                </p>
            </>,

            text2: (data) => <>
                <p className='my-5'>
                    Make payment to the account details below:
                    <b>
                        <br />
                        <br />
                        Name: {data.accountName}
                        <br />
                        {data.bankName && "Account"} Number: {data.accountNumber} <br />
                        {data.bankName ? `Bank: ${data.bankName}` : `Network: ${data.network}`}
                        <br />
                        Amount: {data.currency}{data.amount}
                        <br />
                        Country: {data.country}
                    </b>
                </p>
                <p className='my-5'>
                    Send a screenshot of your payment to{" "}
                    <a href="mailto:contact.globalsportstrade@gmail.com">
                        contact.globalsportstrade@gmail.com
                    </a>
                </p>
            </>
        },
        voucher: {
            text1: (data) => <>
                <p className='my-5'>
                    We understand that payment methods for {data.country} are currently unavailable.
                </p>
                <p className='my-5'>
                    While we are working to make them available, we've made an alternative.
                </p>
                <p>
                    To make payment of <b>{data.currency}{data.amount}</b> for {data.duration} subscription,
                </p>
            </>,

            text2: (data) => <>
                <p className='my-5'>

                    Buy a Voucher of <b>{data.currency}{data.amount}</b> and send to <a href="mailto:contact.globalsportstrade@gmail.com">
                        contact.globalsportstrade@gmail.com
                    </a>
                    <br />
                    <br />
                    <b>
                        Accepted Vouchers: {data.voucherTypes}
                        <br />
                        Amount: {data.amount}
                        <br />
                        Send To: <a href="mailto:contact.globalsportstrade@gmail.com">
                            contact.globalsportstrade@gmail.com
                        </a>
                    </b>
                </p>
            </>
        }
    }
}

const ManualPayment = ({ type = "matches", duration, amount}) => {


    const cartObj = useSelector(state => state.cart);
    const cart = cartObj.items;
    const { factor, country, continent } = useSelector(state => state.data)
    const netTotal = useSelector(selectNetTotal) * factor;

    const total = type === "matches" ? formatNumber(netTotal) : formatNumber(amount);

    const { id } = useParams();

    const navigate = useNavigate();

    if (!country) return;

    const countryDetails = countries[country];
    console.log(countryDetails);

    if (!unavailablePayments.includes(country)) {
        navigate("/cart");
    }

    const methods = allMethods[type];

    return (
        <div className="notice-window fixed">
            <div onClick={() => navigate(-1)} className="blank-space close-notice" />
            <div className="notice-body font-[raleway]">
                <div className="notice-title">Issues With {countryDetails.name} Payment</div>
                <div className="notice-content">
                    {methods.bank.text1({
                        country: countryDetails.name,
                        currency: country,
                        amount: total,
                        duration: duration || id
                    })}

                    {type === "matches" && <ul className='pl-4' style={{ paddingInlineStart: 20, fontWeight: "bold" }}>
                        {cart?.map((item, i) =>
                            <li className='list-disc' key={item.id}>{item.home} - {item.away}</li>
                        )}
                    </ul>}
                    {countryDetails.manualPaymentDetails.map((method, i) => <div key={method.type + i}>

                        {i !== 0 && <p><b>or</b></p>}

                        {methods[method.type].text2({
                            country: countryDetails.name,
                            currency: country,
                            amount: total,
                            accountName: method.accountName,
                            accountNumber: method.accountNumber,
                            bankName: method.bankName,
                            network: method.network,
                            voucherTypes: method.voucherTypes?.join(", ")
                        })}

                    </div>
                    )}
                    <p className='my-5'>
                        An official will confirm your payment within 15 minutes maximum and your
                        dashboard will be updated with the match selections.
                    </p>
                </div>
            </div>
        </div>
    )

}

export default ManualPayment
