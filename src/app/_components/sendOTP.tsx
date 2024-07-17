"use client"

import React from 'react'

import { api } from '~/trpc/react'

export default function SendOTP() {

    const sendEmail = api.user.sendEmail.useMutation({
        onSuccess: (data, variables) => {
            if (data.success) {
                alert("email sent successfully!");
            } else {
                alert("email sending unsuccessful!");
                console.log({data})
            }
        },
        onError: (error) => {
            alert("email sending unsuccessful!" + error.message);
        }
    })


    const handleSendEmail = () => {
        sendEmail.mutate({ name: "Arush" });
    }

    return (
        <div>
            <h1>Send OTP</h1>
            <button onClick={handleSendEmail} className='bg-black text-white'>send email</button>
        </div>
    )
}
