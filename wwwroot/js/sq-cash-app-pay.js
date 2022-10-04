async function CashAppPay(buttonEl) {
    debugger;


    const paymentRequest = window.payments.paymentRequest(
        // Use global method from sq-payment-flow.js
        window.getPaymentRequest()
    );

    const options = {

        redirectURL: window.location.href,

        referenceId: `my-distinct-${Date.now()}`,
    };

    const cashAppPay = await payments.cashAppPay(
        paymentRequest,
        options
    );

    cashAppPay.addEventListener('ontokenization', (event) => {
        const { tokenResult } = event.detail;

        const tokenStatus = tokenResult.status;
        if (tokenStatus === 'OK') {
            window.createPayment(tokenResult.token);
        }
        else {

        }
    });
    await cashAppPay.attach(buttonEl);
}
