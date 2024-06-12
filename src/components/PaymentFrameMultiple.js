"use client"

import { Frames, CardNumber, ExpiryDate, Cvv } from 'frames-react';
import { useState } from 'react';

// Documentation: https://github.com/checkout/frames-react
// Get Started: https://www.checkout.com/docs/get-started
export default function PaymentFrameSingle(){

    const [isCardValid, setIsCardValid] = useState(null)

    const checkCardValid = () => {
        const valid = Frames.isCardValid();
        setIsCardValid(valid);
    }

    const handleEnable = () => {
        const val = Frames.enableSubmitForm();
        console.log(val);
    }

    // Function to handle tokenization success
    const requestPayment = async (event) => {
        try {

            console.log(event);
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: event.token, preferred_scheme: event.preferred_scheme }),
            });

            const paymentResult = await response.json();

            // If 500
            if(!response.ok){
                alert(`Payment processing failed💥 ${paymentResult.error.error_codes[0]}`);
                return;
            } else {
                alert('Payment processed successfully!✅');
            }

            console.log(paymentResult);

            if (paymentResult.requiresRedirect && paymentResult.redirectLink) {
                // Redirect the user to the 3D Secure page
                window.location.href = paymentResult.redirectLink;
            }
            
        } catch (error) {
            console.error('Payment processing error:', error);
            alert('Payment processing failed💥');
        }
    };

    return (
        <div className='w-1/2 h-auto'>
            <Frames
                config={{
                    publicKey: 'pk_sbox_ffrilzleqqiso6zphoa6dmpr7eo', // Use your own public key
                    localization:'EN-GB',
                    frameSelector: '.card-frame',
                    schemeChoice: true
                }}
                // Triggered after a card is tokenized.
                cardTokenized={requestPayment}
                // Triggered when Frames is registered on the global namespace and safe to use.
                ready={() => {console.log('Frame is ready');}}
                // Triggered when the form is rendered.
                frameActivated={(e) => {console.log('frameActivated', e);}}
                // Triggered when an input field receives focus. Use it to check the validation status and apply the wanted UI changes.
                frameFocus={(e) => {console.log('frameFocus', e);}}
                // Triggered after an input field loses focus. Use it to check the validation status and apply the wanted UI changes.
                frameBlur={(e) => {console.log('frameBlur', e);}}
                // Triggered when a field's validation status has changed. Use it to show error messages or update the UI.
                frameValidationChanged={(e) => {console.log('frameValidationChanged', e);}}
                // Triggered when a valid payment method is detected based on the card number being entered. Use this event to change the card icon.
                paymentMethodChanged={(e) => {console.log('paymentMethodChanged', e);}}
                // Triggered when the state of the card validation changes.
                cardValidationChanged={(e) => {console.log('cardValidationChanged', e);}}
                // Triggered when the card form has been submitted.
                cardSubmitted={() => {console.log('cardSubmitted');}}
                // Triggered if card tokenization failed.
                cardTokenizationFailed={(e) => {console.log('cardTokenizationFailed', e);}}
                // Triggered when the user inputs or changes the first 8 digits of a card.
                cardBinChanged={(e) => {console.log('cardBinChanged', e);}}
            >

                <CardNumber />
                <ExpiryDate />
                <Cvv />

                <div className='flex flex-col'>
                    <button
                        className='btn btn-primary my-4'
                        onClick={() => {
                            Frames.submitCard();
                        }}
                    >
                        PAY 
                    </button>

                    <button
                        className='btn btn-neutral mb-4'
                        onClick={checkCardValid}
                    >
                        Is card valid?
                    </button>
                    <div>
                        {isCardValid === null ? '' : isCardValid ? 'Card is valid' : 'Card is invalid'}
                    </div>

                    <button
                        className='btn btn-neutral mb-4'
                        onClick={handleEnable}
                    >
                        enableSubmitForm
                    </button>
                </div>

            </Frames>
        </div>

    );
};