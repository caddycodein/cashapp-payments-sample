
async function main() {
    debugger;
    const payments = Square.payments("sandbox-sq0idb-COn1PSj3RRWKScHcu_roJw", "LNG00D92GB3SC");

    const paymentRequest = payments.paymentRequest({
        countryCode: 'US',
        currencyCode: 'USD',
        total: {
            amount: '1.00',
            label: 'Total',
        },
        requestShippingContact: true,
    });

    const options = {
        redirectURL: window.location.href,
        referenceId: 'my-distinct-reference-id',
    };


    paymentRequest.addEventListener('afterpay_shippingaddresschanged', function (contact) {
        return {
            shippingOptions: [
                {
                    id: 'FREE',
                    amount: '0.00',
                    label: 'Free',
                    taxLineItems: [
                        {
                            id: 'taxItem1',

                            label: 'Taxes',

                            amount: '3.50',
                        }
                    ],
                    total: {
                        amount: '9.29',
                        label: 'Total'
                    }
                }
            ],
        }
    });

    const card = await payments.card();
    const ach = await payments.ach();
    //const applePay = await payments.applePay(paymentRequest);
    const googlePay = await payments.googlePay(paymentRequest);

    const afterpayClearpay = await payments.afterpayClearpay(paymentRequest);

    const cashAppPay = await payments.cashAppPay(paymentRequest, options);


    await card.attach('#card-container');
    await afterpayClearpay.attach('#afterpay-button');
    await googlePay.attach('#google-pay-button');


    async function afterPayEventHandler(event) {

        event.preventDefault();
        try {
            const result = await afterpayClearpay.tokenize();

            if (result.status === 'OK') {
                console.log(`Payment afterpay token is ${result.token}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    async function gPayEventHandler(event) {
        event.preventDefault();
        try {
            const result = await googlePay.tokenize();

            if (result.status === 'OK') {
                console.log(`Payment googlepay token is ${result.token}`);
            }

        } catch (e) {
            console.error(e);
        }
    };

    //async function applePayEventHandler(event) {

    //    event.preventDefault();
    //    try {
    //        const result = await applePay.tokenize();
    //        if (result.status === 'OK') {
    //            console.log(`Payment token is ${result.token}`);
    //        }
    //    } catch (e) {
    //        console.error(e);
    //    }
    //};

    async function achEventHandler(event) {

        event.preventDefault();
        try {
            const result = await ach.tokenize({
                accountHolderName: 'John Doe',
            });

            if (result.status === 'OK') {
                console.log(`Payment ach token is ${result.token}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    async function cardEventHandler(event) {
        event.preventDefault();

        try {
            const result = await card.tokenize();
            if (result.status === 'OK') {
                console.log(`Payment card token is ${result.token}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const cardButton = document.getElementById('card-button');
    cardButton.addEventListener('click', cardEventHandler);

    const achButton = document.getElementById('ach-button');
    achButton.addEventListener('click', achEventHandler);

    //const applePayButtonTarget = document.getElementById('apple-pay-button');
    //applePayButtonTarget.addEventListener('click', applePayEventHandler);

    const googlePayButtonTarget = document.getElementById('google-pay-button');
    googlePayButtonTarget.addEventListener('click', gPayEventHandler);

    const afterpayClearpayButtonTarget = document.getElementById('afterpay-button');
    afterpayClearpayButtonTarget.addEventListener('click', afterPayEventHandler);

    cashAppPay.addEventListener('ontokenization', function (event) {
        const { tokenResult } = event.detail;
        if (tokenResult.status === 'OK') {

            token = tokenResult.token;
            console.log(`Payment cashapp token is ${token}`);
        }
    });

    const cashAppPayButtonTarget = document.getElementById('cash-app-pay');
    cashAppPay.attach(cashAppPayButtonTarget);
}

main();